# 📘 프로젝트 개요 (Project Overview)

본 프로젝트는 초고속 빌드 성능과 극대화된 DX(Developer Experience)를 지향하는 **React + TypeScript + Vite** 기술 스택 기반의 엔터프라이즈급 금융/자산관리 웹 애플리케이션 프레임워크입니다.

비즈니스 요구사항의 급격한 변화에 유연하게 대응하고 대규모 협업 개발 환경에서도 최상의 아키텍처 정밀도를 유지하기 위해 **Feature-Sliced Design (FSD)** 설계 규격을 전사적으로 적용하고 있습니다. 이를 통해 비즈니스 도메인과 UI 계층을 격리하고 다음과 같은 핵심 아키텍처적 가치를 제공합니다:

* 🎯 **강력한 캡슐화와 결합도 최소화 (Loose Coupling)**: 레이어(Layer), 슬라이스(Slice), 세그먼트(Segment)로 분할된 구조를 통해 관심사를 엄격히 분리(Separation of Concerns)하고 모듈별 독립성을 극대화합니다.
* 🔗 **예측 가능한 단방향 의존성 흐름**: 상위 레이어가 하위 레이어만 참조할 수 있도록 강제하여 복잡한 프로젝트에서 흔히 발생하는 순환 참조(Circular Dependency) 문제를 구조적으로 원천 배제합니다.
* 🚀 **점진적 비즈니스 스케일아웃 (Scalability)**: 도메인 모델(Entity)과 핵심 기능(Feature)이 명확히 구획되어 서비스 확장에 다른 사이드 이펙트 없이 애자일한 기능 배포가 가능합니다.
* ⚡ **고도화된 상태 동기화 파이프라인**: **TanStack Query (React Query) v5**와 엄격하게 타입 정의된 커스텀 훅 구조(`QueryHookOptions`)를 융합하여 안전하고 선언적인 비동기 상태 관리를 제공합니다.

효율적인 프론트엔드 중심의 독립적 애자일 스프린트를 위해 **json-server를 활용한 지능형 로컬 Mocking 인프라**를 지원하여, 실제 상용 API 인터페이스 명세와의 강력한 호환성을 유지합니다.

---

## 🚀 실행 방법

```bash
pnpm install
pnpm run dev
```

---

## 📜 PNPM Scripts 설명

이 프로젝트에서는 다음과 같은 PNPM 스크립트를 사용합니다:

### 🚀 개발 관련

```json
"dev": "concurrently \"vite --port 3000\" \"json-server db.json --port 3333\"",
"dev:client": "vite --port 3000",
"dev:server": "json-server db.json --port 3333",
"watch:json-server": "json-server db.json --port 3333"
```

- `dev`: 클라이언트와 서버를 동시에 실행합니다.
- `dev:client`: Vite 개발 서버만 실행합니다.
- `dev:server`: JSON Server만 실행합니다.
- `watch:json-server`: JSON Server 단독 실행 (dev:server와 동일)

---

### 🛠️ 빌드 및 실행

```json
"start": "vite --port 3000",
"build": "vite build && tsc",
"serve": "vite preview"
```

- `start`: Vite 개발 서버 실행
- `build`: Vite로 번들링 후 TypeScript 타입 검사
- `serve`: 빌드된 결과를 Vite Preview로 실행

---

### 🧪 테스트 및 품질 검사

```json
"test": "vitest run",
"lint": "eslint",
"format": "prettier",
"check": "prettier --write . && eslint --fix"
```

- `test`: Vitest로 테스트 실행
- `lint`: ESLint로 코드 스타일 검사
- `format`: Prettier로 코드 포맷 확인
- `check`: Prettier로 포맷 후 ESLint로 자동 수정

---

# 📝 React 프로젝트 네이밍 컨벤션 가이드

React 프로젝트의 파일 및 폴더 구조에 대한 명확하고 일관된 규칙을 정하는 것은 코드의 가독성을 높이고 유지보수를 용이하게 하는 데 매우 중요합니다. 다음은 커뮤니티에서 널리 받아들여지고 많은 개발자들이 선호하는 규칙입니다.

---

## 1. 컴포넌트 (Components) 🧱

컴포넌트는 UI의 독립적인 부분을 나타내며, 재사용성을 높이는 핵심 요소입니다.

- **폴더명**: **PascalCase**
  - 컴포넌트와 관련된 파일들(스타일, 테스트 등)을 하나의 폴더에 모아 관리합니다.
  - _예시: `components/UserProfile`_
