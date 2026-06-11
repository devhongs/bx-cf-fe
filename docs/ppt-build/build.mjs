import pptxgen from 'pptxgenjs';

const pptx = new pptxgen();
pptx.defineLayout({ name: 'W', width: 13.333, height: 7.5 });
pptx.layout = 'W';
pptx.author = 'BX-CF';
pptx.title = 'BX-CF Enterprise Frontend Framework';

// ---- palette ----
const C = {
  bgDark: '0F1535',
  panel: '1B2350',
  panel2: '232C5C',
  white: 'FFFFFF',
  ice: 'A9B4E0',
  iceDim: '7F8AC0',
  blue: '5B8DEF',
  teal: '2DD4BF',
  amber: 'F6B454',
  coral: 'F96167',
  // light slides
  light: 'FFFFFF',
  card: 'F4F6FB',
  cardLine: 'E4E8F4',
  ink: '13183B',
  inkDim: '5A6286',
};
const HF = 'Malgun Gothic';      // header (Korean-safe)
const BF = 'Malgun Gothic';      // body
const MF = 'Consolas';           // mono

const W = 13.333, H = 7.5;

// ---------- helpers ----------
function pageNum(s, n, dark = false) {
  s.addText(`${n}`, { x: W - 0.9, y: H - 0.55, w: 0.5, h: 0.35, align: 'right',
    fontFace: BF, fontSize: 10, color: dark ? C.iceDim : C.inkDim });
  s.addText('BX-CF', { x: 0.5, y: H - 0.55, w: 1.5, h: 0.35, align: 'left',
    fontFace: BF, fontSize: 10, bold: true, color: dark ? C.iceDim : C.inkDim, charSpacing: 2 });
}
function header(s, kicker, title) {
  s.addText(kicker.toUpperCase(), { x: 0.6, y: 0.5, w: 11, h: 0.3, fontFace: BF,
    fontSize: 12, bold: true, color: C.blue, charSpacing: 3 });
  s.addText(title, { x: 0.6, y: 0.78, w: 12, h: 0.7, fontFace: HF, fontSize: 30,
    bold: true, color: C.ink });
}
function chip(s, x, y, w, label, color) {
  s.addShape('roundRect', { x, y, w, h: 0.34, rectRadius: 0.17, fill: { color: C.light },
    line: { color, width: 1 } });
  s.addText(label, { x, y, w, h: 0.34, align: 'center', fontFace: BF, fontSize: 11,
    bold: true, color });
}

// ============================================================
// 1. TITLE (dark)
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.bgDark };
  // subtle motif: stacked rounded squares top-right
  for (let i = 0; i < 3; i++) {
    s.addShape('roundRect', { x: 10.4 + i * 0.18, y: 0.7 + i * 0.18, w: 2.2, h: 2.2,
      rectRadius: 0.18, fill: { type: 'solid', color: C.panel, transparency: i * 22 },
      line: { color: C.blue, width: i === 0 ? 1.5 : 0 } });
  }
  s.addText('19', { x: 10.4, y: 0.7, w: 2.2, h: 2.2, align: 'center', valign: 'middle',
    fontFace: HF, fontSize: 60, bold: true, color: C.blue });
  s.addText('REACT', { x: 10.4, y: 2.5, w: 2.2, h: 0.4, align: 'center', fontFace: BF,
    fontSize: 13, bold: true, color: C.ice, charSpacing: 4 });

  s.addText('ENTERPRISE FRONTEND FRAMEWORK', { x: 0.9, y: 2.45, w: 9, h: 0.4,
    fontFace: BF, fontSize: 13, bold: true, color: C.teal, charSpacing: 3 });
  s.addText('BX-CF', { x: 0.85, y: 2.8, w: 11, h: 1.1, fontFace: HF, fontSize: 66,
    bold: true, color: C.white });
  s.addText('금융·자산관리 웹 애플리케이션 프레임워크', { x: 0.9, y: 3.95, w: 11, h: 0.6,
    fontFace: HF, fontSize: 24, color: C.ice });

  // tech line
  s.addShape('line', { x: 0.95, y: 4.85, w: 5.2, h: 0, line: { color: C.panel2, width: 1.5 } });
  s.addText(
    [
      { text: 'React 19', options: { color: C.white, bold: true } },
      { text: '  ·  TypeScript  ·  Vite  ·  pnpm + Turborepo  ·  FSD', options: { color: C.ice } },
    ],
    { x: 0.9, y: 5.0, w: 11, h: 0.4, fontFace: BF, fontSize: 15 });
  s.addText('Monorepo Architecture  ·  PC · Mobile · Admin  ·  @bx/shared', { x: 0.9, y: 5.42,
    w: 11, h: 0.4, fontFace: BF, fontSize: 13, color: C.iceDim });
  pageNum(s, 1, true);
}

