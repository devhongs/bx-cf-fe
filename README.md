# 📘 BX-CF Enterprise Frontend Framework (Monorepo)

본 프로젝트는 초고속 빌드 성능과 극대화된 DX(Developer Experience)를 지향하는 **React 19 + TypeScript + Vite** 기술 스택 기반의 엔터프라이즈급 금융/자산관리 웹 애플리케이션 프레임워크입니다.

**pnpm Workspaces + Turborepo** 기반의 모노레포로 구성되며, **Feature-Sliced Design (FSD)** 설계 규격과 단일 공유 패키지(`@bx/shared`) 아키텍처를 따릅니다. PC·모바일 웹은 각각 독립된 FSD 애플리케이션이며, 도메인 로직·UI·HTTP 통신·인증을 `@bx/shared`에서 공유합니다.

---

## 🚀 시작하기 (Quick Start)

### 1. 패키지 의존성 설치
```bash
pnpm install
```

### 2. 개발 서버 실행
가장 권장하는 방식은 모든 앱과 Mock API 서버를 한 번에 띄우는 것입니다.

```bash
pnpm dev:all
```

> **가동 포트**
> - 💻 **PC 웹**: [http://localhost:3000](http://localhost:3000)
> - 📱 **모바일 웹**: [http://localhost:3001](http://localhost:3001)
> - ⚙️ **관리자 포탈**: [http://localhost:3002](http://localhost:3002)
> - 📡 **Mock API (json-server)**: [http://localhost:3333](http://localhost:3333)

개별 구동:
```bash
pnpm dev:pc        # PC 웹 (3000)
pnpm dev:mobile    # 모바일 웹 (3001)
pnpm dev:admin     # 관리자 포탈 (3002)
pnpm dev:server    # Mock API 서버 (3333)
```

---

## 🌐 백엔드 연결 (Mock ↔ Spring)

본 프로젝트는 **두 종류의 백엔드**를 지원하며, 앱별 `.env`의 `VITE_API_URL` **값만 바꿔** 전환합니다. 코드 수정은 필요 없습니다.

| 백엔드 | URL | 응답 포맷 | 비고 |
| :--- | :--- | :--- | :--- |
| **Mock** (json-server) | `http://localhost:3333` | raw JSON | 프로토타이핑·UI 개발용 |
| **실서버** (Spring, JWT) | `http://localhost:18081/channel/backend/api/v1` | 공통 envelope | 인증·실데이터 연동 |

```bash
# apps/pc-web/.env  ·  apps/mobile-web/.env
VITE_API_URL=http://localhost:18081/channel/backend/api/v1   # Spring (기본)
#VITE_API_URL=http://localhost:3333                          # Mock 사용 시 주석 교체
```

* `.env`는 **각 앱 디렉토리**에 위치해야 합니다(Vite는 앱별로 로드). 루트 `.env`는 Vite 앱이 읽지 않습니다.
* `.env.production`은 `pnpm build` 시 적용됩니다.
* URL이 `localhost:3333`이면 `IS_MOCK_API`가 자동으로 `true`가 되어, json-server의 raw 응답을 공통 envelope로 감싸는 보정 인터셉터가 적용되고 **JWT 인증은 비활성화**됩니다.

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
| `-9999` | SERVER_ERROR | 서버 내부 오류 |

---

## 🔐 인증 (JWT)

Spring 백엔드 연동 시 **JWT 기반 인증**이 동작합니다. 토큰 부착·만료 시 자동 재발급·인증 실패 처리는 `@bx/shared`에 캡슐화되어 있으며, 앱은 `main.tsx`에서 한 번만 주입합니다.

```ts
// apps/[app]/src/main.tsx
httpService.init({
  baseURL: API_URL,
  timeout: API_CONFIG.TIMEOUT,
  interceptors: IS_MOCK_API ? { response: mockApiResponseInterceptor } : undefined,
  auth: IS_MOCK_API ? undefined : createHttpAuthConfig(),
});
```

### 로그인 흐름
1. 비밀번호를 `sha256()`로 해싱 → `POST /auth/login` (`{ usrId, usrPwd }`)
2. 응답 `payload`(사용자 정보 + accessToken/refreshToken)를 `useAuthStore.setAuth()`로 저장
3. 토큰은 **localStorage**에 보관(탭 간 공유·새로고침 유지)

### 토큰 자동 관리 (인터셉터)
* **요청**: 모든 요청에 `Authorization: Bearer <accessToken>` 자동 부착
* **응답 (`-1004` 또는 HTTP 401)**: `POST /auth/refresh-token`으로 재발급 후 원요청 **자동 재시도**
  * 동시 다발 요청은 **single-flight**로 refresh 1회만 호출
  * 재발급 실패 → 로그아웃 + `/login` 리다이렉트
* **응답 (`-1002`/`-1003`)**: 재발급 불가 → 즉시 로그아웃
* **응답 (`-1005`)**: 인가(권한) 오류 → 로그아웃하지 않고 에러 그대로 전달

### 라우트 가드
보호 라우트(`(page)/_page`)는 `beforeLoad: requireAuth`로 진입 시 토큰을 검사합니다. `isAuthenticated()`는 **리프레시 토큰 유효성**을 기준으로 판단하므로, accessToken이 만료됐어도 refreshToken이 살아있으면 통과하고 다음 요청에서 자동 재발급됩니다.

---

## 📜 실행 스크립트 (Scripts)

### 개발 서버
| 명령 | 설명 |
| :--- | :--- |
| `pnpm dev` | 전체 앱 병렬 실행 (Turborepo) |
| `pnpm dev:pc` / `dev:mobile` / `dev:admin` | 개별 앱 구동 |
| `pnpm dev:server` | Mock API (json-server, 3333) |
| `pnpm dev:all` | 전체 앱 + Mock API 동시 구동 |

### 검증 / 빌드
| 명령 | 설명 |
| :--- | :--- |
| `pnpm check` | 전체 타입 검사 (`turbo check` → 각 앱 `tsc --noEmit`) |
| `pnpm lint` | Biome 린트 |
| `pnpm format` | Biome 일괄 포맷팅 |
| `pnpm build` | 프로덕션 통합 빌드 (Turborepo 캐싱) |

### E2E (Playwright)
| 명령 | 설명 |
| :--- | :--- |
| `pnpm test:e2e` | 전체 E2E |
| `pnpm test:e2e:pc` / `:mobile` / `:admin` | 개별 앱 E2E |

### 기타
| 명령 | 설명 |
| :--- | :--- |
| `pnpm wbs:sync` | `docs/wbs.md` → GitHub Projects 동기화 (`docs/wbs-sync.js`) |

---

## 📂 디렉토리 아키텍처

```plaintext
bx-cf-fe/
├── package.json                 # 루트 스크립트 & 워크스페이스
├── pnpm-workspace.yaml          # 워크스페이스 정의 (apps/*, packages/*)
├── turbo.json                   # Turborepo 파이프라인 캐싱
├── biome.json                   # Biome 린터 & 포맷터 (a11y 규칙 제외)
├── tsconfig.json                # 공통 TS 설정 (각 앱이 extends)
├── tailwind.config.js           # Tailwind 폰트 확장
├── db.json                      # json-server Mock 데이터
├── public/                      # 공용 정적 자산 (앱 간 공유)
├── docs/                        # 프로젝트 문서 & 도구
│   ├── order.md / todo.md / wbs.md
│   └── wbs-sync.js              # WBS → GitHub Projects 동기화 스크립트
│
├── packages/
│   └── shared/                  # 공유 패키지 (@bx/shared)
│       └── src/
│           ├── entities/        # 도메인: account, alarm, auth, menu, product, user
│           │   └── <entity>/    #   ├ api/    (HTTP 호출)
│           │                    #   ├ model/  (타입·hook·queries·store)
│           │                    #   └ ui/     (도메인 컴포넌트)
│           ├── shared/          # 공통: ui, hooks, model, lib, types, constants, ajax
│           │   ├── ajax/        #   http.service (envelope·인터셉터·JWT)
│           │   ├── constants/   #   api, error-codes, siteConfig, storage-keys
│           │   └── ui/          #   dialog, drawer, modal, button, input ...
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
    │       └── shared/          #   앱 로컬 공통 (guards 등)
    │
    ├── mobile-web/              # 모바일 웹 (3001) — FSD 앱 (구조 동일, 풀스크린 모달)
    │
    └── admin-portal/            # 관리자 포탈 (3002) — 스켈레톤(템플릿)
```

> 라우트 트리(`routeTree.gen.ts`)는 TanStack Router 플러그인이 dev/build 시 자동 생성합니다(직접 수정 금지).

---

## 🎨 코드 스타일 및 개발 표준

### 1. 린터·포맷터 (Biome)
ESLint/Prettier 대신 Rust 기반 **Biome**으로 품질·스타일을 관리합니다.
* **접근성(a11y) 규칙 제외**: 프로토타이핑/마이그레이션 속도를 위해 [biome.json](biome.json)에서 `a11y`를 비활성화했습니다.
* **포맷 규칙**: 인덴트 Space 2 · 개행 LF · 작은따옴표(`'`) · 세미콜론 항상.

### 2. Barrel(`index.ts`) 규칙
* 엔티티·훅·UI는 디렉토리의 `index.ts`로 묶어 노출합니다.
* **순환 참조 금지**: `@bx/shared` **내부** 모듈끼리는 반드시 **로컬 상대 경로**로 임포트합니다. (패키지 명칭 `@bx/shared`로 자기 자신을 호출하면 순환 의존성 발생)

### 3. HTTP 통신 (`httpService`)
* 모든 API 호출은 `@bx/shared`의 `httpService.get/post/put/patch/delete`를 사용합니다.
* baseURL은 `httpService.init()`에서 1회 설정하므로, 각 API 함수는 **상대 경로**만 사용합니다. (예: `httpService.get('/products')`)
* `execute()`가 envelope의 `payload`를 언래핑하여 반환하고, `success: false`는 에러로 throw합니다.

### 4. 공통 상수 (`@bx/shared/.../constants`)
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
