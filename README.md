# 📘 BX-CF Enterprise Frontend Framework (Monorepo)

본 프로젝트는 초고속 빌드 성능과 극대화된 DX(Developer Experience)를 지향하는 **React + TypeScript + Vite** 기술 스택 기반의 엔터프라이즈급 금융/자산관리 웹 애플리케이션 프레임워크입니다. 

**pnpm Workspaces와 Turborepo** 기반의 모노레포 구조로 이뤄져 있으며, 비즈니스 요구사항에 유연하게 대응하기 위해 **Feature-Sliced Design (FSD)** 설계 규격 및 단일화된 스마트 공유 패키지 아키텍처를 따르고 있습니다.

---

## 🚀 시작하기 (Quick Start)

의존성 설치 및 개발 서버 가동은 다음 명령어로 즉시 시작할 수 있습니다.

### 1. 패키지 의존성 설치 및 워크스페이스 링크 빌드
```bash
pnpm install
```

### 2. 로컬 개발 환경 실행 명령어 모음 (Dev Scripts)
개발 목적에 맞춰 원하시는 플랫폼 또는 Mocking 서버 명령어를 루트 디렉토리에서 즉시 수행할 수 있습니다.

* **💻 클라이언트 플랫폼 앱 & Mocking API 서버 전체 통합 가동 (가장 권장)**:
  ```bash
  pnpm dev:all
  ```
  > **가동 포트 정보**:
  > - **📱 모바일 웹 포탈 (Main)**: [http://localhost:3001](http://localhost:3001)
  > - **💻 PC 게이트웨이 웹 (Placeholder)**: [http://localhost:3000](http://localhost:3000)
  > - **⚙️ 관리자 포탈 (Admin)**: [http://localhost:3002](http://localhost:3002)
  > - **📡 Mocking API 데이터 서버**: [http://localhost:3333](http://localhost:3333)

* **📱 모바일 웹 포탈 단독 구동 (FSD 핵심 기능 개발)**:
  ```bash
  pnpm dev:mobile
  ```
  *(포트 `3001`에서 가동)*

* **💻 PC 게이트웨이 웹 단독 구동 (데스크톱 안내 대문 개발)**:
  ```bash
  pnpm dev:pc
  ```
  *(포트 `3000`에서 가동)*

* **⚙️ 관리자 포탈 단독 구동 (Admin Portal 개발)**:
  ```bash
  pnpm dev:admin
  ```
  *(포트 `3002`에서 가동)*

* **📡 로컬 Mocking API 데이터 서버 단독 구동**:
  ```bash
  pnpm dev:server
  ```
  *(포트 `3333`에서 가동)*

---

## 📜 실행 스크립트 (PNPM Workspace Scripts)

루트 디렉토리에서 간편한 단축 명령어를 통해 개별 플랫폼 앱 개발 서버를 독립 제어하거나 통합 품질 검사를 수행할 수 있습니다.

### 💻 개발 서버 구동 (Dev Servers)
* **전체 플랫폼 가동**: `pnpm dev` (Turborepo를 통해 모든 앱을 병렬 실행)
* **모바일 웹 포탈 (Main)**: `pnpm dev:mobile` (Port **`3001`**에서 동작하며 FSD 비즈니스 로직 구동)
* **PC 게이트웨이 웹 (Gateway)**: `pnpm dev:pc` (Port **`3000`**에서 동작하며 모바일 접속 유도 뷰포트 페이지 제공)
* **관리자 포탈 (Admin)**: `pnpm dev:admin` (Port **`3002`**에서 동작)
* **로컬 Mocking API 서버**: `pnpm dev:server` (Port **`3333`**에서 mock json-server 실행)
* **통합 실행**: `pnpm dev:all` (전체 플랫폼 앱 개발 서버와 mock API 서버를 동시에 가동)

### 🛠️ 검증 및 빌드 (Verify & Build)
* **프로덕션 통합 빌드**: `pnpm run build` (Turborepo 파이프라인 캐싱을 사용해 전사 앱 번들링)
* **타입 안전성 검사**: 각 개별 앱 디렉토리에서 `pnpm exec tsc --noEmit` 실행
* **코드 포맷터**: `pnpm run format` (Biome을 통한 초고속 일괄 코드 포맷팅)

---

## 📂 워크스페이스 디렉토리 아키텍처

```plaintext
d:/project/bwg/bx-cf-fe/
├── pnpm-workspace.yaml            # pnpm 워크스페이스 정의 (apps/* 및 packages/*)
├── turbo.json                     # 고성능 빌드 캐싱 파이프라인 정의 (Turborepo)
├── biome.json                     # Biome 린터 & 포맷터 글로벌 설정 (A11y 제외 완료)
│
├── packages/
│   └── shared/                    # 단일화된 스마트 공유 패키지 (@bx/shared)
│       ├── src/
│       │   ├── entities/          # FSD 핵심 엔티티 도메인 (Account, Alarm, Auth, Menu, Product, User)
│       │   ├── shared/            # 공통 자산 (ui, hooks, model, lib, types, constants, ajax)
│       │   └── index.ts           # 배럴 파일 (외부로 비즈니스 및 UI 일괄 Export)
│       └── package.json
│
└── apps/
    ├── mobile-web/                # [MAIN] 실제 작동하는 모바일 전용 핵심 애플리케이션 (Port 3001)
    │   ├── src/                   # FSD 규칙에 따른 페이지 및 위젯 (FooterButton 캡슐화 완료)
    │   ├── vite.config.ts         # publicDir 설정 (루트 public 자산 공유)
    │   └── index.html             # 모바일용 헤더 및 메타데이터 최적화
    │
    ├── pc-web/                    # [GATE] 데스크톱 전용 게이트웨이 플레이스홀더 웹 (Port 3000)
    │   ├── src/main.tsx           # 글래스모피즘 기반의 모바일 유도 안내 대문 페이지
    │   └── vite.config.ts         # 포트 3000번 독립 번들링 설정
    │
    └── admin-portal/              # [ADMIN] 관리자용 플랫폼 템플릿 애플리케이션 (Port 3002)
```

---

## 🎨 코드 스타일 및 개발 표준 (Code Standards)

### 1. 린터 및 포맷터 (Biome)
본 프로젝트는 기존 ESLint/Prettier 대신 차세대 초고속 러스트 기반 도구인 **Biome**을 채택하여 코드 품질과 스타일을 관리합니다.
* **접근성(A11y) 검사 예외 적용**: 금융 및 자산 관리 프로토타이핑/마이그레이션 특성을 고려하여, 웹 접근성 관련 린트 규칙들(`a11y`)은 글로벌 [biome.json](file:///d:/project/bwg/bx-cf-fe/biome.json) 설정에서 완전히 무시(`"all": false`) 처리되어 개발 속도를 저해하지 않도록 보완되었습니다.
* **포맷팅 규칙**:
  * 인덴트: Space 2
  * 개행 문자: LF
  * 따옴표 스타일: Single Quotes (`'`)
  * 세미콜론: 항상 사용 (`semicolons: always`)

### 2. 모듈화 및 Barrel 작성 규칙 (`index.ts`)
* 엔티티, 훅, UI 컴포넌트 등은 관련 디렉토리의 `index.ts`를 통해 한곳에 묶어 노출시킵니다.
* **순환 참조 배제 원칙**: `@bx/shared` 패키지 내부 모듈(예: `Modal.tsx`, `Page.tsx` 등)이 `@bx/shared` 본인 명칭으로 소스를 호출할 경우 순환 의존성 오류를 일으키므로, **패키지 내부에서는 반드시 로컬 상대 경로로 모듈을 임포트**해야 합니다.

### 3. 공통 상수 관리 (Shared Constants)
프로젝트 전반에서 사용되는 상수는 `@bx/shared` 패키지 내 `packages/shared/src/shared/constants/`에서 중앙 집중식으로 관리하며, `index.ts` 배럴 파일을 통해 일괄 제공합니다.
* **상수 모듈 구성**:
  * **`api.ts`**: API 관련 상수 (`API_URL` - `http://localhost:3333`, `API_ENDPOINTS` - 엔드포인트 객체, `API_CONFIG` - 타임아웃/재시도 설정)
  * **`siteConfig.ts`**: 사이트 전역 설정 (`CONFIG` - 작동 모드, 페이즈, 세션 키, 타이머, 테마 모드, 이체 한도 설정 등)
  * **`storage-keys.ts`**: 브라우저 캐시 및 스토리지 키 상수 집합 (`STORAGE_KEYS` 및 `StorageKey` 타입)
  * **`index.ts`**: 배럴 파일 및 앱 기본 설정 (`APP_CONFIG`, `ROUTES` 라우팅 경로, `BANK_OPTIONS` 은행 목록)
* **임포트 규칙**:
  * **패키지 외부 (apps/*)**: 반드시 `@bx/shared` 배럴 모듈로 일괄 임포트하여 참조합니다. (예: `import { API_URL, STORAGE_KEYS } from '@bx/shared';`)
  * **패키지 내부**: 순환 참조 방지를 위해 상대 경로를 사용하여 개별 임포트합니다. (예: `import { API_URL } from './api';`)

---

## 📘 Git 커밋 메시지 규칙 (Commit Convention)

일관된 코드 히스토리 관리를 위해 깃 커밋 메시지는 다음 규격을 의무적으로 준수합니다.

### 🔖 기본 형식
* `Type(Scope): Subject`

### 🧱 Commit Type
| Type | 설명 |
| :--- | :--- |
| **feat** | 새로운 기능 추가 |
| **fix** | 버그 및 에러 수정 |
| **docs** | 문서 수정 (README 등) |
| **style** | 코드 포맷팅, 스타일 수정 (기능 영향 없음) |
| **refactor**| 구조 리팩터링 |
| **build** | 빌드 관련 설정 수정 (Vite, pnpm 등) |
| **chore** | 패키지 업데이트, 잡다한 설정 변경 |

---

*본 프레임워크에 대한 기술 문의 및 아키텍처 개선안은 개발 리드 혹은 pair programming 어시스턴트(Antigravity)에게 전달해 주시기 바랍니다.*