// ============================================================
// 2. OVERVIEW (light)
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.light };
  header(s, 'Overview', '프로젝트 개요');
  s.addText('초고속 빌드 성능과 극대화된 DX(Developer Experience)를 지향하는 엔터프라이즈급 프론트엔드 프레임워크. pnpm Workspaces + Turborepo 모노레포에서 PC·모바일·관리자 웹이 도메인 로직·UI·통신·인증을 단일 공유 패키지(@bx/shared)로 공유합니다.',
    { x: 0.6, y: 1.6, w: 12.1, h: 0.9, fontFace: BF, fontSize: 14, color: C.inkDim, lineSpacingMultiple: 1.2 });

  const cards = [
    ['⚡', '초고속 빌드 & DX', 'Vite 8 + Rolldown · React Compiler · Turborepo 캐싱으로 빌드·HMR 최적화', C.blue],
    ['📐', 'Feature-Sliced Design', 'entities / features / widgets / pages 계층으로 확장 가능한 구조 표준화', C.teal],
    ['📦', '단일 공유 패키지', '@bx/shared가 도메인·UI·HTTP·인증을 캡슐화해 앱 간 중복 제거', C.amber],
    ['🔐', '엔터프라이즈 인증', 'JWT 자동 부착·single-flight 재발급·라우트 가드 내장', C.coral],
  ];
  const cx = [0.6, 6.83], cy = [2.75, 5.0];
  cards.forEach((c, i) => {
    const x = cx[i % 2], y = cy[Math.floor(i / 2)];
    s.addShape('roundRect', { x, y, w: 5.9, h: 2.0, rectRadius: 0.1, fill: { color: C.card },
      line: { color: C.cardLine, width: 1 } });
    s.addShape('roundRect', { x: x + 0.3, y: y + 0.3, w: 0.7, h: 0.7, rectRadius: 0.12,
      fill: { color: C.light }, line: { color: c[3], width: 1.5 } });
    s.addText(c[0], { x: x + 0.3, y: y + 0.3, w: 0.7, h: 0.7, align: 'center', valign: 'middle', fontSize: 20 });
    s.addText(c[1], { x: x + 1.2, y: y + 0.32, w: 4.5, h: 0.5, fontFace: HF, fontSize: 16, bold: true, color: C.ink, valign: 'middle' });
    s.addText(c[2], { x: x + 0.3, y: y + 1.15, w: 5.3, h: 0.7, fontFace: BF, fontSize: 12.5, color: C.inkDim, lineSpacingMultiple: 1.1 });
  });
  pageNum(s, 2);
}

// ============================================================
// 3. TECH STACK (light)
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.light };
  header(s, 'Tech Stack', '기술 스택 · 라이브러리 구성');

  const groups = [
    ['코어', C.blue, ['React 19', 'TypeScript 6', 'Vite 8 (Rolldown)', 'React Compiler']],
    ['모노레포', C.teal, ['pnpm Workspaces', 'Turborepo', 'Biome', 'Madge']],
    ['라우팅 · 상태', C.amber, ['TanStack Router', 'TanStack Query', 'Zustand', 'React Hook Form']],
    ['UI · 스타일', C.coral, ['Tailwind CSS 4', 'Radix Dialog', 'vaul (drawer)', 'lucide-react']],
    ['통신 · 유틸', '8B7CF6', ['Axios', 'date-fns · dayjs', 'lodash-es', 'i18next · uuid']],
    ['테스트 · Mock', '0EA5A4', ['Playwright (E2E)', 'Vitest', 'Testing Library', 'json-server']],
  ];
  const colX = [0.6, 4.83, 9.06], rowY = [1.75, 4.45];
  groups.forEach((g, i) => {
    const x = colX[i % 3], y = rowY[Math.floor(i / 3)];
    const w = 3.9, h = 2.45;
    s.addShape('roundRect', { x, y, w, h, rectRadius: 0.1, fill: { color: C.card }, line: { color: C.cardLine, width: 1 } });
    s.addShape('roundRect', { x, y, w: 0.14, h, rectRadius: 0.05, fill: { color: g[1] }, line: { type: 'none' } });
    s.addText(g[0], { x: x + 0.35, y: y + 0.22, w: w - 0.5, h: 0.45, fontFace: HF, fontSize: 16, bold: true, color: C.ink });
    s.addText(g[2].map((t) => ({ text: t, options: { bullet: { code: '2022', indent: 12 }, color: C.inkDim } })),
      { x: x + 0.4, y: y + 0.78, w: w - 0.6, h: 1.5, fontFace: BF, fontSize: 12.5, lineSpacingMultiple: 1.25, color: g[1] });
  });
  pageNum(s, 3);
}

