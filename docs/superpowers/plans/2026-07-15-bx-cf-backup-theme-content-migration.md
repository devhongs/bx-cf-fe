# BX-CF Backup Theme Content Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce an eight-slide `landing/assets/BX-CF_BackupTheme.pptx` that preserves the backup deck's visual theme and layout while carrying the current `BX-CF.pptx` content and omitting the backup closing slide.

**Architecture:** Inspect the backup deck and create a validated template frame map with output slides sourced in the order `1, 3, 2, 4, 5, 6, 7, 8`. Build a starter deck from those inherited slides, then use `@oai/artifact-tool` to rewrite mapped text objects in place. Validate the exported PPTX by re-importing it, comparing required current-deck content tokens, rendering all slides, checking overflow, and running template fidelity checks.

**Tech Stack:** JavaScript ES modules, `@oai/artifact-tool`, presentation template-following scripts, Poppler/LibreOffice-backed rendering utilities.

## Global Constraints

- Preserve `landing/assets/BX-CF.backup-20260714-162605.pptx` colors, backgrounds, fonts, decorative elements, cards, and diagram layout.
- Use `landing/assets/BX-CF.pptx` as the content source for all eight output slides.
- Do not modify either source PPTX.
- Omit backup slide 9.
- Keep `E2E 테스트 자동화` on output slide 4.
- Do not add new marketing copy or summarize source copy.
- Export only the final PPTX inside the repository; keep builders, layouts, previews, and QA artifacts in the external scratch workspace.

---

### Task 1: Build the validated inherited starter deck

**Files:**
- Create: `/var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-backup-theme/tmp/template-frame-map.json`
- Create: `/var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-backup-theme/tmp/template-audit.txt`
- Create: `/var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-backup-theme/tmp/deviation-log.txt`
- Create: `/var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-backup-theme/tmp/source-notes.txt`
- Create: `/var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-backup-theme/tmp/template-starter.pptx`

**Interfaces:**
- Consumes: backup template inspection layouts and `template-inspect.ndjson`.
- Produces: an eight-slide starter deck plus `starter-slide-01.layout.json` through `starter-slide-08.layout.json` for the migration builder.

- [x] **Step 1: Generate the frame map from inspected source elements**

Create a JSON map whose `sourceSlide` sequence is `[1, 3, 2, 4, 5, 6, 7, 8]`. For each mapped source slide, classify every inherited text element referenced by its `aid` as `action: "replace"`; all non-text visual elements remain inherited and unchanged. Record source slide 9 under `omittedSourceSlides` with reason `closing catchphrase removed by user request`.

- [x] **Step 2: Write the audit and deviation records**

Record that source slides 2 and 3 are reordered to match the current narrative, source slide 9 is omitted, slide 4 reuses inherited rows for the E2E automation content, and slide 7 repositions only the inherited monitoring text slots. Record both source files and SHA-256 values in `source-notes.txt`.

- [x] **Step 3: Validate the map**

Run:

```bash
node /Users/yuhongsig/.codex/plugins/cache/openai-primary-runtime/presentations/26.709.11516/skills/presentations/template_following_scripts/validate_template_plan.mjs \
  --workspace /var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-backup-theme/tmp \
  --map /var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-backup-theme/tmp/template-frame-map.json
```

Expected: validation status `pass`, eight output slides, source slide 9 listed as omitted.

- [x] **Step 4: Prepare the starter deck**

Run:

```bash
node /Users/yuhongsig/.codex/plugins/cache/openai-primary-runtime/presentations/26.709.11516/skills/presentations/template_following_scripts/prepare_template_starter_deck.mjs \
  --workspace /var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-backup-theme/tmp \
  --pptx /Users/yuhongsig/project/bx-cf/bx-cf-fe/landing/assets/BX-CF.backup-20260714-162605.pptx \
  --map /var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-backup-theme/tmp/template-frame-map.json \
  --out /var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-backup-theme/tmp/template-starter.pptx \
  --preview-dir /var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-backup-theme/tmp/template-starter-preview \
  --layout-dir /var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-backup-theme/tmp/template-starter-layout \
  --contact-sheet /var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-backup-theme/tmp/template-starter-contact-sheet.png
```