- **파일명**: **PascalCase**
  - 컴포넌트 파일명 역시 파스칼 케이스를 사용합니다.
  - _예시: `UserProfile.tsx`_
- **컴포넌트명 (모듈명)**: **PascalCase**
  - 컴포넌트 함수의 이름 또한 파일명과 동일하게 파스칼 케이스를 따릅니다.
  - _예시: `export default function UserProfile() { ... }`_

**구조 예시:**

```plaintext
src/
└── components/
    └── UserProfile/
        ├── UserProfile.tsx
        ├── UserProfile.module.css
        └── UserProfile.test.tsx
```

---

## 2. 훅 (Hooks) 🪝

훅은 상태 로직을 컴포넌트로부터 분리하여 재사용 가능하게 만드는 함수입니다.

- **폴더명**: **camelCase** (또는 FSD 아키텍처 슬라이스 하위의 경우 **model** 또는 **hooks** 등)
  - 일반적으로 공통 훅은 `hooks/` 폴더에, 각 슬라이스별 훅은 해당 슬라이스의 `model/` 또는 별도 폴더에 모아둡니다.
- **파일명**: **camelCase.hook** 또는 슬라이스명 뒤에 **.hook**
  - 훅 파일명은 `.hook.ts` 접미사를 사용하는 것을 규칙으로 합니다.
  - _예시: `useToggle.hook.ts`, `account.hook.ts`, `product.hook.ts`_
- **함수명 (모듈명)**: **camelCase**
  - 훅 함수의 이름 역시 `use`로 시작하는 카멜 케이스를 사용합니다.
  - _예시: `export function useToggle() { ... }`_

**구조 예시:**

```plaintext
src/
└── shared/
    └── hooks/
        ├── useToggle.hook.ts
        └── useFetchData.hook.ts
```

---

## 3. 유틸리티 (Utils) 🛠️

유틸리티는 특정 도메인에 종속되지 않고 프로젝트 전반에서 사용되는 순수 함수들의 모음입니다.

- **폴더명**: **camelCase**
  - `utils` 또는 `lib` 과 같은 이름의 폴더를 사용합니다.
  - _예시: `utils/`_
- **파일명**: **camelCase** 또는 **kebab-case**
  - 함수의 역할을 명확히 알 수 있도록 카멜 케이스 또는 케밥 케이스로 파일명을 작성합니다.
  - _예시: `formatDate.ts`, `validation.ts`_
- **함수명 (모듈명)**: **camelCase**
  - 파일 내의 함수들도 카멜 케이스를 사용합니다.
  - _예시: `export function formatDate(date) { ... }`_

**구조 예시:**

```plaintext
src/
└── utils/
    ├── formatDate.ts
    └── validation.ts
```

---

## 4. 타입스크립트 타입 (TypeScript Types) ✍️

타입스크립트를 사용할 때, 인터페이스나 타입 별칭을 정의하는 파일입니다.

- **폴더명**: **kebab-case**
  - `types` 또는 `interfaces` 라는 이름의 폴더에 모아 관리합니다.
  - _예시: `types/`_
- **파일명**: **camelCase.type** 또는 **kebab-case.type**
  - 관련된 타입들을 하나의 파일에 모을 경우 도메인 이름을 기반으로 하며, 파일명 뒤에 `.type.ts`를 붙여 타입 파일임을 명시합니다.
  - _예시: `user.type.ts`, `react-query.type.ts`_
- **타입/인터페이스명**: **PascalCase**
  - 타입이나 인터페이스의 이름은 항상 파스칼 케이스를 사용합니다.
  - _예시: `export interface UserProfile { ... }`_

**구조 예시:**

```plaintext
src/
└── types/
    ├── index.ts
    ├── user.type.ts
    └── post.type.ts
```

---

## 요약표

| 구분         | 폴더명     | 파일명                       | 모듈/함수/타입명         |
| :----------- | :--------- | :--------------------------- | :----------------------- |
| **새그먼트** | kebab-case | -                            | -                        |
| **컴포넌트** | kebab-case | PascalCase (`.tsx`)          | PascalCase               |
| **타입**     | kebab-case | camelCase/kebab-case (`.type.ts`) | PascalCase          |
| **훅**       | kebab-case | camelCase/kebab-case (`.hook.ts`) | camelCase (`use` 접두사) |
| **유틸리티** | kebab-case | kebab-case / camelCase       | camelCase                |

<br>

**구조 예시:**