// ============================================================
// 4. MONOREPO (light)
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.light };
  header(s, 'Monorepo', '모노레포 구성 · 3 Apps + Shared');

  // shared package banner
  s.addShape('roundRect', { x: 0.6, y: 1.7, w: 12.1, h: 1.05, rectRadius: 0.1, fill: { color: C.bgDark } });
  s.addText('packages/shared', { x: 0.95, y: 1.86, w: 4, h: 0.35, fontFace: MF, fontSize: 13, bold: true, color: C.teal });
  s.addText('@bx/shared', { x: 0.95, y: 2.18, w: 5, h: 0.45, fontFace: HF, fontSize: 20, bold: true, color: C.white });
  s.addText('도메인(entities) · 공통 UI · HTTP(httpService) · 인증(JWT) · 상수 — 세 앱이 함께 사용하는 단일 공유 패키지',
    { x: 5.6, y: 1.86, w: 6.9, h: 0.8, fontFace: BF, fontSize: 12.5, color: C.ice, valign: 'middle', lineSpacingMultiple: 1.1 });

  // three apps
  const apps = [
    ['💻', 'PC 웹', 'pc-web', ':3000', 'FSD 앱 · 중앙 다이얼로그 모달', C.blue],
    ['📱', '모바일 웹', 'mobile-web', ':3001', 'FSD 앱(동일 구조) · 풀스크린 모달', C.teal],
    ['⚙️', '관리자 포탈', 'admin-portal', ':3002', '스켈레톤(템플릿) 단계', C.amber],
  ];
  const ax = [0.6, 4.83, 9.06];
  apps.forEach((a, i) => {
    const x = ax[i], y = 3.15, w = 3.9, h = 2.75;
    s.addShape('roundRect', { x, y, w, h, rectRadius: 0.1, fill: { color: C.card }, line: { color: C.cardLine, width: 1 } });
    // connector up to shared
    s.addShape('line', { x: x + w / 2, y: 2.75, w: 0, h: 0.4, line: { color: C.cardLine, width: 2, dashType: 'dash' } });
    s.addShape('roundRect', { x: x + 0.3, y: y + 0.3, w: 0.85, h: 0.85, rectRadius: 0.14, fill: { color: C.light }, line: { color: a[5], width: 1.5 } });
    s.addText(a[0], { x: x + 0.3, y: y + 0.3, w: 0.85, h: 0.85, align: 'center', valign: 'middle', fontSize: 26 });
    s.addText(a[1], { x: x + 1.3, y: y + 0.34, w: w - 1.5, h: 0.4, fontFace: HF, fontSize: 17, bold: true, color: C.ink });
    s.addText([{ text: a[2] + '  ', options: { fontFace: MF, color: a[5], bold: true } }, { text: a[3], options: { fontFace: MF, color: C.inkDim } }],
      { x: x + 1.3, y: y + 0.74, w: w - 1.5, h: 0.4, fontSize: 12 });
    s.addShape('line', { x: x + 0.3, y: y + 1.45, w: w - 0.6, h: 0, line: { color: C.cardLine, width: 1 } });
    s.addText(a[4], { x: x + 0.3, y: y + 1.6, w: w - 0.6, h: 1.0, fontFace: BF, fontSize: 12.5, color: C.inkDim, lineSpacingMultiple: 1.15 });
  });
  pageNum(s, 4);
}

