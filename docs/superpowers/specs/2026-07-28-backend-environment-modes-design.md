# 백엔드 환경별 실행 모드 설계

## 목표

PC, Admin, Mobile 앱을 실행할 때 소스나 기존 `.env`를 매번 수정하지 않고 명시적인 Vite mode로 연결 대상을 선택한다.

지원 대상은 다음 세 환경이다.

| mode | 연결 대상 | 목적 |
| --- | --- | --- |
| `remote` | `http://192.168.110.217` | 사내 공용 개발 백엔드 |
| `spring` | `http://127.0.0.1:18081` | 로컬 Spring 백엔드 |
| `mock` | `http://127.0.0.1:3333` | FE 저장소의 로컬 MOCK 서버 |

환경별 주소는 물리적인 환경파일에 두고 Git으로 공유한다. 개발자 개인 덮어쓰기는 Vite의 `.local` 환경파일을 사용하며 Git에는 포함하지 않는다.

## 현재 문제

현재 앱의 `VITE_API_URL`은 `/channel/backend/api/v1`이고, 세 앱의 `vite.config.ts`는 프록시 대상을 `http://192.168.110.217`로 하드코딩한다.

이 구조에서는 로컬 Spring 또는 MOCK으로 전환할 때 앱별 `.env`나 Vite 소스를 직접 수정해야 한다. 실행 대상이 파일 변경 이력에 섞이고, 앱 세 개의 설정이 서로 달라질 위험도 있다.

OpenAPI 생성용 Swagger 주소는 `scripts/gen-api.mjs`에 별도로 정의되어 있다. 앱 런타임 mode 변경이 OpenAPI 생성 대상을 암묵적으로 바꾸지는 않는다.

## 검토한 접근

### 1. 앱별 `.env`를 수동 수정

구현 변경이 없다는 장점은 있지만, 실행할 때마다 추적 파일을 수정해야 한다. 실수로 환경 변경을 커밋하거나 앱별 설정이 엇갈릴 수 있으므로 채택하지 않는다.

### 2. 절대 URL만 mode별로 주입

`.env.spring`과 `.env.mock`에서 `VITE_API_URL`을 절대 URL로 설정하는 방식이다. 단순하지만 브라우저가 백엔드에 직접 연결하므로 CORS와 refresh cookie 동작이 백엔드 설정에 의존한다.

### 3. mode별 환경파일과 환경 기반 Vite proxy

`remote`와 `spring`은 같은 상대 API 경로를 사용하고 `VITE_API_PROXY_TARGET`으로 프록시 목적지만 변경한다. `mock`은 기존 MOCK 계약에 맞게 `VITE_API_URL`을 `http://127.0.0.1:3333`으로 지정한다.

same-origin 개발 흐름을 유지하고 주소를 소스에서 제거할 수 있으므로 이 방식을 채택한다.

## 환경파일

각 앱 디렉터리에 동일한 이름의 환경파일을 둔다.

```text
apps/pc-web/.env.remote
apps/pc-web/.env.spring
apps/pc-web/.env.mock

apps/admin-portal/.env.remote
apps/admin-portal/.env.spring
apps/admin-portal/.env.mock

apps/mobile-web/.env.remote
apps/mobile-web/.env.spring
apps/mobile-web/.env.mock
```

`remote`:

```env
VITE_API_URL=/channel/backend/api/v1
VITE_API_PROXY_TARGET=http://192.168.110.217
```

`spring`:

```env
VITE_API_URL=/channel/backend/api/v1
VITE_API_PROXY_TARGET=http://127.0.0.1:18081
```

`mock`:

```env
VITE_API_URL=http://127.0.0.1:3333
```

현재 `.env`는 환경을 선택하지 않은 일반 `vite` 실행의 기존 동작을 보존한다. 명시적 실행 명령은 항상 mode를 전달하므로 새 워크플로에서는 mode 파일이 우선한다.

개인 덮어쓰기는 예를 들어 `.env.spring.local`에 둔다. `.gitignore`는 일반 `.env.local`뿐 아니라 `.env.*.local`도 제외하도록 보완한다.

## Vite 설정

세 앱의 `vite.config.ts`는 `defineConfig` 콜백에서 `mode`를 받고 `loadEnv`로 환경 변수를 읽는다.

```text
Vite mode
  → 앱 디렉터리의 .env 및 .env.<mode> 로드
  → VITE_API_URL을 브라우저 코드에 주입
  → VITE_API_PROXY_TARGET을 dev server proxy target으로 사용
```

프록시 target은 다음 우선순위를 사용한다.

1. `VITE_API_PROXY_TARGET`
2. 기존 호환 기본값 `http://192.168.110.217`

