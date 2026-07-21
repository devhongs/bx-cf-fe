# 📘 BX-CF Frontend Foundation (Monorepo)

본 프로젝트는 **채널 파운데이션(Channel Foundation, CF)** 의 프론트엔드 레포지토리입니다. 특정 서비스가 아니라, 웹 프로젝트를 시작할 때 가져가 쓰는 **React 기반 프론트엔드 파운데이션(스타터킷)** 을 지향합니다.

비즈니스 로직은 최소화하고, 다음 영역의 베스트 프랙티스를 제공하는 것이 목적입니다.

- 라우팅, 서버 통신(HTTP/인증), 전역 상태 등 공통 기반 구성
- 서버 OpenAPI 스펙 → 프론트 스펙(타입·쿼리·API 클라이언트) 자동화
- 모노레포 폴더 구조와 **Feature-Sliced Design (FSD)** 설계 규격

기술 스택은 초고속 빌드 성능과 극대화된 DX(Developer Experience)를 지향하는 **React 19.2 + TypeScript 6 + Vite 8** 기반입니다.

**pnpm Workspaces + Turborepo** 기반의 모노레포로 구성되며, **Feature-Sliced Design (FSD)** 설계 규격과 단일 공유 패키지(`@bx/shared`) 아키텍처를 따릅니다. PC·모바일·관리자 웹은 각각 독립된 FSD 애플리케이션이며, 도메인 로직·UI·HTTP 통신·인증을 `@bx/shared`에서 공유합니다.

| 주요 도구 | 버전 |
| :--- | :--- |
| React | `19.2.x` |
| TypeScript | `6.0.x` |
| Vite | `8.0.x` |
| TanStack Query | `5.100.x` |
| TanStack Router | `1.130.x` |
| pnpm | `11.1.3` |

---

## 🚀 시작하기 (Quick Start)

### 1. 패키지 의존성 설치
```bash
pnpm install
```

### 2. 개발 서버 실행
전체 앱을 한 번에 확인할 때는 `dev:all`을 사용합니다. 이 명령은 Mock API 서버도 함께 띄우지만, 앱이 mock을 사용하려면 각 앱 `.env`의 `VITE_API_URL`을 `http://localhost:3333`으로 전환해야 합니다.

```bash
pnpm dev:all
```

