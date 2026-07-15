# BX-CF Executive Editorial Redesign

## Objective

`landing/assets/BX-CF.pptx`의 8페이지 구성, 페이지 순서, 모든 문구를 그대로 유지하면서 디자인만 Executive Editorial 콘셉트로 변경한다.

By the end, 경영진은 현재 덱과 동일한 내용을 더 빠르게 읽고 이해할 수 있어야 하며, 자료는 개발 대시보드가 아닌 정돈된 임원 보고서로 보여야 한다.

## Output

- 원본: `landing/assets/BX-CF.pptx` 보존
- 결과: `landing/assets/BX-CF_ExecutiveEditorial.pptx`
- 슬라이드 수: 8페이지 유지
- 산출물 형식: 편집 가능한 PowerPoint

## Non-negotiable Content Rules

- 문구 추가, 삭제, 요약, 교정 금지
- 페이지 순서 변경 금지
- 항목 그룹과 의미 관계 유지
- 디자인을 위한 줄바꿈과 텍스트 박스 재배치는 허용
- 기존 숫자, 제품명, 기술명, 날짜, 페이지 번호 유지

## Visual Direction

### Palette

- Canvas: `#F7F9FC`
- Primary text: `#0F1B3D`
- Brand cobalt: `#1F57F8`
- Supporting blue: `#3A83D8`
- Pale blue: `#DCE7FA`
- Secondary text: `#58657B`
- Hairline: `#CBD8EF`

### Typography

- Typeface: `Malgun Gothic`
- Cover title: 52–58px, bold
- Slide title: 38–44px, bold
- Mid-level heading: 21–25px, bold
- Body: 16–19px
- Metadata/footer: 10–12px
- 한 페이지 안에서 본문 크기를 과도하게 줄이지 않는다.

### Composition

- 카드 그리드보다 큰 제목, 규칙선, 정렬된 컬럼을 우선한다.
- 외곽선 박스를 최소화하고 여백과 구획선으로 계층을 만든다.
- 코발트 색은 핵심 수치, 구획 시작점, 선택된 요소에만 사용한다.
- 페이지마다 하나의 우선 시선 흐름을 유지한다.
- 좌우 기본 여백은 동일하게 유지한다.

## Slide-by-slide Design

### 1. Cover

- 좌측 코발트 세로 레일
- 좌측 상단 `CHANNEL UNIT`
- 큰 한글 제목과 작은 영문 제목의 편집형 위계
- 하단 규칙선 아래에 기간, 인원, 산출물을 3열로 배치
- 기존 `2026.06` 유지

### 2. Definition

- 제목 아래 정의 문장을 넓은 단일 본문 영역으로 배치
- 핵심 기술·범위 문구는 코발트 강조 유지
- 하단 세 개 정의 항목은 박스 대신 상단 규칙선이 있는 3열 편집 레이아웃

### 3. Why Now

- 세 항목을 세로 카드가 아닌 가로 보고서 행으로 구성
- `01–03`, 문제 제목, 설명을 한 행에 정렬
- 항목 간에는 얇은 구분선만 사용

### 4. Architecture

- Frontend, API 연계, Backend를 동일 높이의 3개 컬럼으로 배치
- 현재 기술 항목과 강조 관계는 그대로 유지
- API 연계 핵심 항목은 연한 블루 면과 코발트 타이포로 강조
- E2E 테스트 자동화는 하단 전체 폭 밴드로 유지

### 5. Plan

- 1–3개월차를 3개 편집 컬럼으로 배치
- 월 숫자는 크게, 본문은 규칙선 아래 정렬
- 산출물 영역은 각 컬럼 하단에 같은 기준선으로 정렬

### 6. Deliverables

- 2행 × 3열 구조 유지
- 외곽 카드 제거, 각 항목 상단에 짧은 코발트 규칙선 사용
- 제목과 설명 사이의 간격을 넓혀 빠른 스캔 지원

### 7. Impact

- 좌측 기대효과, 우측 확장 로드맵의 2열 구조 유지
- 기대효과는 짧은 코발트 대시로 목록화
- 제품 `core → mci → full`은 단계가 커지는 수평 폭으로 표현
- 모니터링 도구는 우측 하단 보조 영역으로 유지

### 8. AI

- 3열 구조 유지
- 가운데 `우리의 실증 — 이미 적용 중`을 연한 블루 배경과 코발트 상단선으로 강조
- 좌우 영역은 외곽선 없이 제목·본문 정렬로 구성
- 마지막 페이지이므로 하단 여백을 안정적으로 확보

## Reusable Chrome

- 상단 섹션 라벨: 코발트 세로 마커 + 영문/한글 메타
- 하단 좌측: `채널 파운데이션 · Channel Foundation`
- 하단 우측: 기존 페이지 번호
- 페이지별 제목 시작점과 하단 푸터 기준선을 동일하게 유지

## Quality Gates

- 8페이지 전체 문구가 원본과 일치
- 원본 순서와 항목 관계 유지
- PowerPoint에서 편집 가능한 텍스트와 도형 사용
- 제목 줄바꿈, 본문 잘림, 슬라이드 밖 오버플로 없음
- 4페이지 세 컬럼 동일 높이
- 전체 8페이지 렌더링 후 개별 페이지 전체 크기 검토
- PowerPoint 압축 무결성 및 슬라이드 수 검증

## Out of Scope

- 문구 개선 또는 개조식 재작성
- 슬라이드 추가·삭제
- 로고 신규 제작
- 외부 사진·일러스트 추가
- 애니메이션 및 전환 효과 추가
