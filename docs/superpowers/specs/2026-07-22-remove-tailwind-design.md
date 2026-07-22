# Tailwind 제거 설계

## 목표

전체 프런트엔드 모노레포에서 Tailwind CSS와 `tailwind-merge` 의존성을 제거하고,
스타일링 방식을 plain CSS Modules와 명시적인 전역 기반 CSS로 통일한다. 기존 PC, Mobile,
Admin 화면의 시각적 결과와 컴포넌트 동작은 유지한다.

## 배경

현재 스타일링은 앱마다 다른 방식으로 혼재한다.

- 세 앱 모두 `@tailwindcss/vite` 플러그인과 전역 `@import "tailwindcss"`를 사용한다.
- 전체 CSS Module 46개 중 19개가 총 83개의 `@apply` 선언을 사용한다.
- PC와 일부 Mobile 화면은 JSX에 Tailwind 유틸리티 클래스를 직접 작성한다.
- shared Button, Input, Textarea, Select, Dialog, Drawer, Popover, Form은 Tailwind 유틸리티와
  `tailwind-merge`에 의존한다.
- `theme.css`는 CSS 변수를 Tailwind 색상 유틸리티로 노출하기 위해 `@theme inline`을 사용한다.
- Mobile의 `bxui_template.css`와 Tailwind cascade layer가 충돌한 선례가 있다.

CSS만 담당하는 퍼블리셔와 협업하려면 JSX, CSS Modules, `@apply`로 나뉜 스타일 수정 지점을
하나의 CSS 문법과 파일 소유 모델로 줄이는 것이 유리하다.

## 검토한 접근

### 1. 신규 코드만 CSS Modules로 작성

기존 Tailwind를 그대로 두고 신규·수정 코드부터 CSS Modules를 적용한다. 초기 비용은 낮지만
혼합 기간이 정해지지 않고, shared UI와 기존 화면을 수정할 때 계속 두 체계를 이해해야 한다.
프로젝트 전체에서 Tailwind를 제거한다는 목표를 충족하지 못하므로 선택하지 않는다.

### 2. shared UI에만 Tailwind 유지

앱 화면은 CSS Modules로 바꾸고 shared primitive 내부의 Tailwind는 캡슐화한다. 앱 퍼블리셔의
접촉면은 줄지만 Vite 플러그인, Tailwind 테마, source scan, `tailwind-merge` 의존성이 모두
남는다. 빌드 체계와 스타일 규칙을 단순화하지 못하므로 선택하지 않는다.

### 3. 전체 제거 후 plain CSS Modules로 통일

Tailwind가 생성하던 CSS를 각 시각적 책임 단위의 CSS Module로 옮기고, reset과 테마만 전역
CSS로 유지한다. 변환 범위는 가장 크지만 최종 규칙이 가장 명확하며 퍼블리셔 협업 목표와
일치한다. 이 접근을 선택한다.

## 목표 구조

### 전역 기반 스타일

- `packages/shared/src/shared/styles/theme.css`의 `:root`, `.dark` CSS 변수는 유지한다.
- Tailwind 전용 `@custom-variant`와 `@theme inline`은 제거한다.
- Tailwind Preflight에 암묵적으로 의존하던 기본값은 별도의 shared reset CSS로 명시한다.
- reset은 낮은 cascade layer에 두어 Mobile의 unlayered `bxui_template.css`와 앱별 스타일이
  우선하도록 한다.
- 각 앱의 `styles.css`는 reset, theme, 앱 전역 element 스타일만 관리한다.
- `apps/mobile-web/src/shared/styles/bxui_template.css`는 Tailwind가 아니므로 유지한다.

### 컴포넌트와 화면 스타일

- 독립적인 시각적 책임 단위는 인접한 `*.module.css`에서 스타일을 소유한다.
- 기존 `@apply` 선언은 동일한 결과의 표준 CSS 선언과 pseudo selector로 변환한다.
- JSX의 Tailwind 문자열은 해당 화면이나 컴포넌트의 CSS Module 클래스로 변환한다.
- 스타일이 없는 로직 전용 컴포넌트에는 빈 CSS Module을 만들지 않는다.
- 정적인 레이아웃·색상·간격을 inline style로 옮기지 않는다.
- 기존 inline style 사용 파일은 기존 인접 파일의 네이밍 관례에 맞는 `*.module.css`를 직접
  소유하거나 이미 사용하는 Module에 스타일을 추가한다.
