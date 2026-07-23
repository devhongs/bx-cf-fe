# Storybook Composition POC 설계

## 목표

BX-CF 모노레포에 `shared`, `pc`, `admin`, `mobile`용 Storybook을 독립 실행 단위로 추가하고, Composition Hub에서 한 번에 탐색할 수 있게 한다.

초기 범위는 Storybook 인프라와 대표 story를 통한 실증에 한정한다. 이후 Figma Variables 또는 저장소의 DTCG token JSON에서 생성한 CSS를 각 Storybook과 실제 앱이 함께 소비하도록 확장할 수 있어야 한다.

## 범위

### 포함

- `apps/storybook` 단일 workspace
- `hub`, `shared`, `pc`, `admin`, `mobile` Storybook 설정 프로필
- 앱별 독립 CSS, Vite alias, 정적 asset 구성
- Composition Hub의 로컬 `refs`
- 각 Storybook의 token showcase
- 각 대상의 의존성이 적은 대표 UI story
- 개별 및 전체 실행·빌드 스크립트
- 정적 빌드 검증

### 제외

- Figma 파일 및 Figma Variables 생성
- DTCG token JSON 및 CSS 생성 자동화
- MSW 기반 API mocking
- 인증·라우터·React Query를 요구하는 page story
- interaction, accessibility, visual regression CI
- Storybook 정적 사이트 운영 배포

제외 항목은 현재 POC가 안정화된 뒤 독립 작업으로 추가한다.

## 선택한 아키텍처

Storybook 의존성과 설정은 `apps/storybook` workspace에 모은다. 실제 story는 가능한 한 대상 컴포넌트와 같은 디렉터리에 둔다.

```text
apps/storybook/
├── package.json
├── hub/
│   ├── main.ts
│   ├── preview.ts
│   └── Introduction.mdx
├── shared/
│   ├── main.ts
│   └── preview.ts
├── pc/
│   ├── main.ts
│   └── preview.ts
├── admin/
│   ├── main.ts
│   └── preview.ts
├── mobile/
│   ├── main.ts
│   └── preview.ts
└── stories/
    └── foundation/
        ├── TokenShowcase.tsx
        ├── TokenShowcase.module.css
        └── TokenShowcase.stories.tsx
```

```text
packages/shared/src/**/<Component>.stories.tsx
apps/pc-web/src/**/<Component>.stories.tsx
apps/admin-portal/src/**/<Component>.stories.tsx
apps/mobile-web/src/**/<Component>.stories.tsx
```

`apps/storybook`은 `pnpm-workspace.yaml`의 기존 `apps/*` 패턴에 포함된다. `hub`, `shared`, `pc`, `admin`, `mobile`은 별도 workspace가 아니라 Storybook CLI의 `--config-dir`로 선택하는 설정 프로필이다.

## 실행 단위

| 대상 | 개발 포트 | 역할 |
| --- | ---: | --- |
| Hub | 6005 | 네 Storybook을 Composition으로 탐색 |
| Shared | 6006 | 공용 UI와 기본 theme |
| PC | 6007 | PC 전역 CSS와 PC 전용 UI |
| Admin | 6008 | Admin 전역 CSS와 Admin 전용 UI |
| Mobile | 6009 | Mobile 전역 CSS, 모바일 viewport와 UI |

개별 Storybook은 단독으로 실행할 수 있어야 한다. 전체 실행 명령은 다섯 개발 서버를 병렬로 시작한다.

## Story 수집과 표시

각 설정 프로필은 공통 `TokenShowcase.stories.tsx`와 자신의 소스 영역만 수집한다.

- Shared: `packages/shared/src/**/*.stories.tsx`
- PC: `apps/pc-web/src/**/*.stories.tsx`
- Admin: `apps/admin-portal/src/**/*.stories.tsx`
- Mobile: `apps/mobile-web/src/**/*.stories.tsx`

Hub는 로컬 story로 `Introduction.mdx` 하나만 가지며, 나머지는 `refs`로 연결한다.

Composition에서 이미 대상 이름이 최상위에 표시되므로 story title에 `PC`, `Admin` 같은 접두사를 반복하지 않는다.

```text
Shared
├── Foundation/Tokens
└── UI/Button

PC
├── Foundation/Tokens
└── UI/PopoverPanel

Admin
├── Foundation/Tokens
└── UI/AdminFilterBar

Mobile
├── Foundation/Tokens
└── Features/AiSearchCard
```

## 렌더링 격리

각 대상의 `preview.ts`는 해당 전역 CSS만 import한다.

- Shared: `reset.css`, `theme.css`
- PC: `apps/pc-web/src/shared/styles/styles.css`
- Admin: `apps/admin-portal/src/shared/styles/styles.css`
- Mobile: `apps/mobile-web/src/shared/styles/styles.css`

각 Storybook은 별도 Vite 프로세스와 iframe에서 실행되므로 서로 다른 `:root` token과 전역 스타일이 섞이지 않는다.

