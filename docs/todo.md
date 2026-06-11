📋 src/entities/account 구조 개선 Todo-List

1. [x] API 내 비즈니스 캡슐화 분리: AccountService.setFavorite 내부에 복잡하게 얽혀 있는 다중 API 호출 및 순회 비즈니스 로직을 API 레이어에서 걷어내기
2. [x] API와 Query/Hook 메서드명 일치: AccountService 클래스의 메서드명을 fetchAll ➔ fetchAccounts, fetch ➔ fetchAccount 처럼 모델 명사형 기반으로 변경하기
3. [x] any 타입 제거 및 타입 엄격화: options?: any, Promise<any>, previousQueries?: any 등의 범용 타입을 React-Query 공식 제네릭 및 명확한 도메인 타입으로 대체하기
4. [x] 즐겨찾기 동기화 설계 단순화: 화면상의 캐시를 변경하는 낙관적 업데이트(Hook)와 다중 PATCH를 쏘는 API(setFavorite) 간의 중복된 조작 로직을 하나로 통합/단순화하기
