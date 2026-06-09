# 📊 WBS & GitHub Projects 비교 리포트

* **작성 일시**: 2026. 6. 9. PM 1:46:18
* **로컬 WBS 파일 경로**: [wbs](file:///d:/project/bwg/bx-cf-fe/wbs)
* **GitHub Project URL**: https://github.com/users/devhongs/projects/1

---

## 🔍 1. 현황 분석

* **로컬 WBS 정의**: 총 20개 대주제 아래 다수의 세부 태스크 존재
* **GitHub Project 내 연동된 총 카드 수**: `103`개
  - **대주제 이슈 (Parent)**: `20`개
  - **세부 이슈 (Child)**: `83`개

---

## 📝 2. 계층별 매핑 세부 현황

### 📂 1. 프로젝트 기반 구축
* **로컬 우선순위**: `Must Have` | **GitHub Project 우선순위**: `Must Have` | **상태**: `Todo`
* **하위 작업 매핑률**: `6 / 6`개 연동

| 상태 | 로컬 WBS 정의 태스크 | GitHub Project 등록 여부 |
| :---: | :--- | :---: |
| ✅ | 모노레포 구조 설정 (turborepo + pnpm workspace) | 등록됨 |
| ✅ | 번들러 설정 (Vite, 앱별 포트 분리) | 등록됨 |
| ✅ | TypeScript 설정 (tsconfig, 경로 alias) | 등록됨 |
| ✅ | 환경변수 체계 정립 | 등록됨 |
| ✅ | 코드 품질 도구 설정 | 등록됨 |
| ✅ | 공통 패키지 (@bx/shared) 구조 확정 | 등록됨 |

### 📂 2. 라우팅 시스템
* **로컬 우선순위**: `Must Have` | **GitHub Project 우선순위**: `Must Have` | **상태**: `Todo`
* **하위 작업 매핑률**: `6 / 6`개 연동

| 상태 | 로컬 WBS 정의 태스크 | GitHub Project 등록 여부 |
| :---: | :--- | :---: |
| ✅ | TanStack Router 기본 설정 (앱별) | 등록됨 |
| ✅ | 인증 가드 구현 (requireAuth) | 등록됨 |
| ✅ | 404 / 리다이렉션 처리 | 등록됨 |
| ✅ | 라우트 파라미터 필수값 체크 | 등록됨 |
| ✅ | modal 에서 일반 페이지 라우팅 시 modal 닫히면서 기존 페이지 보여지는 현상 제어 | 등록됨 |
| ✅ | 앱 라우팅 시 이동된 페이지 스크롤 top 이동 | 등록됨 |

### 📂 3. 인증
* **로컬 우선순위**: `Must Have` | **GitHub Project 우선순위**: `Must Have` | **상태**: `Todo`
* **하위 작업 매핑률**: `8 / 8`개 연동

| 상태 | 로컬 WBS 정의 태스크 | GitHub Project 등록 여부 |
| :---: | :--- | :---: |
| ✅ | 로그인 폼 UI (id / password / submit 버튼) | 등록됨 |
| ✅ | 로그인 API 연동 | 등록됨 |
| ✅ | 토큰 저장 전략 결정 (localStorage / cookie / sessionStorage) | 등록됨 |
| ✅ | 로그인 실패 에러 처리 | 등록됨 |
| ✅ | Access token 만료 → silent refresh 처리 | 등록됨 |
| ✅ | Refresh token rotation 전략 | 등록됨 |
| ✅ | 로그아웃 처리 | 등록됨 |
| ✅ | 로그인 상태에 따른 라우팅 제어 (PrivateRoute) | 등록됨 |

### 📂 4. API 연동 기반
* **로컬 우선순위**: `Must Have` | **GitHub Project 우선순위**: `Must Have` | **상태**: `Todo`
* **하위 작업 매핑률**: `5 / 5`개 연동

| 상태 | 로컬 WBS 정의 태스크 | GitHub Project 등록 여부 |
| :---: | :--- | :---: |
| ✅ | Axios 인스턴스 설정 (baseURL, timeout, headers) | 등록됨 |
| ✅ | Axios interceptor | 등록됨 |
| ✅ | React Query 글로벌 설정 (QueryClient, staleTime, retry) | 등록됨 |
| ✅ | React Query 글로벌 에러 핸들러 연동 | 등록됨 |
| ✅ | API 레이어 설계 | 등록됨 |

### 📂 5. Mock API
* **로컬 우선순위**: `Must Have` | **GitHub Project 우선순위**: `Must Have` | **상태**: `Todo`
* **하위 작업 매핑률**: `2 / 2`개 연동

| 상태 | 로컬 WBS 정의 태스크 | GitHub Project 등록 여부 |
| :---: | :--- | :---: |
| ✅ | json-server 설정 (db.json, port 3333) | 등록됨 |
| ✅ | E2E 실행 시 json-server 자동 시작 처리 (playwright webServer 배열 추가) | 등록됨 |

### 📂 6. 공통 레이아웃 및 UI 기반
* **로컬 우선순위**: `Must Have` | **GitHub Project 우선순위**: `Must Have` | **상태**: `Todo`
* **하위 작업 매핑률**: `6 / 6`개 연동

| 상태 | 로컬 WBS 정의 태스크 | GitHub Project 등록 여부 |
| :---: | :--- | :---: |
| ✅ | 메인 레이아웃 설계 (헤더, 사이드바, 콘텐츠 영역) | 등록됨 |
| ✅ | 사용자 정보 표시 (프로필, 알림 등) | 등록됨 |
| ✅ | 로딩 처리 (spinner / skeleton) | 등록됨 |
| ✅ | 에러 바운더리 (ErrorBoundary) 기본 구현 | 등록됨 |
| ✅ | 공통 컴포넌트 (Button, Modal, Card, Input 등) | 등록됨 |
| ✅ | 포털(Portal) 기반 컴포넌트 (모달, 툴팁, Toast) | 등록됨 |

### 📂 7. 핵심 업무 화면
* **로컬 우선순위**: `Must Have` | **GitHub Project 우선순위**: `Must Have` | **상태**: `Todo`
* **하위 작업 매핑률**: `6 / 6`개 연동

| 상태 | 로컬 WBS 정의 태스크 | GitHub Project 등록 여부 |
| :---: | :--- | :---: |
| ✅ | 메인 화면 | 등록됨 |
| ✅ | 상품 화면 | 등록됨 |
| ✅ | 자산 화면 | 등록됨 |
| ✅ | 이체 플로우 | 등록됨 |
| ✅ | 메뉴 화면 | 등록됨 |
| ✅ | 관리자 화면 | 등록됨 |

### 📂 8. 상태 관리
* **로컬 우선순위**: `Must Have` | **GitHub Project 우선순위**: `Must Have` | **상태**: `Todo`
* **하위 작업 매핑률**: `4 / 4`개 연동

| 상태 | 로컬 WBS 정의 태스크 | GitHub Project 등록 여부 |
| :---: | :--- | :---: |
| ✅ | Zustand — 클라이언트 전역 상태 (인증, 사용자 정보) | 등록됨 |
| ✅ | React Query — 서버 상태 (API 캐싱, 동기화) | 등록됨 |
| ✅ | 스토리지 추상화 (localStorage / sessionStorage 유틸) | 등록됨 |
| ✅ | 저장 키 상수화 (STORAGE_KEYS) | 등록됨 |

### 📂 9. 테스트
* **로컬 우선순위**: `Should Have` | **GitHub Project 우선순위**: `Should Have` | **상태**: `Todo`
* **하위 작업 매핑률**: `4 / 4`개 연동

| 상태 | 로컬 WBS 정의 태스크 | GitHub Project 등록 여부 |
| :---: | :--- | :---: |
| ✅ | 단위 테스트 전략 수립 (Vitest + @testing-library/react) | 등록됨 |
| ✅ | E2E 테스트 시나리오 작성 (Playwright) | 등록됨 |
| ✅ | 테스트 커버리지 기준 설정 | 등록됨 |
| ✅ | MSW(Mock Service Worker) 도입 검토 | 등록됨 |

### 📂 10. CI/CD
* **로컬 우선순위**: `Should Have` | **GitHub Project 우선순위**: `Should Have` | **상태**: `Todo`
* **하위 작업 매핑률**: `3 / 3`개 연동

| 상태 | 로컬 WBS 정의 태스크 | GitHub Project 등록 여부 |
| :---: | :--- | :---: |
| ✅ | GitHub Actions 워크플로 구성 | 등록됨 |
| ✅ | 환경별 배포 분기 (dev / staging / prod) | 등록됨 |
| ✅ | 앱별 빌드 결과물 배포 (pc-web / mobile-web / admin-portal) | 등록됨 |

### 📂 11. 폼 처리
* **로컬 우선순위**: `Should Have` | **GitHub Project 우선순위**: `Should Have` | **상태**: `Todo`
* **하위 작업 매핑률**: `3 / 3`개 연동

| 상태 | 로컬 WBS 정의 태스크 | GitHub Project 등록 여부 |
| :---: | :--- | :---: |
| ✅ | React Hook Form 기본 설정 | 등록됨 |
| ✅ | 유효성 검사 전략 (Zod 등 schema validation 연동) | 등록됨 |
| ✅ | 공통 에러 메시지 표시 컴포넌트 | 등록됨 |

### 📂 12. UX 기본 처리
* **로컬 우선순위**: `Should Have` | **GitHub Project 우선순위**: `Should Have` | **상태**: `Todo`
* **하위 작업 매핑률**: `2 / 2`개 연동

| 상태 | 로컬 WBS 정의 태스크 | GitHub Project 등록 여부 |
| :---: | :--- | :---: |
| ✅ | 최초 로딩 시 폰트 깜빡임(FOUT) 개선 | 등록됨 |
| ✅ | 가맹점몰 로그인 처리 | 등록됨 |

### 📂 13. 보안 기본
* **로컬 우선순위**: `Should Have` | **GitHub Project 우선순위**: `Should Have` | **상태**: `Todo`
* **하위 작업 매핑률**: `3 / 3`개 연동

| 상태 | 로컬 WBS 정의 태스크 | GitHub Project 등록 여부 |
| :---: | :--- | :---: |
| ✅ | 민감 정보 .env.local 분리 및 .gitignore 확인 | 등록됨 |
| ✅ | XSS 방어 (dangerouslySetInnerHTML 사용 금지 규칙) | 등록됨 |
| ✅ | CORS 정책 확인 | 등록됨 |

### 📂 14. 성능 최적화
* **로컬 우선순위**: `Could Have` | **GitHub Project 우선순위**: `Could Have` | **상태**: `Todo`
* **하위 작업 매핑률**: `4 / 4`개 연동

| 상태 | 로컬 WBS 정의 태스크 | GitHub Project 등록 여부 |
| :---: | :--- | :---: |
| ✅ | Lazy Loading (페이지 단위 코드 스플리팅) | 등록됨 |
| ✅ | Eager Loading (주요 경로 사전 로딩) | 등록됨 |
| ✅ | React 19 Compiler 적용 검토 | 등록됨 |
| ✅ | 번들 사이즈 분석 (vite-bundle-analyzer) | 등록됨 |

### 📂 15. 접근성 (a11y)
* **로컬 우선순위**: `Could Have` | **GitHub Project 우선순위**: `Could Have` | **상태**: `Todo`
* **하위 작업 매핑률**: `3 / 3`개 연동

| 상태 | 로컬 WBS 정의 태스크 | GitHub Project 등록 여부 |
| :---: | :--- | :---: |
| ✅ | 시맨틱 마크업 기준 정의 | 등록됨 |
| ✅ | 키보드 네비게이션 지원 | 등록됨 |
| ✅ | 스크린리더 대응 (aria 속성) | 등록됨 |

### 📂 16. UI 고도화
* **로컬 우선순위**: `Could Have` | **GitHub Project 우선순위**: `Could Have` | **상태**: `Todo`
* **하위 작업 매핑률**: `4 / 4`개 연동

| 상태 | 로컬 WBS 정의 태스크 | GitHub Project 등록 여부 |
| :---: | :--- | :---: |
| ✅ | 다크모드 / 테마 전환 기능 | 등록됨 |
| ✅ | 글자 크기 조절 기능 (큰글씨 / 작은글씨) | 등록됨 |
| ✅ | 반응형 디자인 (모바일 / 태블릿 대응) | 등록됨 |
| ✅ | 대표 계좌 설정 화면 | 등록됨 |

### 📂 17. 개발 경험 개선
* **로컬 우선순위**: `Could Have` | **GitHub Project 우선순위**: `Could Have` | **상태**: `Todo`
* **하위 작업 매핑률**: `5 / 5`개 연동

| 상태 | 로컬 WBS 정의 태스크 | GitHub Project 등록 여부 |
| :---: | :--- | :---: |
| ✅ | 컴포넌트 문서화 (Storybook) | 등록됨 |
| ✅ | OpenAPI / Swagger 기반 타입 자동 생성 (openapi-typescript) | 등록됨 |
| ✅ | 프로젝트 컨벤션 README.md 작성 | 등록됨 |
| ✅ | 기술 스택 문서화 (도입 이유, 버전, 확장성) | 등록됨 |
| ✅ | Dashboard Builder | 등록됨 |

### 📂 18. 모니터링
* **로컬 우선순위**: `Could Have` | **GitHub Project 우선순위**: `Could Have` | **상태**: `Todo`
* **하위 작업 매핑률**: `3 / 3`개 연동

| 상태 | 로컬 WBS 정의 태스크 | GitHub Project 등록 여부 |
| :---: | :--- | :---: |
| ✅ | 에러 추적 (Sentry) | 등록됨 |
| ✅ | 사용자 분석 (GA) | 등록됨 |
| ✅ | Web Vitals 측정 | 등록됨 |

### 📂 19. 다국어 지원
* **로컬 우선순위**: `Could Have` | **GitHub Project 우선순위**: `Could Have` | **상태**: `Todo`
* **하위 작업 매핑률**: `2 / 2`개 연동

| 상태 | 로컬 WBS 정의 태스크 | GitHub Project 등록 여부 |
| :---: | :--- | :---: |
| ✅ | i18n 구조 설계 (i18next) | 등록됨 |
| ✅ | 언어 전환 기능 | 등록됨 |

### 📂 20. 현재 범위 제외 항목
* **로컬 우선순위**: `Won't Have` | **GitHub Project 우선순위**: `Won't Have` | **상태**: `Todo`
* **하위 작업 매핑률**: `4 / 4`개 연동

| 상태 | 로컬 WBS 정의 태스크 | GitHub Project 등록 여부 |
| :---: | :--- | :---: |
| ✅ | SSR / SSG (CSR 구조로 확정) | 등록됨 |
| ✅ | 소셜 로그인 (Google, Kakao, Naver 등) — 내부 인증 우선 | 등록됨 |
| ✅ | PWA / 오프라인 지원 | 등록됨 |
| ✅ | 관리자 SEO 메타 정보 관리 (CSR 특성상 효과 제한적) | 등록됨 |