// ============================================================
// 5. FSD ARCHITECTURE (light)
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.light };
  header(s, 'Frontend Architecture', 'Feature-Sliced Design 계층');

  const layers = [
    ['app', '전역 프로바이더 · 진입점 (main.tsx, modal provider)', C.coral, 12.1],
    ['routes', 'TanStack Router 파일 기반 라우팅 — (auth) · (page) · (modal)', '8B7CF6', 11.2],
    ['pages', '라우트에 매핑되는 페이지 컴포넌트', C.blue, 10.3],
    ['widgets', '레이아웃 단위 위젯 (sidebar 등)', C.amber, 9.4],
    ['features', '기능 단위 (auth, dashboard …)', '0EA5A4', 8.5],
    ['entities', '도메인 단위 — account · alarm · auth · menu · product · user', C.teal, 7.6],
    ['shared', '앱 로컬 공통 (guards 등) + @bx/shared 공유 자원', C.iceDim, 6.7],
  ];
  let y = 1.75;
  layers.forEach((l) => {
    const w = l[3], h = 0.62;
    s.addShape('roundRect', { x: 0.6, y, w, h, rectRadius: 0.08, fill: { color: C.card }, line: { color: l[2], width: 1.25 } });
    s.addShape('roundRect', { x: 0.6, y, w: 1.55, h, rectRadius: 0.08, fill: { color: l[2] } });
    s.addText(l[0], { x: 0.6, y, w: 1.55, h, align: 'center', valign: 'middle', fontFace: MF, fontSize: 14, bold: true, color: C.white });
    s.addText(l[1], { x: 2.35, y, w: w - 1.9, h, valign: 'middle', fontFace: BF, fontSize: 12.5, color: C.ink });
    y += 0.715;
  });
  // arrow note
  s.addText('의존성 방향 ↓ (상위 → 하위만 참조)', { x: 8.9, y: 1.78, w: 3.8, h: 0.4, align: 'right',
    fontFace: BF, fontSize: 11, italic: true, color: C.inkDim });
  pageNum(s, 5);
}

// ============================================================
// 6. FOLDER TREE (light)
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.light };
  header(s, 'Folder Structure', '폴더 구조 한눈에 보기');

  // left: root + apps tree
  s.addShape('roundRect', { x: 0.6, y: 1.7, w: 6.0, h: 5.2, rectRadius: 0.1, fill: { color: C.bgDark } });
  const tree1 = [
    ['bx-cf-fe/', C.teal, 0],
    ['├─ package.json · turbo.json', C.ice, 1],
    ['├─ pnpm-workspace.yaml', C.ice, 1],
    ['├─ biome.json · tsconfig.json', C.ice, 1],
    ['├─ db.json  (json-server mock)', C.iceDim, 1],
    ['├─ docs/  (order · todo · wbs)', C.iceDim, 1],
    ['│', C.iceDim, 0],
    ['└─ apps/', C.amber, 0],
    ['    ├─ pc-web/        :3000', C.white, 1],
    ['    │   └─ src/', C.ice, 1],
    ['    │       app · routes · pages', C.iceDim, 2],
    ['    │       features · widgets · shared', C.iceDim, 2],
    ['    ├─ mobile-web/    :3001', C.white, 1],
    ['    └─ admin-portal/  :3002', C.white, 1],
  ];
  let ty = 1.95;
  tree1.forEach((t) => {
    s.addText(t[0], { x: 0.85, y: ty, w: 5.6, h: 0.3, fontFace: MF, fontSize: 12.5, color: t[1] });
    ty += 0.345;
  });

  // right: shared tree
  s.addShape('roundRect', { x: 6.85, y: 1.7, w: 5.85, h: 5.2, rectRadius: 0.1, fill: { color: C.panel } });
  const tree2 = [
    ['packages/shared/src/', C.teal, 0],
    ['├─ entities/', C.amber, 0],
    ['│   └─ <entity>/', C.white, 1],
    ['│       ├─ api/    HTTP 호출', C.ice, 2],
    ['│       ├─ model/  타입·hook·store', C.ice, 2],
    ['│       └─ ui/     도메인 컴포넌트', C.ice, 2],
    ['│', C.iceDim, 0],
    ['├─ shared/', C.amber, 0],
    ['│   ├─ ajax/      http.service', C.ice, 1],
    ['│   ├─ constants/ api·errors·config', C.ice, 1],
    ['│   ├─ ui/        dialog·drawer·modal', C.ice, 1],
    ['│   └─ hooks·lib·model·types', C.ice, 1],
    ['│', C.iceDim, 0],
    ['└─ index.ts  (배럴 일괄 export)', C.teal, 0],
  ];
  ty = 1.95;
  tree2.forEach((t) => {
    s.addText(t[0], { x: 7.1, y: ty, w: 5.5, h: 0.3, fontFace: MF, fontSize: 12.5, color: t[1] });
    ty += 0.345;
  });
  pageNum(s, 6);
}