> **가동 포트**
> - 💻 **PC 웹**: [http://localhost:3000](http://localhost:3000)
> - 📱 **모바일 웹**: [http://localhost:3001](http://localhost:3001)
> - ⚙️ **관리자 포탈**: [http://localhost:3002](http://localhost:3002)
> - 📡 **Mock API**: [http://localhost:3333](http://localhost:3333)

개별 구동:
```bash
pnpm dev:pc        # PC 웹 (3000)
pnpm dev:mobile    # 모바일 웹 (3001)
pnpm dev:admin     # 관리자 포탈 (3002)
pnpm dev:server    # Mock API 서버 (3333)
```

---

## 🌐 백엔드 연결 (Vite Proxy ↔ Mock ↔ Spring)

개발 기본값은 앱별 `.env`의 `VITE_API_URL=/channel/backend/api/v1`입니다. 브라우저는 같은 origin의 dev server로 요청하고, Vite proxy가 Spring 서버로 전달해 CORS/크로스도메인 쿠키 문제를 피합니다.

| 연결 방식 | URL / Target | 비고 |
| :--- | :--- | :--- |
| **개발 기본** (Vite proxy) | `VITE_API_URL=/channel/backend/api/v1` → `http://192.168.110.217` | PC/Mobile/Admin 개발 기본값 |
| **운영** (Nginx same-origin) | `VITE_API_URL=/channel/backend/api/v1` | 빌드/배포 기본값 |
| **Mock** (`mock/server.js`) | `http://localhost:3333` | 프로토타이핑·UI 개발용, 필요 시 env 전환 |
| **로컬 Spring 직접 연결** | `http://localhost:18081/channel/backend/api/v1` | 로컬 백엔드 직접 기동 시 |

> **핵심**: Mock 서버([mock/server.js](mock/server.js))는 Spring과 **동일한 계약**(공통 envelope + JWT 인증)을 흉내냅니다. 따라서 앱은 **단일 코드패스**로 동작하며, mock에서 검증한 인증·통신 로직이 Spring 연동 시 그대로 유지됩니다. (`pnpm dev:server`로 구동, Node 내장 모듈만 사용해 의존성 없음)

```bash
# apps/pc-web/.env · apps/mobile-web/.env · apps/admin-portal/.env
VITE_API_URL=/channel/backend/api/v1                         # 개발 기본: Vite proxy → Spring
#VITE_API_URL=http://localhost:3333                          # Mock 사용 시
#VITE_API_URL=http://localhost:18081/channel/backend/api/v1   # 로컬 Spring 직접 연결 시
```

* `.env`는 **각 앱 디렉토리**에 위치해야 합니다(Vite는 앱별로 로드). 루트 `.env`는 Vite 앱이 읽지 않습니다.
* `.env.production`은 `pnpm build` 시 적용됩니다.
* `VITE_API_URL`을 상대경로로 두면 앱의 `vite.config.ts` proxy 설정을 타고, 절대 URL로 두면 브라우저가 해당 서버로 직접 요청합니다.
* Mock 서버는 `db.json`을 그대로 서빙하되 모든 응답을 envelope로 감싸고, `/auth/*` 엔드포인트는 Spring 형태의 가짜 토큰(먼 미래 만료)을 발급합니다. (`db.json` 변경 시 mock 서버 재시작 필요)

### 공통 응답 규격 (envelope)
실서버 응답은 공통부(`success`/`code`/`msg`)와 데이터부(`payload`)로 구성됩니다. `httpService`가 `payload`를 자동 언래핑하여 반환합니다.

```jsonc
{
  "success": true,     // 성공/실패
  "code": "0",         // 성공: "0", 실패: 음수 문자열
  "msg": "success",    // 메시지
  "payload": { }       // 실제 데이터 (any)
}
```

### API 에러 코드 (`API_ERROR_CODE`)
| 코드 | 상수 | 설명 |
| :--- | :--- | :--- |
| `-1001` | REQUIRED_VALUE_MISSING | 필수 입력값 누락 |
| `-1002` | INVALID_TOKEN | 유효하지 않은 토큰 → **로그아웃** |
| `-1003` | UNAUTHORIZED_CLIENT | 인증되지 않은 클라이언트 → **로그아웃** |
| `-1004` | EXPIRED_TOKEN | 토큰 만료 → **자동 재발급(refresh)** |
| `-1005` | ACCESS_DENIED | 리소스 접근 권한 없음 (로그아웃 X) |
| `-2003/-2004` | JSON_*_PARSING | JSON 직렬화/역직렬화 오류 |
| `-4001/-4002` | DB_*_ERROR | DB 조회/저장 오류 |
| `-4003` | 백엔드 정의 | Database access error (현재 FE `API_ERROR_CODE`에는 미등록) |
| `-9999` | SERVER_ERROR | 서버 내부 오류 |

---

## 🔐 인증 (JWT)

Spring 백엔드 연동 시 **JWT 기반 인증**이 동작합니다. 토큰 부착·만료 시 자동 재발급·인증 실패 처리는 `@bx/shared`에 캡슐화되어 있으며, 앱은 `main.tsx`에서 한 번만 주입합니다.

```ts
// apps/[app]/src/main.tsx
httpService.init({
  baseURL: API_URL,
  timeout: API_CONFIG.TIMEOUT,
  auth: createHttpAuthConfig(),
});
```

### 로그인 흐름
1. 비밀번호를 `sha256()`로 해싱 → `POST /auth/login` (`{ usrId, usrPwd }`)
2. 응답 `payload`(사용자 정보 + accessToken + accessTokenExpiresAt)를 `useAuthStore.setAuth()`로 저장
3. refreshToken 값은 서버가 **HttpOnly Cookie**로 관리하고, FE는 localStorage에 저장하지 않음
4. accessToken 및 accessTokenExpiresAt은 **localStorage**에 보관(탭 간 공유·새로고침 유지)

### 토큰 자동 관리 (인터셉터)
* **요청**: 모든 요청에 `Authorization: Bearer <accessToken>` 자동 부착
* **응답 (`-1004` 또는 HTTP 401)**: `POST /auth/refresh-token`으로 재발급 후 원요청 **자동 재시도**
  * refreshToken은 request body가 아니라 HttpOnly Cookie로 전송(`withCredentials: true`)
  * 동시 다발 요청은 **single-flight**로 refresh 1회만 호출
  * 재발급 실패 → 로그아웃 + `/login` 리다이렉트
* **응답 (`-1002`/`-1003`)**: 재발급 불가 → 즉시 로그아웃
* **응답 (`-1005`)**: 인가(권한) 오류 → 로그아웃하지 않고 에러 그대로 전달

### 라우트 가드
보호 라우트(`(page)/_page`)는 `beforeLoad`에서 `requireAuth`를 먼저 수행합니다. `ensureValidAuthSession()`은 `accessTokenExpiresAt`이 유효하면 바로 통과하고, 만료됐거나 accessToken이 없으면 refresh 쿠키로 accessToken 재발급을 시도한 뒤 페이지 진입 여부를 결정합니다.

인증 통과 후 PC 웹은 `ensureBaseInfoBootstrapped(queryClient, { menuCacheScope: usrId })`를 호출해 기준정보 준비가 끝난 뒤 화면을 로딩합니다.

---

## 🧭 기준정보 부트스트랩 (PC Web)

PC 보호 화면 최초 진입 시 코드/메뉴 기준정보를 준비합니다. 실행 중 에러가 나도 화면 진입은 막지 않고, 가능한 경우 기존 localStorage 캐시를 재사용합니다.

### 처리 흐름
1. `POST /system/reference-data/versions/latest`로 기준정보 버전을 조회합니다. (`refType/versionNo` → `type/version`으로 정규화)
2. 타입별 localStorage 캐시가 `serverVersion + schemaVersion` 기준으로 최신인지 확인합니다.
3. 최신 캐시가 있으면 API를 호출하지 않고 캐시를 sessionStorage에 주입합니다.
4. 최신 캐시가 없으면 해당 타입만 재조회합니다.
   * 메뉴: `POST /system/menus/list`
   * 코드: `POST /system/common-codes/groups/list` 후 그룹별 `POST /system/common-codes/groups/{groupCd}/codes/list`
5. 조회 결과를 localStorage에 저장하고, 화면에서 쓰는 `CONFIG.SESSION.CODE` / `CONFIG.SESSION.MENU_LIST`에 주입합니다.

### 캐시 역할
| 레이어 | 역할 |
| :--- | :--- |
| React Query | 앱 실행 세션에서 `ensureQueryData` 중복 실행 방지 (`baseInfoQueryKeys.bootstrap(menuCacheScope)`) |
| localStorage | 새로고침/재접속 후에도 기준정보 재사용 (`base-info:CODE`, `base-info:MENU:<usrId>`) |
| sessionStorage | 기존 화면 로직이 참조하는 런타임 세션 데이터 (`CONFIG.SESSION.CODE`, `CONFIG.SESSION.MENU_LIST`) |

`schemaVersion`은 FE 내부 캐시 구조 버전입니다. 서버 버전이 그대로여도 FE 저장 구조가 바뀌면 schemaVersion을 올려 강제로 재조회하게 합니다. 현재 CODE는 그룹+children 구조를 반영해 `2`, MENU는 `1`입니다.

### 실패 시 동작 (의도된 동작)
라우트 가드가 호출하는 `bootstrapBaseInfoSafe`는 **절대 throw하지 않습니다.** 실패는 반환값의 `failed` 배열에 담기고, `beforeLoad`는 이 배열을 확인하지 않은 채 화면 진입을 허용합니다.

따라서 "첫 접속 + 기준정보 조회 실패"(재사용할 localStorage 캐시가 아직 없는 상태)에서는 부트스트랩이 성공으로 간주되지만 `CONFIG.SESSION.CODE`가 비어 있는 채로 화면이 렌더됩니다. 이때 `$codeUtils`와 `Select`의 `groupCd`는 조용히 빈 목록이 되고, 세션을 구독하지 않으므로 이후 채워져도 새로고침 전까지 복구되지 않습니다.

기준정보를 못 받아도 화면은 열리는 쪽을 택한 결과입니다. 코드 누락을 오류로 다뤄야 하는 서비스라면 `beforeLoad`에서 `failed`에 `CODE`가 포함됐는지 확인해 에러 화면으로 보내도록 바꾸면 됩니다.

---

## 📜 실행 스크립트 (Scripts)

### 개발 서버
| 명령 | 설명 |
| :--- | :--- |
| `pnpm dev` | 전체 앱 병렬 실행 (Turborepo) |
| `pnpm dev:pc` / `dev:mobile` / `dev:admin` | 개별 앱 구동 |
| `pnpm dev:server` | Mock API 서버 (`mock/server.js`, 3333) |
| `pnpm dev:all` | 전체 앱 + Mock API 동시 구동 |

### 검증 / 빌드
| 명령 | 설명 |
| :--- | :--- |
| `pnpm check` | 전체 타입 검사 (`turbo check` → 각 앱 `tsc --noEmit`) |
| `pnpm lint` | Biome 린트 |
| `pnpm format` | Biome 일괄 포맷팅 |
| `pnpm check:api-paths` | `httpService` 경로가 generated OpenAPI 경로와 맞는지 검사 |
| `pnpm test` | 전체 workspace 단위 테스트 (Vitest, Turborepo 캐싱) |
| `pnpm build` | 프로덕션 통합 빌드 (Turborepo 캐싱) |

> **단위 테스트**: `pc-web`, `mobile-web`, `admin-portal`, `@bx/shared`에 Vitest 설정과 `test` 스크립트가 있으며, 루트 `pnpm test`가 Turborepo를 통해 전체 workspace 테스트를 실행합니다. 테스트 파일이 아직 없는 workspace도 `--passWithNoTests`로 정상 종료합니다. 현재 GitHub Actions workflow에는 `pnpm test` 단계가 포함되어 있지 않습니다.

### E2E (Playwright)
| 명령 | 설명 |
| :--- | :--- |
| `pnpm test:e2e` | 전체 E2E |
| `pnpm test:e2e:pc` / `:mobile` / `:admin` | 개별 앱 E2E |

### 기타
| 명령 | 설명 |
| :--- | :--- |
| `pnpm gen:api` | 여러 백엔드 OpenAPI 스펙 → 서비스별 TS 타입 생성 (`scripts/gen-api.mjs` → `packages/shared/src/shared/api/*.schema.d.ts`). 스펙 목록은 `API_DOCS_URLS` 환경변수로 덮어쓰기 |
| `pnpm gen:readme` | 로컬 landing 미리보기용 README HTML 생성 (배포 시 CI가 자동 실행) |
| `pnpm wbs:pull -- --dry-run` | GitHub Projects의 신규 항목을 WBS 반영 전에 미리보기 |
| `pnpm wbs:pull` | GitHub Projects의 신규 항목을 `docs/wbs.md`에 추가 (`docs/wbs-pull.js`) |
| `pnpm wbs:sync` | `docs/wbs.md` → GitHub Projects 동기화 (`docs/wbs-sync.js`) |
| `pnpm wbs:force-sync` | WBS 강제 재동기화 (`docs/wbs-force-sync.js`) |

---

## 🚢 배포 (Deployment)

운영 서버는 **Nginx**로 서빙하며, 각 앱은 **별도 context(하위 경로)**로 분리됩니다. 빌드 시 Vite `base`가 주입되어 에셋 경로가 해당 context에 맞춰집니다.

| 앱 | Nginx context | 빌드 `base` (vite.config) |
| :--- | :--- | :--- |
| pc-web | `/pc/` | `/pc/` |
| mobile-web | `/mobile/` | `/mobile/` |
| admin-portal | `/admin/` | `/admin/` |
| **안내 페이지**(landing) | `/` (루트) | 없음 — 빌드 불요 정적 파일 |

> dev 서버에서는 `base`가 `/`로 유지됩니다(빌드 시에만 context 경로 적용).

### CI/CD ([.github/workflows/ci.yml](.github/workflows/ci.yml))
`develop` 브랜치에 push되면 self-hosted 러너에서 자동으로 다음을 수행합니다.

> 전체 연결 구조, job 실행 순서, 현재 운영상 주의점은 [CI/CD 실행 흐름](https://github.com/devhongs/bx-cf-fe/blob/develop/docs/ci-cd-flow.md)에서 확인할 수 있습니다.

| 항목 | 값 |
| :--- | :--- |
| Runner | `self-hosted` |
| Node.js | `22` |
| pnpm | `11.1.3` (`packageManager`와 동기화) |
| 배포 트리거 | `develop` 브랜치 push |
| API URL 주입 | `VITE_API_URL=/channel/backend/api/v1` |
| 배포 결과 알림 | Discord Webhook (`DISCORD_WH` GitHub Actions secret) |

1. `pnpm install --frozen-lockfile`
2. `pnpm gen:api`로 백엔드 OpenAPI 스펙 기준 타입 재생성
3. `git diff --exit-code -- packages/shared/src/shared/api`로 generated 타입 커밋 누락 여부 확인
4. `pnpm check:api-paths`로 FE API 호출 경로와 generated OpenAPI 경로 정합성 확인
5. `pnpm build:debug`(전체 앱 빌드, `VITE_API_URL` 주입) → `pnpm check` → `pnpm lint`
6. `pnpm gen:readme`로 `landing/assets/fe.readme.html` 재생성
7. 각 앱 `dist/*`와 `landing/*`를 Nginx 서빙 폴더로 복사 (배포 완료 후 Discord 알림)

### OpenAPI 스펙 정합성 체크
CI는 빌드 성공 여부뿐 아니라 **백엔드 스펙과 FE generated 타입의 동기화 여부**도 확인합니다.

* `pnpm gen:api`는 `scripts/gen-api.mjs`의 기본 내부망 Swagger URL 또는 `API_DOCS_URLS` 환경변수로 지정한 URL에서 스펙을 받아 `packages/shared/src/shared/api/*.schema.d.ts`를 재생성합니다.
* 재생성 후 `packages/shared/src/shared/api`에 diff가 있으면, 백엔드 스펙 변경이 FE 타입 파일에 반영되지 않은 상태이므로 CI를 실패시킵니다.
* `pnpm check:api-paths`는 `packages/shared/src/entities`의 `httpService.get/post/...` 호출 경로가 generated OpenAPI 경로에 존재하는지 확인합니다. 아직 스펙에 없는 legacy 경로는 `scripts/check-api-paths.mjs`의 allowlist에 사유와 함께 관리합니다.
* 개발자 로컬에서도 Swagger URL에 접근 가능하면 PR 전에 같은 검사를 미리 수행할 수 있습니다: `pnpm gen:api && git diff --exit-code -- packages/shared/src/shared/api`.
* self-hosted CI 러너도 Swagger URL에 접근 가능해야 합니다. 접근이 어렵다면 Swagger JSON snapshot을 repo에 저장하거나, 백엔드 릴리즈 산출물로 OpenAPI JSON을 제공받는 방식으로 전환합니다.
* `gen-api` 실행 중 missing schema patch 경고가 발생하면 백엔드 OpenAPI 문서가 불완전하다는 신호입니다. 로컬 개발에서는 warning으로 볼 수 있지만, 배포용 CI에서는 백엔드 스펙 보완 또는 allowlist 정책을 먼저 검토합니다.

| 대상 | 서버 배포 경로 |
| :--- | :--- |
| pc-web | `/Users/channelunit/apps/bx-cf-fe/pc-web` |
| mobile-web | `/Users/channelunit/apps/bx-cf-fe/mobile-web` |
| admin-portal | `/Users/channelunit/apps/bx-cf-fe/admin-portal` |
| landing | `/Users/channelunit/apps/bx-cf-fe/landing` |

> **참고**: 현재 develop push 시 **세 앱이 모두 함께 빌드·배포**됩니다. 운영용 앱별 독립 배포가 필요하면 워크플로우를 분리(브랜치/태그/`paths` 필터 또는 turbo affected)해야 합니다.
>
> **주의**: CI는 `--frozen-lockfile`로 의존성을 설치합니다. `package.json`의 dependencies/devDependencies를 변경했다면 반드시 `pnpm-lock.yaml`도 함께 갱신해 커밋해야 합니다. lockfile만 갱신하려면 `pnpm install --lockfile-only`를 사용합니다.

### 안내 페이지 (landing)
`landing/index.html`은 FE·BE 자료(소개 PDF·README·WBS·저장소)를 링크로 안내하는 **단일 정적 페이지**입니다. 어떤 앱에도 속하지 않으므로 `public/`(앱 공유 publicDir)이 아닌 별도 `landing/`에 두고, Nginx 루트 context로 서빙합니다. CI/CD에서 `pnpm gen:readme` 실행 후 `landing/*` 전체를 landing 배포 경로로 복사합니다.

`pnpm gen:readme`로 생성한 README HTML은 데스크톱에서 H2 제목만 모은 우측 고정 목차를 제공하고, 문서 스크롤에 따라 현재 항목을 표시합니다. 목차 링크는 URL hash와 부드러운 스크롤을 사용하며, 1100px 이하 화면에서는 목차를 숨기고 본문을 전체 폭으로 표시합니다.

> README HTML은 CI가 배포 전에 자동 생성합니다. 로컬 landing 미리보기가 필요한 경우에만 `pnpm gen:readme`를 실행합니다. 형제 BE 저장소가 로컬에 있으면 `be.readme.html`도 함께 변경될 수 있습니다.

---

## 📂 디렉토리 아키텍처

```plaintext
bx-cf-fe/
├── package.json                 # 루트 스크립트 & 워크스페이스
├── pnpm-workspace.yaml          # 워크스페이스 정의 (apps/*, packages/*)
├── turbo.json                   # Turborepo 파이프라인 캐싱
├── biome.json                   # Biome 린터 & 포맷터 (a11y 규칙 제외)
├── tsconfig.json                # 공통 TS 설정 (각 앱이 extends)
├── db.json                      # Mock 데이터
├── mock/                        # Mock API 서버 (Spring 계약 흉내, 무의존성)
│   └── server.js
├── public/                      # 공용 정적 자산 (앱 간 공유 publicDir)
├── landing/                     # 안내 페이지 (Nginx 루트 context, 앱 비종속)
│   ├── index.html
│   └── assets/                  #   소개 PDF·PPTX, gen:readme 산출물(fe/be.readme.html), backup/(이전 테마 덱)
├── scripts/
│   ├── gen-api.mjs              # OpenAPI → TS 타입 생성
│   ├── check-api-paths.mjs      # FE API 호출 경로 ↔ OpenAPI 경로 정합성 체크
│   ├── gen-readme-html.mjs      # README → landing HTML 생성
│   └── presentations/           # 제안 덱 빌드·수정 스크립트 (Biome 검사 제외)
├── .github/workflows/ci.yml     # develop push 시 빌드·검증·Nginx 배포
├── docs/                        # 프로젝트 문서 & 도구
│   ├── order.md / todo.md / wbs.md
│   ├── form-components.md       # 폼 컴포넌트 사용 가이드
│   ├── ppt-intro.md             # 제안 덱 내러티브 원고
│   ├── wbs-sync.js              # WBS → GitHub Projects 동기화 스크립트
│   ├── wbs-pull.js              # GitHub Projects → WBS 신규 항목 가져오기
│   ├── superpowers/             # 기능별 작업 계획(plans)·설계(specs) 기록
│   └── ppt-build/               # 제안 PPT 빌드·렌더 산출물 (Biome 검사 제외)
│
├── packages/
│   └── shared/                  # 공유 패키지 (@bx/shared)
│       └── src/
│           ├── entities/        # 도메인: account, alarm, auth, base-info, common-code, menu, product, user
│           │   └── <entity>/    #   ├ api/    (HTTP 호출)
│           │                    #   ├ model/  (타입·hook·queries·store·storage)
│           │                    #   └ ui/     (도메인 컴포넌트)
│           ├── shared/          # 공통: ui, hooks, model, lib, types, constants, ajax
│           │   ├── ajax/        #   http.service (envelope·인터셉터·JWT)
│           │   ├── constants/   #   api, error-codes, siteConfig, storage-keys
│           │   └── ui/          #   dialog, drawer, modal, toast, button, input ...
│           └── index.ts         # 배럴 (외부로 일괄 Export)
│
└── apps/
    ├── pc-web/                  # PC 웹 (3000) — FSD 앱
    │   └── src/
    │       ├── app/             #   전역 프로바이더 (modal 등)
    │       ├── routes/          #   TanStack Router 파일 기반 라우팅
    │       │   ├── (auth)/      #     로그인
    │       │   ├── (page)/      #     보호 라우트 (requireAuth)
    │       │   └── (modal)/     #     모달 라우트
    │       ├── pages/           #   페이지 컴포넌트
    │       ├── features/        #   기능 단위 (auth, dashboard ...)
    │       ├── widgets/         #   레이아웃 위젯 (sidebar 등)
    │       ├── queryClient.ts   #   앱 공용 TanStack QueryClient
    │       └── shared/          #   앱 로컬 공통 (guards 등)
    │
    ├── mobile-web/              # 모바일 웹 (3001) — FSD 앱 (구조 동일, 풀스크린 모달)
    │
    └── admin-portal/            # 관리자 포탈 (3002) — 운영 관리 앱
        └── src/
            ├── routes/          #   로그인·대시보드·코드·메뉴·사용자·프로필 라우트
            ├── pages/           #   관리자 업무 화면
            ├── features/        #   코드·메뉴·사용자 등록/수정 기능
            ├── widgets/         #   관리자 레이아웃·사이드바
            └── shared/          #   관리자 전용 폼·필터·드로어·스타일
```

> 라우트 트리(`routeTree.gen.ts`)는 TanStack Router 플러그인이 dev/build 시 자동 생성합니다(직접 수정 금지).

---

## 🧩 Feature-Sliced Design (FSD)

이 저장소는 [Feature-Sliced Design 공식 홈페이지](https://fsd.how/)의 구조화 원칙을 기반으로 하며, 자세한 개념은 [FSD 한국어 Overview](https://fsd.how/kr/docs/get-started/overview/)에서 확인할 수 있습니다. FSD는 프론트엔드 코드를 책임 범위에 따른 **Layer**, 비즈니스 도메인에 따른 **Slice**, 기술 역할에 따른 **Segment**로 나누는 아키텍처 방법론입니다.

BX-CF는 이를 모노레포에 맞게 적용합니다.

| FSD Layer | 이 저장소에서의 역할 |
| :--- | :--- |
| `app` | 앱 진입점, 전역 Provider와 설정 |
| `pages` / `routes` | 화면과 URL 진입 단위 |
| `widgets` | 사이드바·레이아웃처럼 독립적인 대형 UI 구성 |
| `features` | 로그인, 등록·수정처럼 사용자 행동 중심의 기능 |
| `entities` | account, auth, menu, product 등 도메인별 API·model·UI |
| `shared` | 특정 도메인에 종속되지 않는 UI·유틸리티·통신·상수 |

- 앱별 화면·기능·스타일은 `apps/*/src`에 두고, 여러 앱이 공유하는 도메인과 기반 기능은 `packages/shared/src`에서 관리합니다.
- Slice 내부는 `api`, `model`, `ui` 등의 Segment로 역할을 분리합니다.
- 외부 모듈은 Slice의 `index.ts` Public API를 통해 접근하고, 상위 Layer에서 하위 Layer 방향으로 의존하도록 구성합니다.

---

## 🎨 코드 스타일 및 개발 표준

### 1. 린터·포맷터 (Biome)
ESLint/Prettier 대신 Rust 기반 **Biome**으로 품질·스타일을 관리합니다.
* **접근성(a11y) 규칙 제외**: 프로토타이핑/마이그레이션 속도를 위해 [biome.json](biome.json)에서 `a11y`를 비활성화했습니다.
* **포맷 규칙**: 인덴트 Space 2 · 개행 LF · 작은따옴표(`'`) · 세미콜론 항상.

### 2. Barrel(`index.ts`) 규칙
* 엔티티·훅·UI는 디렉토리의 `index.ts`로 묶어 노출합니다.
* **순환 참조 금지**: `@bx/shared` **내부** 모듈끼리는 반드시 **로컬 상대 경로**로 임포트합니다. (패키지 명칭 `@bx/shared`로 자기 자신을 호출하면 순환 의존성 발생)

### 3. 도메인 파일 배치 컨벤션
새 파일/기능을 추가하기 전에는 같은 도메인의 기존 구조를 먼저 확인하고, `entities` 하위의 기존 패턴을 우선합니다.

| 종류 | 위치 |
| :--- | :--- |
| API 호출 | `api/*.api.ts` |
| 타입 | `model/*.type.ts` |
| TanStack Query | `model/*.queries.ts` |
| storage/cache | `model/*.storage.ts` |
| hook/store/bootstrap 등 모델 로직 | `model/*.hook.ts`, `model/*.store.ts`, `model/*.bootstrap.ts` 등 기존 패턴에 맞춤 |

TanStack Query key는 `xxxQueryKeys = { all, list, detail, ... }` 객체 패턴을 사용합니다. 기존 컨벤션과 다르게 갈 필요가 있으면 구현 전에 이유를 먼저 설명합니다.

### 4. HTTP 통신 (`httpService`)
* 모든 API 호출은 `@bx/shared`의 `httpService.get/post/put/patch/delete`를 사용합니다.
* baseURL은 `httpService.init()`에서 1회 설정하므로, 각 API 함수는 **상대 경로**만 사용합니다. (예: `httpService.get('/product/list')`)
* `execute()`가 envelope의 `payload`를 언래핑하여 반환하고, `success: false`는 에러로 throw합니다.

### 5. 공통 UI와 앱 전용 UI
* 여러 앱에서 재사용할 수 있는 기본 UI는 `packages/shared/src/shared/ui`에 구현합니다.
* 앱별 동작이나 스타일이 필요하면 shared 기본 컴포넌트를 조합하거나 확장하고, wrapper와 스타일은 해당 앱 내부에 둡니다.
* 앱에 먼저 구현한 기능이라도 재사용 범위가 넓어지면 shared UI로 승격합니다.

### 6. 공통 상수 (`@bx/shared/.../constants`)
| 모듈 | 내용 |
| :--- | :--- |
| `api.ts` | `API_URL`(env 주입), `IS_MOCK_API`, `API_CONFIG`(타임아웃·재시도) |
| `error-codes.ts` | `API_ERROR_CODE` 및 인증 코드 판별 헬퍼 |
| `siteConfig.ts` | 전역 `CONFIG` (모드·세션·타이머·테마·한도 등) |
| `storage-keys.ts` | `STORAGE_KEYS` (토큰·사용자·캐시 키) |
| `index.ts` | `APP_CONFIG`, `ROUTES`, `BANK_OPTIONS` |

* **앱(apps/*)에서**: `@bx/shared` 배럴로 일괄 임포트. (예: `import { API_URL, STORAGE_KEYS } from '@bx/shared';`)
* **패키지 내부에서**: 상대 경로로 개별 임포트. (예: `import { API_URL } from './api';`)

---

## 🪟 모달 시스템

`@bx/shared`의 Zustand 스토어(`useModalStore`/`useModal`)로 모달 스택을 관리하고, Radix Dialog 기반 UI를 사용합니다.
* **PC**: 화면 중앙 다이얼로그 (`Dialog`)
* **모바일**: 풀스크린 다이얼로그
* 모달 화면은 각 앱의 `routes/(modal)/<name>/index.tsx`에 두고, `useModal().open({ path: '<name>' })`으로 호출합니다.

---

## 🔔 토스트 시스템

`@bx/shared`가 **sonner**를 얇게 감싼 `Toaster` 컴포넌트와 `toast` 함수를 제공합니다. 세 앱 모두 `main.tsx`에서 `<Toaster />`를 라우터와 같은 레벨에 한 번 마운트하며, 호출은 어디서든 `toast(...)`로 합니다.

```tsx
// apps/[app]/src/main.tsx
<QueryClientProvider client={queryClient}>
  <RouterProvider router={router} />
  <Toaster />
</QueryClientProvider>
```

```ts
import { toast } from '@bx/shared';

toast.success('저장되었습니다.');
toast.error('저장에 실패했습니다.');
```

* 기본값은 `position="bottom-center"` · `closeButton` 활성이며, 필요 시 `<Toaster />`에 sonner props를 그대로 넘겨 덮어쓸 수 있습니다.
* 아이콘은 lucide-react 기반으로 success/info/warning/error/loading이 미리 지정되어 있습니다.
* 색상은 앱별 테마 토큰(`--surface-elevated`, `--foreground`, `--border`)을 var()로 참조하므로, pc-web의 `.dark`·admin의 `[data-admin-theme]`·mobile-web의 light 기본값에 래퍼 수정 없이 따라갑니다.

---

## 📘 Git 커밋 컨벤션

### 형식
`Type(Scope): Subject`

### Type
| Type | 설명 |
| :--- | :--- |
| **feat** | 새로운 기능 추가 |
| **fix** | 버그·에러 수정 |
| **docs** | 문서 수정 (README 등) |
| **style** | 포맷·스타일 (기능 영향 없음) |
| **refactor** | 구조 리팩터링 |
| **build** | 빌드 설정 (Vite, pnpm 등) |
| **chore** | 패키지 업데이트·잡무 |

---

*기술 문의 및 아키텍처 개선 제안은 개발 리드에게 전달해 주세요.*
