# DataTableBox 및 조회·선택 액션 설계

## 목표

관리자 목록 화면에서 검색 조건, 조회, 등록, 다중 선택 액션과 테이블의 역할을 명확히 구분한다.

- 조회와 초기화는 검색 조건 영역에 배치한다.
- 등록은 검색 영역 우측의 페이지 주요 액션으로 유지한다.
- 삭제와 기타 다중 선택 액션은 행이 선택된 동안에만 테이블 상단에 노출한다.
- 업무 페이지가 선택 상태를 직접 관리하지 않도록 `DataTableBox`가 선택 상태를 소유한다.

## 화면 구조

```tsx
<AdminFilterBar
  searchValue={draftSearch}
  statusValue={draftStatus}
  resultLabel={`${rows.length}개 그룹`}
  primaryActionLabel="그룹 등록"
  onSearch={handleSearch}
  onReset={handleReset}
  onPrimaryAction={openCreateDrawer}
/>

<DataTableBox rows={rows} getRowId={getGroupRowId}>
  <DataTableBox.Header>
    <BulkActionBar onDelete={handleBulkDelete}>
      {/* 업무별 상태 변경·기타 액션을 필요할 때 추가 */}
    </BulkActionBar>
  </DataTableBox.Header>

  <DataTableBox.Table
    columns={columns}
    pageSize={10}
    onRowSelect={openEditDrawer}
  />
</DataTableBox>
```

필터 영역은 `DataTableBox` 밖에 둔다. `DataTableBox`는 테이블과 테이블 선택 액션만 담당한다.

## 컴포넌트 책임

### `DataTableBox`

- `rows`와 `getRowId`를 받는다.
- 선택된 항목을 `selectedItems`로 관리한다.
- Context로 다음 값을 하위 컴포넌트에 제공한다.
  - `rows`
  - `selectedItems`
  - `selectedRowIds`
  - `selectionCount`
  - `setSelectedItems`
  - `clearSelection`
- 외곽 테두리, 배경, 라운드를 소유한다.

### `DataTableBox.Header`

- `selectionCount`가 0이면 렌더링하지 않는다.
- 선택 항목이 있을 때만 다중 선택 액션 영역을 렌더링한다.
- 테이블과 하나의 박스로 보이도록 하단 구분선만 갖는다.

### `DataTableBox.Table`

- Context의 `rows`, `selectedRowIds`, `setSelectedItems`를 기존 `DataTable`에 연결한다.
- 정렬, 페이지네이션, 행 클릭과 셀 렌더링은 기존 `DataTable`에 위임한다.
- `DataTableBox` 내부에서는 자체 외곽 테두리와 라운드를 제거한다.
- 기존 `DataTable`의 단독 사용 방식은 유지한다.

### `BulkActionBar`

- `DataTableBox` Context에서 선택 개수와 선택 항목을 읽는다.
- 선택 개수, 업무별 추가 액션, 선택 해제, 삭제를 표시한다.
- 삭제 클릭 시 확인 후 `onDelete(selectedItems)`를 호출한다.
- 삭제 콜백이 성공하면 선택을 초기화한다.
- 삭제 콜백이 실패하면 선택을 유지하고, 기존 전역 오류 처리를 따른다.
- 비동기 삭제 중에는 중복 실행을 막는다.

## 삭제 콜백 계약

```ts
type BulkDeleteHandler<T> = (selectedItems: T[]) => void | Promise<void>;
```

`DataTableBox`와 `BulkActionBar`는 실제 삭제 API를 알지 않는다. 코드 그룹, 메뉴, 사용자 등 각 업무 화면이 콜백으로 삭제 작업을 제공한다.

```tsx
<BulkActionBar
  onDelete={async (selectedItems) => {
    await Promise.all(
      selectedItems.map((item) => deleteGroup.mutateAsync(item.groupCd)),
    );
  }}
/>
```

## 조회 동작

현재의 입력 즉시 필터링 대신 조회 버튼을 기준으로 조건을 적용한다.

- `draftSearch`, `draftStatus`: 사용자가 편집 중인 조건
- `appliedSearch`, `appliedStatus`: 현재 목록에 적용된 조건
- 조회 버튼 또는 검색어 입력란의 Enter로 draft 값을 applied 값에 반영한다.
- 초기화는 draft와 applied 값을 함께 비우고 전체 목록을 표시한다.
- 결과 건수와 등록 버튼은 필터 영역 우측에 유지한다.

## 위치

- 재사용 가능한 기본 컴포넌트:
  - `packages/shared/src/shared/ui/data-table-box`
- Admin 전용 선택 액션:
  - `apps/admin-portal/src/shared/ui/bulk-action-bar`
- 우선 적용 화면:
  - 코드관리
  - 메뉴관리
  - 사용자관리

다른 앱에서 선택 액션 패턴이 필요하면 공유 `DataTableBox`를 사용하고 앱별 액션 컴포넌트를 조합한다.

## 오류 및 상태 처리

- 데이터 변경으로 현재 행 집합이 바뀌면 존재하지 않는 선택 항목을 제거한다.
- 페이지 이동 시 기존 `DataTable` 정책에 따라 선택을 초기화한다.
- 삭제 성공 시 선택을 초기화한다.
- 삭제 실패 시 선택을 유지한다.
- 삭제 진행 중 삭제 버튼을 비활성화한다.

## 테스트

- 선택 전에는 `DataTableBox.Header`가 렌더링되지 않는다.
- 행 선택 시 선택 개수와 액션바가 표시된다.
- 선택 해제 시 헤더가 사라진다.
- 삭제 클릭 시 정확한 `selectedItems`가 콜백에 전달된다.
- 삭제 성공 시 선택이 초기화된다.
- 삭제 실패 시 선택이 유지된다.
- 조회 버튼과 Enter가 조건을 적용한다.
- 초기화가 입력 조건과 적용 조건을 모두 비운다.
- 기존 단독 `DataTable`의 테두리, 정렬, 페이지네이션 동작은 유지된다.

## 제외 범위

- 실제 상태 변경 API가 없는 화면에 가짜 액션을 추가하지 않는다.
- 업무별 삭제 API를 공통 컴포넌트로 이동하지 않는다.
- 서버 조회 방식으로의 전환은 이번 범위에 포함하지 않는다.