- inline style의 정적 선언은 모두 Module 클래스로 옮긴다. 데이터로 계산되는 너비, 좌표,
  z-index, 사용자 지정 색상 같은 런타임 값은 CSS custom property만 inline으로 전달하고 실제
  CSS property 선언은 Module이 소유한다.

### shared UI 확장 방식

- Button, Input, Textarea, Select, Dialog, Drawer, Popover, Form의 기본 스타일과 상태는 각
  컴포넌트 CSS Module이 소유한다.
- Button의 `variant`와 `size` 공개 API는 유지하고 각각 Module 클래스에 매핑한다.
- Radix/Vaul의 `data-state` 애니메이션은 CSS attribute selector로 옮긴다.
- 호출자가 전달하는 `className`은 `clsx`로 결합한다.
- 현재 Tailwind 유틸리티를 `className`으로 전달하는 모든 내부 호출부는 로컬 Module 클래스로
  바꾼다. `tailwind-merge`의 유틸리티 충돌 해결에 기대지 않는다.
- 두 곳에 중복된 `cn` helper는 기존 import 호환성을 유지하되 내부 구현에서
  `tailwind-merge`를 제거하고 `clsx`만 사용한다.

## 의존성 및 빌드 설정

모든 Tailwind 문법과 유틸리티 호출부를 변환한 뒤 다음을 제거한다.

- 루트 `devDependencies`의 `@tailwindcss/vite`
- shared package의 `tailwindcss`, `tailwind-merge`
- 세 앱 Vite 설정의 Tailwind import와 plugin 등록
- 전역·Module CSS의 `@import "tailwindcss"`, `@source`, `@apply`
- theme CSS의 `@custom-variant`, `@theme`
- lockfile의 관련 패키지 항목

의존성 제거는 스타일 변환 뒤 마지막에 수행해, 중간 단계에서 기존 화면이 완전히 무스타일이
되는 상태를 피한다.

## 호환성과 비목표

- 라우팅, 상태 관리, API, 폼 데이터 흐름은 변경하지 않는다.
- 컴포넌트의 공개 props와 DOM 접근성 속성을 유지한다.
- 이번 작업에서 디자인을 개선하거나 화면 레이아웃을 재설계하지 않는다.
- 기존 디자인 토큰의 이름이나 색상값을 재설계하지 않는다.
- `bxui_template.css` 정리나 삭제는 별도 과제로 남긴다.

## 검증 전략

### 정적 정책 검증

저장소 검사에서 다음 항목이 0건이어야 한다.

- `tailwindcss`, `@tailwindcss/vite`, `tailwind-merge` 패키지 및 import
- `@import "tailwindcss"`, `@apply`, `@source`, `@theme`, `@custom-variant`
- JSX와 TypeScript에 남은 Tailwind 유틸리티 문자열

재도입을 방지할 수 있도록 위 조건을 검사하는 자동화된 정책 테스트를 추가한다.

### 기능 검증

- shared unit test 전체 통과
- PC, Mobile, Admin TypeScript check 통과
- 세 앱 production build 통과
- 기존 E2E를 실행할 수 있는 환경에서는 앱별 Playwright 테스트 통과

### 시각 검증

- 로그인, 기본 레이아웃, modal/drawer, form control, Button variant, Mobile footer와 주요 이체
  화면을 기존 결과와 비교한다.
- hover, focus-visible, disabled, Radix/Vaul open/closed 상태와 반응형 breakpoint를 확인한다.
- Mobile에서는 `bxui_template.css`가 shared overlay와 form control을 덮어쓰지 않는지 별도로
  확인한다.

## 완료 조건

- 저장소 소스와 package metadata에서 Tailwind 관련 의존성과 문법이 완전히 사라진다.
- 스타일 파일은 plain CSS와 CSS Modules 문법만 사용한다.
- 세 앱과 shared package의 check, test, build가 통과한다.
- 주요 화면과 shared UI의 시각적·상호작용 회귀가 없다.