```plaintext
src/
├── app/
│   ├── providers/
│   │   └── store-provider/
│   │       └── StoreProvider.tsx
│   ├── router/
│   │   └── app-router/
│   │       └── AppRouter.tsx
│   └── index.ts
│
├── processes/
│   └── auth/
│       ├── ui/
│       │   └── AuthGuard/AuthGuard.tsx
│       ├── hooks/
│       │   └── useAuth.hook.ts
│       └── model/
│           └── types.type.ts
│
├── pages/
│   └── profile-page/
│       ├── ui/
│       │   └── ProfilePage/ProfilePage.tsx
│       └── model/
│           └── types.type.ts
│
├── features/
│   └── update-profile/
│       ├── ui/
│       │   └── UpdateProfileForm/UpdateProfileForm.tsx
│       ├── hooks/
│       │   └── useUpdateProfile.hook.ts
│       ├── lib/
│       │   └── validateProfile.ts
│       └── model/
│           └── types.type.ts
│
├── entities/
│   └── user/
│       ├── ui/
│       │   └── UserProfile/UserProfile.tsx
│       ├── hooks/
│       │   └── useUser.hook.ts
│       ├── lib/
│       │   └── formatName.ts
│       └── model/
│           └── types.type.ts
│
├── widgets/
│   └── chatbot-button/
│       ├── ui/
│       │   └── ChatbotButton/ChatbotButton.tsx
│       ├── hooks/
│       │   └── useChatbot.hook.ts
│       ├── lib/
│       │   └── openChatbot.ts
│       └── model/
│           └── types.type.ts
│
└── shared/
    ├── ui/
    │   ├── button/Button.tsx
    │   └── input/Input.tsx
    ├── hooks/
    │   └── useToggle.hook.ts
    ├── lib/
    │   └── classNames.ts
    └── types/
        ├── index.ts
        ├── bxui-core.type.ts
        ├── modal.type.ts
        ├── props.type.ts
        └── react-query.type.ts
```

---

## 📦 Barrel 파일 작성 및 사용 규칙 (`index.ts`)

### 1. 목적

- 컴포넌트, 유틸, 훅 등을 하나의 진입점에서 export하여 **import 경로를 단순화**하고 **모듈 관리 효율성**을 높입니다.

### 2. 작성 규칙

✅ 기본 구조

```ts
export * from './button/Button';
export * from './icon-button/IconButton';
export * from './modal/Modal';
export * from './modal/ModalContainer';
export * from './modal/ModalWrapper';
export * from './page/Page';
```

✅ 폴더 단위로 관리

- 각 기능 단위 폴더에 index.ts를 생성하여 해당 폴더의 컴포넌트/훅/유틸을 정리합니다.

✅ 중첩 barrel은 피하기

- 너무 많은 중첩된 barrel 파일은 디버깅을 어렵게 하므로 1~2단계 수준에서만 사용합니다.

✅ 예외 상황

- 테스트 코드, 타입 정의, 내부 전용 모듈은 barrel에 포함하지 않습니다.

---

## 📘 Git 커밋 메시지 규칙

### 🔖 기본 형식

- `<type>(<scope>): <subject>`

✅ 기본 구조

```plaintext
feat(auth): 로그인 API 연동
fix(ui): 모바일에서 버튼 클릭 안 되는 문제 수정
refactor(core): token 갱신 로직 개선
```

---

### 🧱 Commit Type

| Type         | 설명                                                |
| ------------ | --------------------------------------------------- |
| **feat**     | 새로운 기능 추가                                    |
| **fix**      | 버그 수정                                           |
| **docs**     | 문서 수정 (README 등)                               |
| **style**    | 코드 포맷팅, 세미콜론 누락 등 코드 변경이 없는 경우 |
| **refactor** | 코드 리팩터링 (동작 변경 없음)                      |
| **perf**     | 성능 개선                                           |
| **test**     | 테스트 코드 추가/수정                               |
| **build**    | 빌드 관련 설정 수정 (예: vite, webpack)             |
| **ci**       | CI/CD 구성 파일 수정                                |
| **chore**    | 잡다한 변경 (패키지 업데이트 등)                    |
| **revert**   | 커밋 되돌리기                                       |

---

### 💡 작성 팁

- **subject**는 명령형 현재형으로 작성 (`add` 대신 `added`, `adds` ❌)
- 50자 이내로 요약
- 필요 시 **본문**을 한 줄 띄우고 추가 설명 작성
- 관련 이슈가 있다면 마지막 줄에 `Closes #123` 추가

---
