# README HTML Scroll TOC Design

## Goal

`pnpm gen:readme`로 생성하는 README HTML에 우측 목차를 제공한다. 문서는 페이지로 나누지 않고 기존처럼 하나의 세로 스크롤 문서로 유지하며, 목차를 클릭하면 해당 문단으로 부드럽게 이동한다.

## Scope

- FE와 BE README HTML에 동일한 목차 기능을 적용한다.
- Markdown의 `h2`만 목차 메뉴로 사용한다.
- `h1`과 `h3`는 목차에서 제외하며, `h3`는 ID 없는 일반 본문 heading으로 렌더링한다.
- 기존 Markdown 본문 스타일과 단일 HTML 산출물 구조를 유지한다.
- 모바일용 별도 목차 UI나 페이지 분할은 추가하지 않는다.

## Generation

`marked.lexer()`로 Markdown을 토큰화하고 `h2` heading 토큰에만 고유 ID를 부여한다. 본문과 목차는 같은 토큰 정보를 사용해 서로 다른 ID가 생성되지 않게 한다.

ID는 제목에서 읽기 가능한 slug를 만들고, 같은 제목이 반복되면 순번을 붙여 중복을 방지한다. HTML 문자열을 정규식으로 다시 분석하지 않는다.

## Layout And Interaction

- 넓은 화면에서는 본문 오른쪽에 고정 폭 목차를 배치한다.
- 목차는 viewport 안에서 sticky로 유지하며, 항목이 많으면 목차 내부만 스크롤한다.
- 항목 클릭 시 URL hash를 갱신하고 해당 heading으로 부드럽게 스크롤한다.
- 스크롤할 때 각 `h2`의 문서 내 절대 위치와 상단 기준선을 비교해 현재 문단의 목차 항목을 결정한다.
- 문서 하단에서는 마지막 문단이 짧아도 마지막 `h2`를 활성화하고, 위로 스크롤하면 기준선 직전의 이전 `h2`를 다시 활성화한다.
- 좁은 화면에서는 목차를 숨기고 본문을 전체 폭으로 표시한다.
- JavaScript가 실행되지 않아도 anchor 링크를 통한 문단 이동은 동작한다. 현재 문단 강조만 JavaScript에 의존한다.

## Accessibility

- 목차는 `nav`와 `aria-label`을 사용한다.
- 링크는 키보드로 접근할 수 있고 기존 focus 동작을 유지한다.
- 현재 항목에는 `aria-current="location"`을 적용한다.
- heading에는 상단 여백을 고려한 `scroll-margin-top`을 적용한다.

## Testing

- `h2`만 목차에 포함되고 `h1`과 `h3`는 제외되는지 검증한다.
- `h3`가 ID 없는 일반 본문 heading으로 렌더링되는지 검증한다.
- 본문 heading ID와 목차 href가 일치하는지 검증한다.
- 중복 제목이 고유 ID를 받는지 검증한다.
- 생성 HTML에 sticky 목차, 반응형 숨김, smooth scroll 및 현재 문단 추적 코드가 포함되는지 검증한다.
- JSDOM에서 짧은 마지막 문단까지 일반 scroll 이벤트로 이동했을 때 마지막 링크만 활성화되고, 위로 스크롤하면 이전 링크만 다시 활성화되는지 검증한다.
- 테스트 통과 후 `pnpm gen:readme`를 실행하고 생성된 `fe.readme.html`을 데스크톱과 좁은 viewport에서 확인한다.

## Out Of Scope

- 페이지네이션
- 목차 검색 및 접기/펼치기
- 모바일 전용 드로어 목차
- Markdown 원본 수정