// ============================================================
// 7. SYSTEM FLOW (dark) — diagram
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.bgDark };
  s.addText('SYSTEM FLOW', { x: 0.6, y: 0.5, w: 11, h: 0.3, fontFace: BF, fontSize: 12, bold: true, color: C.teal, charSpacing: 3 });
  s.addText('전체 시스템 흐름 · 프론트 ↔ 백엔드 ↔ 외부', { x: 0.6, y: 0.78, w: 12, h: 0.7, fontFace: HF, fontSize: 30, bold: true, color: C.white });

  const boxW = 2.7, boxH = 1.5, midY = 2.5;
  function node(x, title, sub, color, lines) {
    s.addShape('roundRect', { x, y: midY, w: boxW, h: boxH, rectRadius: 0.12, fill: { color: C.panel }, line: { color, width: 1.5 } });
    s.addText(title, { x, y: midY + 0.18, w: boxW, h: 0.45, align: 'center', fontFace: HF, fontSize: 16, bold: true, color });
    s.addText(lines.map((t) => ({ text: t, options: { breakLine: true } })), { x: x + 0.15, y: midY + 0.62, w: boxW - 0.3, h: 0.8, align: 'center', fontFace: BF, fontSize: 10.5, color: C.ice, lineSpacingMultiple: 1.05 });
  }
  const xs = [0.6, 3.75, 6.9, 10.05];
  node(xs[0], 'Client Apps', '', C.blue, ['PC · Mobile · Admin', 'React 19 + FSD']);
  node(xs[1], 'httpService', '', C.teal, ['Axios 인스턴스', 'envelope · 인터셉터']);
  node(xs[2], 'Backend', '', C.amber, ['Spring (JWT)', 'or json-server Mock']);
  node(xs[3], 'External', '', C.coral, ['금융·자산 API', '인증 토큰 발급']);

  // arrows
  for (let i = 0; i < 3; i++) {
    s.addShape('line', { x: xs[i] + boxW, y: midY + boxH / 2, w: xs[i + 1] - xs[i] - boxW, h: 0,
      line: { color: C.iceDim, width: 2, endArrowType: 'triangle' } });
  }
  // request / response labels
  s.addText('요청  →  Bearer 토큰 자동 부착', { x: 0.6, y: midY - 0.5, w: 9.4, h: 0.35, align: 'center', fontFace: BF, fontSize: 11.5, bold: true, color: C.teal });
  s.addText('←  응답  payload 자동 언래핑 · 401/-1004 시 자동 재발급', { x: 3.0, y: midY + boxH + 0.35, w: 9.5, h: 0.35, align: 'center', fontFace: BF, fontSize: 11.5, bold: true, color: C.amber });

  // bottom strip: env switch
  s.addShape('roundRect', { x: 0.6, y: 5.5, w: 12.1, h: 1.35, rectRadius: 0.1, fill: { color: C.panel } });
  s.addText('백엔드 전환은 코드 수정 없이 .env 한 줄', { x: 0.95, y: 5.65, w: 11.5, h: 0.4, fontFace: HF, fontSize: 15, bold: true, color: C.white });
  s.addText([
    { text: 'VITE_API_URL', options: { fontFace: MF, color: C.teal, bold: true } },
    { text: ' = …:18081/channel/backend/api/v1  (Spring · JWT)    또는    …:3333  (Mock · 인증 OFF)', options: { fontFace: MF, color: C.ice } },
  ], { x: 0.95, y: 6.1, w: 11.5, h: 0.6, fontSize: 12.5 });
  pageNum(s, 7, true);
}