PC, Admin, Mobile 설정은 각 앱의 `@` alias를 해당 앱 `src`로 연결한다. 모든 설정은 React와 React DOM을 dedupe하고, `?react` SVG import를 위해 기존 앱과 동일하게 SVGR을 적용한다. 공용 `public` 디렉터리를 static asset 경로로 제공해 Pretendard font와 이미지 경로를 유지한다.

초기 story는 전역 Provider 없이 렌더링 가능한 UI를 선택한다. Provider가 필요한 story가 추가되면 앱별 decorator에 최소 범위로 추가하며, 인증이나 네트워크 상태는 전역에서 실제 백엔드에 연결하지 않는다.

초기 대표 story는 다음으로 고정한다.

- Shared: `Button`
- PC: `PopoverPanel`
- Admin: status select를 생략한 `AdminFilterBar`
- Mobile: `AiSearchCard`

## 테마와 token showcase

각 대상은 Light/Dark toolbar를 제공하고 선택값에 따라 canvas 루트에 `.dark` class를 적용한다.

공통 token showcase는 CSS custom property를 직접 소비해 다음 semantic token을 표시한다.

- `--background`
- `--surface`
- `--surface-raised`
- `--foreground`
- `--muted`
- `--border`
- `--accent`
- `--accent-hover`
- `--success`
- `--warning`
- `--danger`

같은 story가 각 Storybook의 `preview.ts` 아래에서 렌더링되므로 앱별 token override 차이를 Composition에서 비교할 수 있다.

향후 token 자동화가 추가되면 데이터 흐름은 다음과 같다.

```text
Figma Variables 또는 DTCG token JSON
               ↓
         generated CSS
          ├── Storybook
          └── 실제 앱
```

Storybook은 token 변환기가 아니라 생성 결과의 시각적 검증 환경으로 유지한다.

## Composition 데이터 흐름

개발 환경에서 Hub는 고정된 로컬 URL을 참조한다.

```text
Hub :6005
├── Shared :6006
├── PC :6007
├── Admin :6008
└── Mobile :6009
```

Hub는 통합 탐색용이다. Controls, Docs, 테스트 addon 등 대상 Storybook의 세부 기능은 개별 Storybook URL을 기준으로 사용한다.

배포를 추가할 때에는 `refs` URL을 환경변수로 주입해 정적 배포 URL로 전환한다. 이번 POC에서는 로컬 Composition까지만 구현한다.

## 스크립트

`apps/storybook/package.json`은 다음 목적의 스크립트를 제공한다.

- 개별 개발: `dev:hub`, `dev:shared`, `dev:pc`, `dev:admin`, `dev:mobile`
- 전체 개발: `storybook`
- 개별 빌드: `build:hub`, `build:shared`, `build:pc`, `build:admin`, `build:mobile`
- 전체 빌드: `build:all`
- 타입 검사: `check`

Storybook workspace에는 일반 `dev`와 `build` 스크립트를 만들지 않는다. 기존 루트 `turbo dev`와 `turbo build`가 Storybook 서버 또는 정적 빌드를 자동 포함하지 않도록 Storybook 실행을 명시적인 전용 명령으로 격리한다.

루트 `package.json`에는 사용자가 기억하기 쉬운 프록시 스크립트를 추가한다.

- `storybook`
- `storybook:hub`
- `storybook:shared`
- `storybook:pc`
- `storybook:admin`
- `storybook:mobile`
- `build:storybook`

정적 빌드는 `apps/storybook/dist/<target>`에 생성해 기존 Turbo `dist/**` output 규칙에 포함한다.

## 오류 처리

- 특정 ref 서버가 꺼져 있으면 Hub의 해당 항목만 사용할 수 없으며 다른 Storybook은 계속 동작한다.
- 전체 실행은 한 프로세스가 시작에 실패하면 명확한 종료 코드를 반환하도록 구성한다.
- 앱별 alias 또는 CSS import 오류는 해당 Storybook 빌드에서 격리해 발견한다.
- story가 실제 API를 호출하지 않도록 초기 대표 컴포넌트를 선택한다.
- generated CSS가 아직 없으므로 현재 CSS 파일을 그대로 사용한다.

## 검증

1. 각 설정 프로필의 정적 Storybook 빌드가 성공한다.
2. `apps/storybook/dist/{hub,shared,pc,admin,mobile}`에 산출물이 생성된다.
3. `pnpm check`가 기존 앱과 새 workspace에서 성공한다.
4. `pnpm lint`가 새 설정과 story에서 성공한다.
5. Token showcase가 각 앱 CSS의 Light/Dark 값을 표시한다.
6. Composition Hub sidebar에 Shared, PC, Admin, Mobile ref가 나타난다.

시각 확인이 필요한 5번과 6번은 전체 개발 서버 실행 후 브라우저에서 확인한다.

## 확장 순서

1. POC: Composition, token showcase, 대표 UI
2. 앱별 feature story 추가
3. decorator와 MSW를 이용한 page state story 추가
4. Storybook Vitest addon을 이용한 render·interaction test
5. DTCG JSON → CSS 생성 자동화
6. Figma Variables import/export 또는 Tokens Studio 연동
7. 정적 Storybook 배포와 visual regression CI