기존 `changeOrigin`과 `Origin` 헤더 제거 동작은 유지한다. `mock` mode는 API URL이 절대 주소이므로 `/channel` 프록시를 사용하지 않는다.

`VITE_API_PROXY_TARGET`은 Vite 설정에서만 소비하며 브라우저 애플리케이션 로직에서 사용하지 않는다.

## 실행 명령

루트 `package.json`에 앱과 환경이 드러나는 명령을 추가한다.

```text
dev:pc:remote
dev:pc:spring
dev:pc:mock

dev:admin:remote
dev:admin:spring
dev:admin:mock

dev:mobile:remote
dev:mobile:spring
dev:mobile:mock
```

각 명령은 해당 workspace의 Vite 개발 서버에 `--mode <mode>`를 전달한다. MOCK 명령은 MOCK 서버를 자동으로 시작하지 않는다. 서버 수명주기를 앱 실행과 결합하면 여러 앱을 동시에 실행할 때 포트 충돌이 발생할 수 있기 때문이다.

MOCK 서버는 기존 `pnpm dev:server`로 한 번 실행하고 필요한 앱을 `*:mock` 명령으로 연결한다. 전체 앱과 MOCK을 함께 시작하는 기존 `pnpm dev:all`은 호환성을 유지한다.

## OpenAPI 생성

런타임 mode와 OpenAPI 생성 대상은 별도 관심사로 유지한다.

- 기본 `pnpm gen:api`: 기존 사내 Swagger 주소 사용
- 로컬 Spring 기준 생성: `API_DOCS_URLS` 환경변수로 세 Swagger URL 지정

런타임 환경파일에 Swagger 서비스별 URL까지 추가하지 않는다. 런타임과 코드 생성 설정을 묶으면 앱 실행만 하려는 개발자가 불필요한 생성 설정까지 관리해야 하기 때문이다.

## 오류 처리

- `VITE_API_PROXY_TARGET`이 없으면 기존 사내 개발 서버를 사용해 하위 호환성을 유지한다.
- 잘못된 proxy target은 Vite 시작 시 선택된 mode와 target을 로그로 표시해 즉시 확인할 수 있게 한다.
- MOCK 서버가 실행되지 않은 상태에서 `*:mock`을 시작하면 브라우저 네트워크 오류로 드러나며, 실행 문서에서 `pnpm dev:server` 선행 조건을 안내한다.
- 환경파일에는 토큰, 비밀번호 등 비밀값을 넣지 않는다. 비밀값이 필요하면 `.env.<mode>.local`만 사용한다.

## 문서

README의 API 연결 설명을 다음 기준으로 갱신한다.

- 기본·원격·로컬 Spring·MOCK 모드별 명령
- 각 mode가 사용하는 API URL과 proxy target
- MOCK 서버 선행 실행 방법
- 개인 환경 덮어쓰기 파일 규칙
- OpenAPI 생성 대상은 `API_DOCS_URLS`로 별도 선택한다는 점

README HTML 생성물은 일반 README 수정이므로 이번 작업에서 재생성하지 않는다.

## 검증

1. 세 앱에서 `remote`, `spring`, `mock` mode의 환경값이 의도대로 로드된다.
2. `remote`와 `spring`의 `/channel` 요청이 각 proxy target으로 전달된다.
3. `mock` mode의 API URL은 `http://127.0.0.1:3333`이다.
4. 기존 mode 없는 `pnpm dev:pc`, `pnpm dev:admin`, `pnpm dev:mobile` 명령의 동작이 유지된다.
5. 새 package script가 각 앱의 Vite 프로세스에 올바른 `--mode`를 전달한다.
6. `pnpm check`와 관련 설정 테스트가 통과한다.
7. `pnpm lint`가 변경 파일에서 통과한다.

환경 선택 자체는 작은 설정 변경이므로 별도 브라우저 E2E는 추가하지 않는다. Vite 설정을 함수로 분리할 수 있다면 환경별 proxy target 선택을 단위 테스트하고, 그렇지 않으면 각 mode의 Vite 시작 로그와 요청 전달로 검증한다.

## 제외 범위

- 최신 Swagger 26개 API에 맞춘 MOCK 라우트 및 데이터 구현
- FE 사용자 API 경로 정합성 수정
- `check:api-paths`의 CRLF 파싱 결함 수정
- 백엔드 CORS 또는 cookie 정책 변경
- 운영 배포 환경 변수 관리 변경

위 항목 중 MOCK 최신화 관련 작업은 환경별 실행 모드가 구현된 뒤 별도 설계와 구현 계획으로 진행한다.