// ============================================================
// 8. HTTP & ENVELOPE (light)
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.light };
  header(s, 'Communication', 'HTTP 통신 계층 · 공통 응답 규격');

  // left: httpService points
  const pts = [
    ['단일 진입점', '모든 호출은 httpService.get/post/… 사용 · baseURL은 init()에서 1회 설정'],
    ['상대 경로', '각 API 함수는 상대 경로만 전달  (예: httpService.get(\'/products\'))'],
    ['자동 언래핑', 'execute()가 envelope의 payload를 풀어 반환 · success:false는 throw'],
    ['Mock 보정', 'IS_MOCK_API일 때 raw JSON을 envelope로 감싸는 인터셉터 적용'],
  ];
  let y = 1.8;
  pts.forEach((p, i) => {
    s.addShape('roundRect', { x: 0.6, y, w: 6.3, h: 1.12, rectRadius: 0.09, fill: { color: C.card }, line: { color: C.cardLine, width: 1 } });
    s.addShape('roundRect', { x: 0.8, y: y + 0.32, w: 0.48, h: 0.48, rectRadius: 0.1, fill: { color: C.blue } });
    s.addText(`${i + 1}`, { x: 0.8, y: y + 0.32, w: 0.48, h: 0.48, align: 'center', valign: 'middle', fontFace: HF, fontSize: 16, bold: true, color: C.white });
    s.addText(p[0], { x: 1.45, y: y + 0.16, w: 5.3, h: 0.4, fontFace: HF, fontSize: 15, bold: true, color: C.ink });
    s.addText(p[1], { x: 1.45, y: y + 0.55, w: 5.3, h: 0.5, fontFace: BF, fontSize: 11.5, color: C.inkDim, lineSpacingMultiple: 1.05 });
    y += 1.25;
  });

  // right: envelope code + error codes
  s.addShape('roundRect', { x: 7.15, y: 1.8, w: 5.55, h: 2.4, rectRadius: 0.1, fill: { color: C.bgDark } });
  s.addText('공통 응답 envelope', { x: 7.4, y: 1.95, w: 5, h: 0.35, fontFace: BF, fontSize: 12, bold: true, color: C.teal });
  s.addText([
    { text: '{\n', options: { color: C.ice } },
    { text: '  "success"', options: { color: C.blue } }, { text: ': true,        // 성공/실패\n', options: { color: C.ice } },
    { text: '  "code"', options: { color: C.blue } }, { text: ': "0",         // 성공 "0"\n', options: { color: C.ice } },
    { text: '  "msg"', options: { color: C.blue } }, { text: ': "success",\n', options: { color: C.ice } },
    { text: '  "payload"', options: { color: C.amber } }, { text: ': { … }      // 실제 데이터\n', options: { color: C.ice } },
    { text: '}', options: { color: C.ice } },
  ], { x: 7.4, y: 2.3, w: 5.1, h: 1.85, fontFace: MF, fontSize: 13, lineSpacingMultiple: 1.05 });

  s.addShape('roundRect', { x: 7.15, y: 4.4, w: 5.55, h: 2.5, rectRadius: 0.1, fill: { color: C.card }, line: { color: C.cardLine, width: 1 } });
  s.addText('주요 API 에러 코드', { x: 7.4, y: 4.55, w: 5, h: 0.35, fontFace: HF, fontSize: 14, bold: true, color: C.ink });
  const errs = [
    ['-1002 / -1003', '인증 실패 → 즉시 로그아웃', C.coral],
    ['-1004 / 401', '토큰 만료 → 자동 재발급(refresh)', C.amber],
    ['-1005', '권한 없음 → 로그아웃 없이 에러 전달', C.blue],
    ['-9999', '서버 내부 오류', C.inkDim],
  ];
  let ey = 4.95;
  errs.forEach((e) => {
    s.addText(e[0], { x: 7.4, y: ey, w: 1.85, h: 0.4, fontFace: MF, fontSize: 12, bold: true, color: e[2], valign: 'middle' });
    s.addText(e[1], { x: 9.3, y: ey, w: 3.25, h: 0.4, fontFace: BF, fontSize: 11.5, color: C.ink, valign: 'middle' });
    ey += 0.46;
  });
  pageNum(s, 8);
}