Expected: eight-slide starter PPTX with the original template styling intact.

### Task 2: Rewrite inherited content in place

**Files:**
- Create: `/var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-backup-theme/tmp/build-backup-theme.mjs`
- Create: `landing/assets/BX-CF_BackupTheme.pptx`

**Interfaces:**
- Consumes: `template-starter.pptx`, starter layout JSON files, and current-deck inspection layouts.
- Produces: `setTextByOrder(slide, layout, order, text)` and `moveTextByOrder(slide, layout, order, position)` helpers plus the final PPTX.

- [x] **Step 1: Add inherited-object helpers**

Implement helpers that resolve an existing shape by the starter layout `order`, replace only its text, preserve the inherited text style, and optionally reposition only explicitly mapped text objects. The builder must import the starter with `PresentationFile.importPptx()` and export with `PresentationFile.exportPptx()`.

- [x] **Step 2: Implement the slide text maps**

Use these exact semantic mappings:

```js
const slideMaps = [
  { // output 1 from backup 1
    4: "CHANNEL UNIT",
    5: "채널 파운데이션",
    6: "Channel Foundation",
    7: "채널 프로젝트 공통 기반(Backend · Frontend) 구축",
    9: "기간   3개월 · 1단계",
    11: "인원   2명",
    13: "산출물   스타터 키트 + 개발 가이드",
    14: "2026.06   ·   채널유닛",
  },
  { // output 2 from backup 3
    2: "DEFINITION · 무엇인가",
    3: "채널 파운데이션이란?",
    4: "채널 파운데이션  ·  Channel Foundation   ·   02",
    8: "채널 프로젝트 반복 영역 표준화",
    9: "프론트엔드·관리자 UI · 인증/권한\n게이트웨이 · MCI 연동 기반",
    10: "완제품 솔루션이 아닌 빠른 프로젝트 착수를 위한 기반 자산\n→ core · mci · full 모듈 단위 제공으로 단계적 확장",
    14: "공통 구조 표준화",
    15: "FE/BE 기본 구조·개발 규칙 표준화\n→ 초기 구축 부담 축소",
    19: "고객사별 확장 대응",
    20: "adapter · mapper · config로 차이 격리\n→ 고객사별 연동 유연성 확보",
    24: "모듈형 확장 기반",
    25: "구축 베이스 우선 활용\n→ core · mci · full 제품화 확장",
  },
  { // output 3 from backup 2
    2: "WHY NOW · 추진 배경",
    3: "왜 지금 필요한가",
    4: "채널 파운데이션  ·  Channel Foundation   ·   03",
    8: "01",
    9: "공통 기반 부재",
    10: "기제품 적용 제약 → 채널 프로젝트 공통 기반 선제 확보\n\n프로젝트별 BE·FE 기초 재구축\n→ 초기 작업 반복·시간 소모",
    14: "02",
    15: "고객사별 차이",
    16: "업무·인증·MCI·계정계/정보계/대외계 차이\n→ 공통 영역 표준화 + 확장 구조 분리",
    20: "03",
    21: "추진 적기",
    22: "차기 투입 전 가용 인력 활용\n→ 반복 활용 가능한 공통 자산 확보",
  },
];
```

Append these maps for output slides 4 through 8:

```js
slideMaps.push(
  { // output 4 from backup 4
    2: "ARCHITECTURE · 구성",
    3: "Channel Foundation 구성도",
    4: "채널 파운데이션  ·  Channel Foundation   ·   04",
    7: "FRONTEND",
    8: "React 19",
    9: "모노레포",
    11: "Turbo + pnpm",
    13: "PC · Mobile",
    15: "Admin",
    17: "공통  @bx/shared · 도메인 8종",
    19: "도메인  auth · user · account · menu · product · alarm · base-info · common-code",
    21: "라우팅·데이터  TanStack Router · Query · Zustand · Axios",
    23: "인증·UI  JWT 401 자동재발급 · Radix · CSS Modules",
    25: "빌드",
    27: "Vite 8 · Biome · Vitest",
    29: "E2E 테스트 자동화",
    30: "Playwright · PC · Mobile · Admin 주요 시나리오 검증  →  CI 파이프라인 연동 · Vitest 단위 테스트 병행",
    32: "API 연계",
    34: "HTTPS · Envelope · JWT",
    35: "OpenAPI · TypeBridge",
    37: "타입",
    38: "FE·BE 타입 자동 일치",
    40: "자동화",
    42: "gen:api · CI drift gate",
    45: "BACKEND",
    46: "Java 21 · Boot 3",
    47: "MSA",
    49: "Spring Cloud · Gateway",
    51: "Eureka",
    52: "Services 5",
    54: "auth · mci · system",
    56: "product · integration",
    58: "libs 5",
    60: "common · business-common · mci-common",
    62: "security-common · session-context-common",
    64: "인증·세션  Gateway JWT 검증 · X-Auth-* · Redis 세션",
    65: "MCI  YAML registry · Adapter/Mapper SPI · Router",
  },
  { // output 5 from backup 5
    2: "PLAN · 개발 계획",
    3: "2명 · 3개월 — 1단계 마일스톤",
    4: "공통 뼈대 집중: 인프라 · 통신 · 인증 · 모듈 구조  /  고객별 비즈니스 로직 제외",
    7: "1",
    9: "1개월차",
    10: "기반 구축",
    11: "모노레포 구조화 · @bx/shared 세팅\n번들러·빌드·배포 검증",
    13: "산출물  아키텍처 설계서 · 공통 뼈대 소스코드",
    15: "2",
    17: "2개월차",
    18: "핵심 모듈",
    19: "auth · system · gateway 안정화\nMCI 거래 정의 · mapper/adapter routing 구현",
    21: "산출물  공통 인증/권한 · MCI 기본 흐름 · 샘플 거래",
    23: "3",
    25: "3개월차",
    26: "검증 & 가이드",
    27: "Admin UI ↔ Backend API 연계 검증\nE2E 자동화 · 개발 가이드 · 샘플 정리",
    29: "산출물  개발 가이드 · 샘플 업무 · 테스트 자동화 기반",
    30: "05",
  },
  { // output 6 from backup 6
    2: "DELIVERABLES · 산출물",
    3: "1단계 주요 산출물",
    4: "채널 파운데이션  ·  Channel Foundation   ·   06",
    5: "고객별 비즈니스 로직 제외  →  파생 프로젝트 공통 기반 우선 확보",
    9: "Frontend 개발 가이드",
    10: "PC · Mobile · Admin 스켈레톤 + 개발 가이드",
    14: "Backend 개발 가이드",
    15: "공통 모듈 · 표준 레이아웃 + 개발 가이드",
    19: "인증 / 권한 기본 체계",
    20: "JWT 자동 재발급 · Gateway 내부 인증 · Redis 세션",
    24: "MCI 연동 표준",
    25: "YAML 거래 registry · Adapter/Mapper · 샘플 거래",
    29: "API 연계 · 타입 자동화",
    30: "OpenAPI TypeBridge · Envelope 처리",
    34: "프로젝트 관리 · WBS",
    35: "GitHub Project 기반 WBS · 일정 관리",
  },
  { // output 7 from backup 7
    2: "IMPACT · 기대효과 & 로드맵",
    3: "기대효과와 향후 확장",
    4: "채널 파운데이션  ·  Channel Foundation   ·   07",
    5: "기대효과",
    8: "채널 프로젝트 초기 구축 기간 단축",
    11: "개발 표준화 및 품질 향상",
    14: "반복 개발 비용 절감",
    17: "MCI · 외부 연동 구조 재사용",
    20: "고객사별 커스터마이징 범위 명확화\nMVP 기반 Pre-sales 데모 · 즉시 커스터마이징",
    22: "향후 확장 — 모듈 단위 제품화",
    23: "core",
    24: "auth + system + gateway",
    30: "↓",
    33: "mci",
    34: "core + mci",
    36: "↓",
    37: "full",
    39: "core + mci + integration + 샘플 업무",
    40: "↓",
    47: "채널 서비스 모니터링 도구",
    48: "PC · Mobile · Admin 실시간 상태 감시  |  가동률 · 응답속도 · 점검 상태",
  },
  { // output 8 from backup 8
    2: "AI · 개발 방식",
    3: "AI 활용 개발 — 실증과 SI 시장 대비",
    4: "채널 파운데이션  ·  Channel Foundation   ·   08",
    6: "AI · 개발 방식",
    7: "AI 활용 개발",
    8: "실증과 SI 시장 대비",
    10: "AI 유료 요금제 도입 확정  →  실제 활용 실증 + 조직 개발 역량 내재화",
    14: "AI AGENT",
    15: "AI Agent 활용 가치\n전체 소스 의존성 유지 분석\n아키텍처 정합성 기반 코드 생성\n정확한 오류 진단 · 연속 작업",
    19: "PROOF",
    20: "실증 — 적용 중\nGitHub Webhook → Notion 자동화\nWBS ↔ GitHub Projects 동기화\nOpenAPI → FE 타입 자동생성 CI 게이트",
    24: "MARKET",
    25: "SI 시장 변화 대비\nSI 개발 방식 변화 선제 대응\n조직 경험 축적\n적용 역량 내재화",
  },
);
```

