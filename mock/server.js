/**
 * Mock API 서버 (Spring 백엔드 흉내)
 *
 * 목적: 실제 Spring 서버 개발 이전에, 동일한 "계약(contract)"으로 로컬 개발을 가능하게 한다.
 *   - 모든 응답을 공통 envelope `{ success, code, msg, payload }`로 반환
 *   - /auth/login, /auth/refresh-token 등 JWT 인증 엔드포인트를 Spring 형태로 흉내
 *   - 나머지 컬렉션(/products, /accounts ...)은 db.json을 그대로 서빙
 *
 * 의존성 없음(Node 내장 http만 사용). 데이터는 메모리에 올려 사용하며 db.json에 기록하지 않는다.
 * (db.json을 수정했다면 서버 재시작 필요)
 *
 * 실행: node mock/server.js   (PORT 환경변수로 포트 변경 가능, 기본 3333)
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = Number(process.env.PORT ?? 3333);
const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'db.json');

/** @type {Record<string, Array<any>>} */
const db = JSON.parse(readFileSync(DB_PATH, 'utf-8'));

// mock 공통 비밀번호 (로그인 폼이 sha256 해시로 전송하므로 동일하게 해싱해 비교)
const MOCK_PASSWORD = '1111';
const sha256 = (text) => createHash('sha256').update(text).digest('hex');

// 토큰 만료시각: 먼 미래(yyyyMMddHHmmss) → mock에서는 만료/재발급이 사실상 발생하지 않음
const FAR_FUTURE = '20991231235959';

const envelope = (payload, { success = true, code = '0', msg = 'success' } = {}) =>
  JSON.stringify({ success, code, msg, payload });

const omitRefreshCookieFields = ({ refreshToken, refreshTokenExpiresAt, ...payload }) => payload;

const refreshCookie = (refreshToken) =>
  `refreshToken=${encodeURIComponent(refreshToken)}; HttpOnly; SameSite=Lax; Path=/auth/refresh-token`;

/** 로그인/리프레시 응답 payload (Spring 형태) */
const makeAuthPayload = (usrId) => {
  const user = (db.users ?? []).find((u) => u.usrId === usrId);
  const stamp = Date.now();
  return {
    usrId,
    usrNm: user?.usrNm ?? '목업사용자',
    positDivName: user?.positDivName ?? '프로',
    deptName: user?.deptName ?? 'Channel Unit',
    usrPwd: null,
    accessToken: `mock-access-${stamp}`,
    accessTokenExpiresAt: FAR_FUTURE,
    refreshToken: `mock-refresh-${stamp}`,
    refreshTokenExpiresAt: FAR_FUTURE,
    roles: user?.roles ?? ['ROLE_USER'],
  };
};

const send = (req, res, status, bodyStr, headers = {}) => {
  const origin = req.headers.origin ?? '*';
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    Vary: 'Origin',
    ...headers,
  });
  res.end(bodyStr);
};

const readBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf-8');
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

// accounts는 id가 없고 accountNo를 식별자로 사용 → 둘 다 매칭
const matchId = (item, id) => String(item.id) === id || String(item.accountNo) === id;

const server = createServer(async (req, res) => {
  const method = req.method ?? 'GET';
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  const path = url.pathname;

  // CORS preflight
  if (method === 'OPTIONS') return send(req, res, 204, '');

  // ── 인증 (JWT 흉내) ──
  if (path === '/auth/login' && method === 'POST') {
    const body = await readBody(req);
    const user = (db.users ?? []).find((u) => u.usrId === body.usrId);
    const passwordOk = body.usrPwd === sha256(MOCK_PASSWORD);
    // 아이디(db.json users에 존재) + 비밀번호(1111) 둘 다 일치해야 통과
    if (!user || !passwordOk) {
      return send(
        req,
        res,
        200,
        envelope(null, { success: false, code: '-1003', msg: '아이디 또는 비밀번호가 올바르지 않습니다.' }),
      );
    }
    const authPayload = makeAuthPayload(body.usrId);
    return send(req, res, 200, envelope(omitRefreshCookieFields(authPayload)), {
      'Set-Cookie': refreshCookie(authPayload.refreshToken),
    });
  }
  if (path === '/auth/refresh-token' && method === 'POST') {
    const authPayload = makeAuthPayload(db.users?.[0]?.usrId ?? 'mockuser');
    return send(req, res, 200, envelope(omitRefreshCookieFields(authPayload)), {
      'Set-Cookie': refreshCookie(authPayload.refreshToken),
    });
  }
  if (path === '/auth/logout' && method === 'POST') {
    return send(req, res, 200, envelope(null), {
      'Set-Cookie': 'refreshToken=; HttpOnly; SameSite=Lax; Path=/auth/refresh-token; Max-Age=0',
    });
  }

  // ── 컬렉션 CRUD: /:name, /:name/:id ──
  let [name, id] = path.split('/').filter(Boolean);
  if (name === 'product') {
    name = 'products';
    if (id === 'list') id = undefined;
  }
  const collection = name ? db[name] : undefined;

  if (!Array.isArray(collection)) {
    return send(
      req,
      res,
      404,
      envelope(null, { success: false, code: '-4001', msg: `Not found: ${path}` }),
    );
  }

  // GET /:name (쿼리 파라미터로 단순 equality 필터, _ 접두 키는 무시)
  if (method === 'GET' && !id) {
    const filters = [...url.searchParams.entries()].filter(([k]) => !k.startsWith('_'));
    const items = filters.length
      ? collection.filter((it) => filters.every(([k, v]) => String(it[k]) === v))
      : collection;
    return send(req, res, 200, envelope(items));
  }

  // GET /:name/:id
  if (method === 'GET' && id) {
    const item = collection.find((it) => matchId(it, id));
    return item
      ? send(req, res, 200, envelope(item))
      : send(req, res, 200, envelope(null, { success: false, code: '-4001', msg: '데이터 없음' }));
  }

  // POST /:name
  if (method === 'POST' && !id) {
    const body = await readBody(req);
    const created = { id: body.id ?? Date.now(), ...body };
    collection.push(created);
    return send(req, res, 201, envelope(created));
  }

  // PUT / PATCH /:name/:id
  if ((method === 'PUT' || method === 'PATCH') && id) {
    const body = await readBody(req);
    const idx = collection.findIndex((it) => matchId(it, id));
    if (idx === -1) {
      return send(req, res, 200, envelope(null, { success: false, code: '-4001', msg: '데이터 없음' }));
    }
    collection[idx] = method === 'PUT' ? { ...body } : { ...collection[idx], ...body };
    return send(req, res, 200, envelope(collection[idx]));
  }

  // DELETE /:name/:id
  if (method === 'DELETE' && id) {
    const idx = collection.findIndex((it) => matchId(it, id));
    if (idx !== -1) collection.splice(idx, 1);
    return send(req, res, 200, envelope(null));
  }

  return send(req, res, 404, envelope(null, { success: false, code: '-4001', msg: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`🟢 Mock API (Spring 흉내) → http://localhost:${PORT}`);
  console.log('   인증:  POST /auth/login · /auth/refresh-token · /auth/logout');
  console.log(`   컬렉션: GET/POST/PUT/PATCH/DELETE /{${Object.keys(db).join(', ')}}`);
  console.log('   모든 응답: { success, code, msg, payload }');
  console.log('   ※ db.json 변경 시 서버 재시작 필요');
});