// ============================================================
// 9. AUTH FLOW (light)
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.light };
  header(s, 'Authentication', '인증(JWT) 흐름');

  // top: login steps
  const steps = [
    ['1', '로그인', 'sha256() 해싱 후\nPOST /auth/login', C.blue],
    ['2', '토큰 저장', 'payload를\nuseAuthStore.setAuth()', C.teal],
    ['3', 'localStorage', '탭 간 공유 ·\n새로고침 유지', C.amber],
    ['4', '요청 부착', '모든 요청에\nBearer 토큰 자동', C.coral],
  ];
  const sx = [0.6, 3.7, 6.8, 9.9];
  steps.forEach((st, i) => {
    const x = sx[i], w = 2.7, y = 1.75, h = 1.9;
    s.addShape('roundRect', { x, y, w, h, rectRadius: 0.1, fill: { color: C.card }, line: { color: st[3], width: 1.25 } });
    s.addShape('roundRect', { x: x + 0.3, y: y + 0.28, w: 0.55, h: 0.55, rectRadius: 0.12, fill: { color: st[3] } });
    s.addText(st[0], { x: x + 0.3, y: y + 0.28, w: 0.55, h: 0.55, align: 'center', valign: 'middle', fontFace: HF, fontSize: 18, bold: true, color: C.white });
    s.addText(st[1], { x: x + 0.95, y: y + 0.3, w: w - 1.1, h: 0.5, fontFace: HF, fontSize: 15, bold: true, color: C.ink, valign: 'middle' });
    s.addText(st[2], { x: x + 0.3, y: y + 1.0, w: w - 0.55, h: 0.75, fontFace: BF, fontSize: 11.5, color: C.inkDim, lineSpacingMultiple: 1.05 });
    if (i < 3) s.addShape('line', { x: x + w, y: y + h / 2, w: sx[i + 1] - x - w, h: 0, line: { color: st[3], width: 2, endArrowType: 'triangle' } });
  });

  // bottom-left: auto refresh
  s.addShape('roundRect', { x: 0.6, y: 4.0, w: 6.3, h: 2.85, rectRadius: 0.1, fill: { color: C.bgDark } });
  s.addText('토큰 자동 재발급 (single-flight)', { x: 0.9, y: 4.18, w: 5.8, h: 0.4, fontFace: HF, fontSize: 16, bold: true, color: C.teal });
  const rf = [
    '-1004 또는 HTTP 401 감지 시 자동 동작',
    'POST /auth/refresh-token 으로 재발급',
    '원요청을 자동 재시도 — 사용자 개입 없음',
    '동시 다발 요청은 refresh 1회만 호출',
    '재발급 실패 → 로그아웃 + /login 리다이렉트',
  ];
  s.addText(rf.map((t) => ({ text: t, options: { bullet: { code: '2022', indent: 14 } } })),
    { x: 0.95, y: 4.65, w: 5.8, h: 2.0, fontFace: BF, fontSize: 12.5, color: C.ice, lineSpacingMultiple: 1.3 });

  // bottom-right: route guard
  s.addShape('roundRect', { x: 7.15, y: 4.0, w: 5.55, h: 2.85, rectRadius: 0.1, fill: { color: C.card }, line: { color: C.cardLine, width: 1 } });
  s.addText('라우트 가드', { x: 7.45, y: 4.18, w: 5, h: 0.4, fontFace: HF, fontSize: 16, bold: true, color: C.ink });
  s.addText([
    { text: '보호 라우트 (page)/_page 는 ', options: { color: C.ink } },
    { text: 'beforeLoad: requireAuth', options: { fontFace: MF, color: C.blue, bold: true } },
    { text: ' 로 진입 시 토큰을 검사합니다.', options: { color: C.ink } },
  ], { x: 7.45, y: 4.62, w: 5.0, h: 0.9, fontFace: BF, fontSize: 12.5, lineSpacingMultiple: 1.15 });
  s.addText([
    { text: 'isAuthenticated()', options: { fontFace: MF, color: C.teal, bold: true } },
    { text: ' 는 refreshToken 유효성을 기준으로 판단 — accessToken이 만료돼도 refreshToken이 살아있으면 통과 후 다음 요청에서 자동 재발급.', options: { color: C.inkDim } },
  ], { x: 7.45, y: 5.55, w: 5.0, h: 1.2, fontFace: BF, fontSize: 12, lineSpacingMultiple: 1.2 });
  pageNum(s, 9);
}

