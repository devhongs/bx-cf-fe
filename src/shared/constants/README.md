# 상수 관리

이 폴더는 프로젝트 전반에서 사용되는 상수들을 관리합니다.

## 구조

```
src/shared/constants/
├── api.ts          # API 관련 상수
├── index.ts        # 모든 상수를 export하는 메인 파일
└── README.md       # 이 파일
```

## 사용법

### 기본 사용

```typescript
import { API_URL, API_ENDPOINTS, ROUTES } from '@/shared/constants'

// API 호출 시
const response = await fetch(`${API_URL}/api/users`)

// 라우팅 시
navigate(ROUTES.LOGIN)
```

### 개별 import

```typescript
import { API_URL } from '@/shared/constants/api'
import { ROUTES } from '@/shared/constants'
```

## 상수 목록

### API 상수 (`api.ts`)

- `API_URL`: API 서버 주소 ('localhost:8080')
- `API_ENDPOINTS`: API 엔드포인트 정의
- `API_CONFIG`: API 관련 설정

### 앱 상수 (`index.ts`)

- `APP_CONFIG`: 앱 기본 정보
- `ROUTES`: 라우팅 경로 상수

## 확장 방법

새로운 상수 카테고리가 필요한 경우:

1. `constants/` 폴더에 새 파일 생성 (예: `ui.ts`, `validation.ts`)
2. `index.ts`에서 export 추가
3. 필요시 JSDoc 주석 추가