Reuse backup slide 4 orders 29 and 30 as the E2E label and detail. Reposition order 29 to `{ left: 91.2, top: 632, width: 190, height: 28 }` and order 30 to `{ left: 294, top: 630, width: 894, height: 32 }`. Reposition output slide 7 orders 47 and 48 to `{ left: 715.2, top: 536, width: 458.88, height: 30 }` and `{ left: 715.2, top: 568, width: 458.88, height: 44 }`. Keep the inherited font family, size, color, and weight. Delete no non-text template objects.

- [x] **Step 3: Export slide previews, layouts, and PPTX**

Export each slide to `tmp/final-preview/slide-01.png` through `slide-08.png`, export layouts to `tmp/final-layout`, and save the final deck to `landing/assets/BX-CF_BackupTheme.pptx`.

- [x] **Step 4: Run the builder**

Run:

```bash
node /var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-backup-theme/tmp/build-backup-theme.mjs
```

Expected: exit code 0 and an eight-slide final PPTX.

### Task 3: Verify content, layout, and template fidelity

**Files:**
- Create: `/var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-backup-theme/tmp/verify-backup-theme.mjs`
- Test: `landing/assets/BX-CF_BackupTheme.pptx`

**Interfaces:**
- Consumes: final PPTX, current content layouts, frame map, starter layouts.
- Produces: `tmp/qa/verification.json`, office-rendered slide PNGs, and template fidelity reports.

- [x] **Step 1: Implement final-PPTX verification**

Re-import the final PPTX and assert:

```js
assert.equal(presentation.slides.items.length, 8);
assert.ok(allText.includes("E2E 테스트 자동화"));
assert.ok(allText.includes("Playwright"));
assert.ok(allText.includes("AI 활용 개발 — 실증과 SI 시장 대비"));
assert.ok(!allText.includes("감사합니다."));
assert.ok(!allText.includes("단순한 프레임워크 하나를 넘어"));
```

Also verify the current-deck titles and all unique content phrases represented in the migration maps are present in the actual exported PPTX.

- [x] **Step 2: Run overflow and Office-compatible rendering checks**

Run:

```bash
/Users/yuhongsig/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 \
  /Users/yuhongsig/.codex/plugins/cache/openai-primary-runtime/presentations/26.709.11516/skills/presentations/container_tools/slides_test.py \
  /Users/yuhongsig/project/bx-cf/bx-cf-fe/landing/assets/BX-CF_BackupTheme.pptx
```

Expected: `Test passed. No overflow detected.`

Render the final PPTX to `tmp/qa/office-render` with `render_slides.py` and visually inspect every slide at full size.

- [x] **Step 3: Run template fidelity verification**

Run `check_template_fidelity.mjs` with the frame map, starter PPTX, starter layouts, final PPTX, and final layouts.

Expected: status `pass`, issue count `0`.

- [x] **Step 4: Perform the final polish loop**

Fix every unintended wrap, overlap, clipping, illegible body line, empty inherited placeholder, or inconsistent page marker found in slides 1 through 8. Re-run the content verifier, overflow test, Office rendering, and template fidelity check after the last change.