// ============================================================
// 10. STANDARDS & MODAL (light)
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.light };
  header(s, 'Conventions', '개발 표준 · 모달 시스템');

  const cols = [
    ['🎨', '품질 · 스타일', C.blue, [
      'Biome (Rust 린터·포매터)로 ESLint/Prettier 대체',
      'Space 2 · LF · 작은따옴표 · 세미콜론 항상',
      '프로토타이핑 속도 위해 a11y 규칙 제외',
    ]],
    ['🔗', 'Barrel · 임포트', C.teal, [
      '엔티티·훅·UI는 index.ts로 묶어 노출',
      '앱 → @bx/shared 배럴로 일괄 임포트',
      '패키지 내부는 상대 경로 (순환 참조 금지)',
    ]],
    ['🖼️', '모달 시스템', C.amber, [
      'Zustand 스토어로 모달 스택 관리',
      'Radix Dialog 기반 · open({ path })로 호출',
      'PC 중앙 다이얼로그 / 모바일 풀스크린',
    ]],
  ];
  const cx = [0.6, 4.83, 9.06];
  cols.forEach((c, i) => {
    const x = cx[i], y = 1.75, w = 3.9, h = 3.3;
    s.addShape('roundRect', { x, y, w, h, rectRadius: 0.1, fill: { color: C.card }, line: { color: C.cardLine, width: 1 } });
    s.addShape('roundRect', { x: x + 0.3, y: y + 0.3, w: 0.7, h: 0.7, rectRadius: 0.12, fill: { color: C.light }, line: { color: c[2], width: 1.5 } });
    s.addText(c[0], { x: x + 0.3, y: y + 0.3, w: 0.7, h: 0.7, align: 'center', valign: 'middle', fontSize: 22 });
    s.addText(c[1], { x: x + 1.15, y: y + 0.3, w: w - 1.3, h: 0.7, fontFace: HF, fontSize: 16, bold: true, color: C.ink, valign: 'middle' });
    s.addText(c[3].map((t) => ({ text: t, options: { bullet: { code: '2022', indent: 12 } } })),
      { x: x + 0.35, y: y + 1.25, w: w - 0.6, h: 1.9, fontFace: BF, fontSize: 12, color: C.inkDim, lineSpacingMultiple: 1.3 });
  });

  // commit convention strip
  s.addShape('roundRect', { x: 0.6, y: 5.3, w: 12.1, h: 1.55, rectRadius: 0.1, fill: { color: C.bgDark } });
  s.addText('Git 커밋 컨벤션', { x: 0.9, y: 5.45, w: 4, h: 0.4, fontFace: HF, fontSize: 15, bold: true, color: C.teal });
  s.addText([{ text: 'Type(Scope): Subject', options: { fontFace: MF, color: C.white, bold: true } }],
    { x: 0.9, y: 5.85, w: 4.5, h: 0.4, fontSize: 14 });
  const types = ['feat', 'fix', 'docs', 'style', 'refactor', 'build', 'chore'];
  types.forEach((t, i) => {
    chip(s, 5.55 + (i % 4) * 1.78, 5.5 + Math.floor(i / 4) * 0.55, 1.6, t, C.blue);
  });
  pageNum(s, 10);
}

// ============================================================
// 11. CLOSING (dark)
// ============================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.bgDark };
  for (let i = 0; i < 3; i++) {
    s.addShape('roundRect', { x: -0.6 + i * 0.18, y: 4.6 + i * 0.18, w: 2.4, h: 2.4, rectRadius: 0.18,
      fill: { type: 'solid', color: C.panel, transparency: i * 22 }, line: { color: C.teal, width: i === 0 ? 1.5 : 0 } });
  }
  s.addText('SUMMARY', { x: 0.9, y: 1.5, w: 11, h: 0.35, fontFace: BF, fontSize: 13, bold: true, color: C.teal, charSpacing: 4 });
  s.addText('하나의 공유 패키지,\n세 개의 앱, 일관된 표준', { x: 0.85, y: 1.95, w: 11.5, h: 1.8, fontFace: HF, fontSize: 40, bold: true, color: C.white, lineSpacingMultiple: 1.05 });

  const sums = [
    ['React 19 + Vite 모노레포', 'Turborepo 캐싱 · 초고속 빌드/DX'],
    ['FSD + @bx/shared', '도메인·UI·HTTP·인증 단일 공유'],
    ['JWT 자동 인증', 'single-flight 재발급 · 라우트 가드'],
    ['.env 한 줄 백엔드 전환', 'Spring(JWT) ↔ Mock 코드 수정 0'],
  ];
  const sx = [0.9, 7.0], sy = [4.35, 5.55];
  sums.forEach((sm, i) => {
    const x = sx[i % 2], y = sy[Math.floor(i / 2)];
    s.addShape('roundRect', { x: x, y: y, w: 0.16, h: 0.85, rectRadius: 0.05, fill: { color: C.teal } });
    s.addText(sm[0], { x: x + 0.35, y: y, w: 5.4, h: 0.45, fontFace: HF, fontSize: 16, bold: true, color: C.white });
    s.addText(sm[1], { x: x + 0.35, y: y + 0.42, w: 5.4, h: 0.4, fontFace: BF, fontSize: 12.5, color: C.ice });
  });
  pageNum(s, 11, true);
}

await pptx.writeFile({ fileName: 'BX-CF-Project.pptx' });
console.log('done');
