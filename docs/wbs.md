# 📋 프로젝트 WBS

※ 이 파일은 Git과 GitHub Projects 연동에 최적화된 마크다운 기반 WBS 문서입니다.
※ 신규 프로젝트(엔터프라이즈 프론트엔드) 구축을 기준으로 작성되었습니다.
※ 섹션 번호(01~)는 고정 WBS 코드입니다. 항목을 추가해도 기존 번호는 변경하지 않습니다.

## 🔴 Must Have

### 01. 프로젝트 기반 구축
- [ ] 모노레포 구조 설정 (turborepo + pnpm workspace)
  * apps/* (pc-web, mobile-web, admin-portal) 및 packages/* 분리
  * 워크스페이스 의존성 링크 (workspace:*)
- [ ] 번들러 설정 (Vite, 앱별 포트 분리)
- [ ] TypeScript 설정 (tsconfig, 경로 alias)
  * 공통 tsconfig + 앱별 extends
  * @/* (앱 내부) · @bx/shared (공유 패키지) alias 통일
- [ ] 환경변수 체계 정립
  * .env / .env.local / .env.production 분리
  * VITE_API_URL 등 앱별 환경변수 정의 (하드코딩 제거)
  * vite-env.d.ts 타입 선언
- [ ] 런타임/패키지매니저 버전 고정
  * package.json packageManager + corepack
  * engines(node, pnpm) 명시, .nvmrc 또는 fnm/volta 핀
- [ ] 코드 품질 도구 설정
  * Biome (lint + format)
  * Husky pre-commit 훅
- [ ] 공통 패키지 (@bx/shared) 구조 확정
  * entities / shared(ui·hooks·model·lib·types·constants·ajax) 레이어
  * 배럴(index.ts) export 규칙, 패키지 내부 상대경로 임포트(순환참조 방지)
### 02. 라우팅 시스템
- [ ] TanStack Router 기본 설정 (앱별)
  * 라우트 그룹 전략: (auth) 로그인 / (page) 보호 라우트 / (modal) 모달
- [ ] 라우트 트리 자동생성 (router-plugin, routeTree.gen 수정 금지)
- [ ] 인증 가드 구현 (requireAuth)
- [ ] 404 / 리다이렉션 처리
- [ ] 라우트 파라미터 필수값 체크
- [ ] modal 에서 일반 페이지 라우팅 시 modal 닫히면서 기존 페이지 보여지는 현상 제어
- [ ] 앱 라우팅 시 이동된 페이지 스크롤 top 이동
### 03. 인증
- [ ] 로그인 폼 UI (id / password / submit 버튼)
- [ ] 로그인 API 연동
  * 비밀번호 해싱(sha256) 후 전송 정책
- [ ] 토큰 저장 전략 결정 (localStorage / cookie / sessionStorage)
- [ ] 로그인 실패 에러 처리
- [ ] Access token 만료 → silent refresh 처리
  * 동시 요청 single-flight 처리 (refresh 1회만 호출)
- [ ] Refresh token rotation 전략
- [ ] 로그아웃 처리
- [ ] 로그인 상태에 따른 라우팅 제어 (PrivateRoute)
- [ ] 다중 탭 세션 동기화 (storage 이벤트)
### 04. API 연동 기반
- [ ] Axios 인스턴스 설정 (baseURL, timeout, headers)
  * httpService.init() 단일 진입점 패턴
- [ ] 공통 응답 규격(envelope) 정의
  * { success, code, msg, payload } — payload 자동 언래핑
- [ ] 에러코드 체계 표준화 (API_ERROR_CODE)
  * 코드별 처리 매핑: -1004 토큰만료→refresh / -1002·-1003 인증실패→logout / -1005 권한→차단
- [ ] Axios interceptor
  * 요청: 토큰 자동 주입
  * 응답: HTTP 상태코드별 공통 처리
  - 401 → 토큰 갱신
  - 403 → 권한 페이지
  - 500 → 공통 에러 페이지
- [ ] React Query 글로벌 설정 (QueryClient, staleTime, retry)
- [ ] React Query 글로벌 에러 핸들러 연동
- [ ] API 레이어 설계
  * Request / Response DTO 타입 정의 (서버 계약 기준 단일 소스)
  * 페이지네이션 패턴 결정 (offset vs cursor)
  * 파일 업로드 / 다운로드 처리
### 05. Mock API
- [ ] Mock 서버 구축 (실서버 계약 흉내)
  * 공통 envelope 응답 + JWT 인증 엔드포인트(/auth/login, /auth/refresh-token)
  * db.json 기반 컬렉션 서빙 (필터/단건 조회), Node 내장 모듈만 사용(무의존성)
- [ ] 백엔드 전환 전략 (.env VITE_API_URL 값만 변경 → mock ↔ 실서버)
  * mock/실서버 단일 코드패스 유지 (분기 제거)
- [ ] E2E 실행 시 mock 서버 자동 시작 처리 (playwright webServer 배열 추가)
### 06. 공통 레이아웃 및 UI 기반
- [ ] 메인 레이아웃 설계 (헤더, 사이드바, 콘텐츠 영역)
- [ ] 사용자 정보 표시 (프로필, 알림 등)
- [ ] 로딩 처리 (spinner / skeleton)
- [ ] 에러 바운더리 (ErrorBoundary) 기본 구현
- [ ] 공통 컴포넌트 (Button, Modal, Card, Input 등)
- [ ] 포털(Portal) 기반 컴포넌트 (모달, 툴팁, Toast)
  * 모달 스택 관리 + z-index 정책
- [ ] 디자인 토큰 / 테마 CSS 변수 체계
### 07. 핵심 업무 화면
- [ ] 메인 화면
- [ ] 상품 화면
- [ ] 자산 화면
  * 계좌 카드 컴포넌트
  * 계좌 리스트 화면
  * 계좌 거래내역 화면
- [ ] 이체 플로우
  * 이체 계좌 선택 화면
  * 이체 금액 입력 화면
  * 이체 확인 화면
  * 이체 완료 화면
- [ ] 메뉴 화면
  * 사용자 페이지
  * 설정 페이지
- [ ] 관리자 화면
  * 메뉴 관리
  * 사용자 관리
### 08. 상태 관리
- [ ] Zustand — 클라이언트 전역 상태 (인증, 사용자 정보)
- [ ] React Query — 서버 상태 (API 캐싱, 동기화)
- [ ] 스토리지 추상화 (localStorage / sessionStorage 유틸)
- [ ] 저장 키 상수화 (STORAGE_KEYS)
### 21. 개발 표준 & 협업 규칙
- [ ] 에디터/OS 일관성 설정
  * .editorconfig (인덴트·개행)
  * .gitattributes (LF 강제 — CRLF 경고 방지)
  * .vscode (settings.json, extensions.json 권장 확장 공유)
- [ ] 커밋 품질 자동화
  * lint-staged (변경 파일만 검사)
  * commitlint (커밋 메시지 컨벤션 강제)
- [ ] 네이밍 컨벤션 정의
  * 컴포넌트/파일/폴더 네이밍 규칙 (panel·sidebar 등 용어 통일)
  * FSD 레이어별 디렉토리 규칙
- [ ] Git 협업 규칙
  * 브랜치 전략 (main / develop / feature)
  * PR / 이슈 템플릿, CODEOWNERS
  * 커밋 타입 컨벤션 (feat/fix/docs/style/refactor/build/chore)
### 22. 인가 / 권한 제어 (RBAC)
- [ ] 사용자 권한(roles) 모델 정의 (ROLE_USER / ROLE_ADMIN 등)
- [ ] 라우트 레벨 권한 가드 (roles 기반 접근 제어)
- [ ] 메뉴/네비게이션 권한별 노출 제어
- [ ] 버튼/기능 레벨 권한 제어 (권한 없는 액션 비활성/숨김)
- [ ] 권한 부족(-1005 ACCESS_DENIED) 처리 정책 (안내/리다이렉트)
## 🟡 Should Have

### 09. 테스트
- [ ] 단위 테스트 전략 수립 (Vitest + @testing-library/react)
- [ ] E2E 테스트 시나리오 작성 (Playwright)
  * 앱별 로그인 플로우
  * 핵심 업무 화면 주요 경로
- [ ] 테스트 커버리지 기준 설정
- [ ] MSW(Mock Service Worker) 도입 검토
  * 브라우저 + Node 동일 mock 재사용
  * 단위 테스트 / E2E 테스트 통합 활용
### 10. CI/CD
- [ ] GitHub Actions 워크플로 구성
  * PR: lint + type-check + 단위 테스트 자동 실행
  * PR: E2E 테스트 자동 실행 (mock 서버 포함)
  * main merge: 빌드 검증
- [ ] 환경별 배포 분기 (dev / staging / prod)
- [ ] 앱별 빌드 결과물 배포 (pc-web / mobile-web / admin-portal)
### 11. 폼 처리
- [ ] React Hook Form 기본 설정
- [ ] 유효성 검사 전략 (Zod 등 schema validation 연동)
- [ ] 공통 에러 메시지 표시 컴포넌트
### 12. UX 기본 처리
- [ ] 최초 로딩 시 폰트 깜빡임(FOUT) 개선
- [ ] 가맹점몰 로그인 처리
### 13. 보안 기본
- [ ] 민감 정보 .env.local 분리 및 .gitignore 확인
- [ ] XSS 방어 (dangerouslySetInnerHTML 사용 금지 규칙)
- [ ] CORS 정책 확인
- [ ] 로깅 시 민감정보(토큰·비밀번호) 마스킹
### 23. 전역 에러 / 예외 처리
- [ ] ErrorBoundary 전역 적용 (렌더 에러 fallback)
- [ ] 네트워크 에러 공통 처리 (timeout / 오프라인 / 5xx)
- [ ] 권한 에러(403 / -1005) 공통 안내 화면
- [ ] 미처리 Promise rejection 전역 캐치
## 🟢 Could Have

### 14. 성능 최적화
- [ ] Lazy Loading (페이지 단위 코드 스플리팅)
- [ ] Eager Loading (주요 경로 사전 로딩)
- [ ] React 19 Compiler 적용 검토
- [ ] 번들 사이즈 분석 (vite-bundle-analyzer)
### 15. 접근성 (a11y)
- [ ] 시맨틱 마크업 기준 정의
- [ ] 키보드 네비게이션 지원
- [ ] 스크린리더 대응 (aria 속성)
### 16. UI 고도화
- [ ] 다크모드 / 테마 전환 기능
- [ ] 글자 크기 조절 기능 (큰글씨 / 작은글씨)
- [ ] 반응형 디자인 (모바일 / 태블릿 대응)
- [ ] 대표 계좌 설정 화면
### 17. 개발 경험 개선
- [ ] 컴포넌트 문서화 (Storybook)
- [ ] OpenAPI / Swagger 기반 타입 자동 생성 (openapi-typescript)
- [ ] 프로젝트 컨벤션 README.md 작성
- [ ] 기술 스택 문서화 (도입 이유, 버전, 확장성)
- [ ] Dashboard Builder
### 18. 모니터링
- [ ] 에러 추적 (Sentry)
- [ ] 사용자 분석 (GA)
- [ ] Web Vitals 측정
### 19. 다국어 지원
- [ ] i18n 구조 설계 (i18next)
- [ ] 언어 전환 기능
### 24. 빌드 / 릴리즈 관리
- [ ] 버전닝 및 CHANGELOG 관리 (changesets 등)
- [ ] 릴리즈 태깅 / 배포 노트 자동화
### 25. 의존성 관리 자동화
- [ ] renovate / dependabot 정기 업데이트
- [ ] 의존성 보안 취약점 점검 (audit)
## ⚪ Won't Have (범위 제외)

### 20. 현재 범위 제외 항목
- [ ] SSR / SSG (CSR 구조로 확정)
- [ ] 소셜 로그인 (Google, Kakao, Naver 등) — 내부 인증 우선
- [ ] PWA / 오프라인 지원
- [ ] 관리자 SEO 메타 정보 관리 (CSR 특성상 효과 제한적)
