# DataTableBox 및 조회·선택 액션 설계

## 목표

관리자 목록 화면에서 검색 조건, 조회, 등록, 다중 선택 액션과 테이블의 역할을 명확히 구분한다.

- 조회와 초기화는 검색 조건 영역에 배치한다.
- 등록과 데이터 관련 액션은 테이블 상단에 함께 배치한다.
- 등록은 선택 여부와 관계없이 항상 노출한다.
- 삭제와 기타 다중 선택 액션은 행이 선택된 동안에만 등록 왼쪽에 노출한다.
- 업무 페이지가 선택 상태를 직접 관리하지 않도록 `DataTableBox`가 선택 상태를 소유한다.

## 화면 구조

```tsx
<AdminFilterBar
  searchValue={draftSearch}
  statusValue={draftStatus}
  onSearch={handleSearch}
  onReset={handleReset}
/>

<DataTableBox
  rows={rows}
  getRowId={getGroupRowId}
  onCreate={openCreateDrawer}
  onDelete={handleBulkDelete}
  canDelete={(selectedRows) => selectedRows.every((row) => row.systemYn !== 'Y')}
>
  <DataTableBox.Table
    columns={columns}
    pageSize={10}
    onRowSelect={openEditDrawer}
  />
</DataTableBox>
```

필터 영역은 `DataTableBox` 밖에 둔다. `DataTableBox`는 전체/선택 건수, 데이터 액션과 테이블을 담당한다.

## 컴포넌트 책임

### `DataTableBox`

- `rows`와 `getRowId`를 받는다.
- 선택된 항목을 `selectedRows`로 관리한다.
- `onCreate`가 있으면 `등록` 버튼이 포함된 기본 Header를 자동으로 렌더링한다.
- `onDelete`가 있으면 선택된 행이 있을 때 `삭제` 버튼이 포함된 기본 Header를 자동으로 렌더링한다.
- `canDelete`가 없으면 선택된 행을 삭제할 수 있다고 판단하고, 있으면 반환값에 따라 삭제 버튼을 활성화한다.
- Context로 다음 값을 하위 컴포넌트에 제공한다.
  - `rows`
  - `selectedRows`
  - `selectedRowIds`
  - `selectionCount`
  - `setSelectedRows`
  - `clearSelection`
- 외곽 테두리, 배경, 라운드를 소유한다.

### `DataTableBox.Header`

- `onCreate` 또는 `onDelete`가 설정되어 있으면 선언하지 않아도 기본 Header가 자동으로 렌더링된다.
- 기타 액션을 추가해야 할 때만 `<DataTableBox.Header>...</DataTableBox.Header>`를 직접 선언한다.
- 직접 선언한 Header도 전체/선택 건수와 기본 등록·삭제 버튼을 포함하며 Header를 중복 렌더링하지 않는다.
- 기본 액션이 없고 Header도 선언하지 않으면 테이블만 렌더링한다.
- 선택 전에는 전체 건수를 표시한다.
- 선택 후에는 선택 건수와 선택 해제를 표시한다.
- 등록 버튼은 선택 여부와 관계없이 우측 끝에 유지한다.
- Header children으로 전달한 기타 액션은 기본 삭제와 등록 사이에 렌더링한다.
- 선택 의존적인 기타 액션은 `useDataTableBoxSelection`으로 선택 상태를 읽어 자체적으로 노출을 결정한다.
- 테이블과 하나의 박스로 보이도록 하단 구분선만 갖는다.

### `DataTableBox.Table`

- Context의 `rows`, `selectedRowIds`, `setSelectedRows`를 기존 `DataTable`에 연결한다.
- 정렬, 페이지네이션, 행 클릭과 셀 렌더링은 기존 `DataTable`에 위임한다.
- `DataTableBox` 내부에서는 자체 외곽 테두리와 라운드를 제거한다.
- 기존 `DataTable`의 단독 사용 방식은 유지한다.

### 기본 삭제 액션

- `DataTableBox`가 선택 개수와 선택 행을 직접 사용한다.
- `onDelete`가 설정되고 선택 행이 있을 때만 삭제 버튼을 표시한다.
- `canDelete(selectedRows)`가 `false`이면 삭제 버튼을 비활성화한다.
- 삭제 클릭 시 확인 후 `onDelete(selectedRows)`를 호출한다.
- 삭제 콜백이 반환값 없이 성공하면 선택을 초기화한다.
- 삭제 콜백이 항목 배열을 반환하면 해당 항목만 선택 상태로 유지한다.
- 삭제 콜백이 실패하면 기존 선택을 유지하고, 기존 전역 오류 처리를 따른다.
- 비동기 삭제 중에는 중복 실행을 막는다.

## 삭제 콜백 계약

```ts
type DataTableBoxDeleteHandler<T> = (
  selectedRows: T[],
) => undefined | T[] | Promise<undefined | T[]>;
```

`DataTableBox`는 실제 삭제 API를 알지 않는다. 코드 그룹, 메뉴, 사용자 등 각 업무 화면이 콜백으로 삭제 작업을 제공한다.

```tsx
<DataTableBox
  rows={rows}
  getRowId={getRowId}
  onDelete={async (selectedRows) => {
    const { failed } = await deleteSelectedItems(
      selectedRows,
      (item) => deleteGroup.mutateAsync(item.groupCd),
    );

    return failed;
  }}
>
  <DataTableBox.Table columns={columns} />
</DataTableBox>
```

- `undefined` 반환: 전체 삭제 성공으로 보고 선택을 초기화한다.
- 빈 배열 반환: 전체 삭제 성공으로 보고 선택을 초기화한다.
- 항목 배열 반환: 부분 실패 또는 삭제 제외 항목으로 보고 해당 항목만 선택을 유지한다.
- 예외 발생: 삭제 실행 자체가 실패한 것으로 보고 기존 선택을 유지한다.

## 조회 동작

현재의 입력 즉시 필터링 대신 조회 버튼을 기준으로 조건을 적용한다.

- `draftSearch`, `draftStatus`: 사용자가 편집 중인 조건
- `appliedSearch`, `appliedStatus`: 현재 목록에 적용된 조건
- 조회 버튼 또는 검색어 입력란의 Enter로 draft 값을 applied 값에 반영한다.
- 초기화는 draft와 applied 값을 함께 비우고 전체 목록을 표시한다.
- 조회 영역에는 데이터 액션을 배치하지 않는다.
- 결과 건수와 등록 버튼은 `DataTableBox`가 자동 생성하는 Header에 배치한다.
- 버튼명은 업무명을 붙이지 않고 `조회`, `초기화`, `등록`, `삭제`로 통일한다.

## 위치

- 재사용 가능한 기본 컴포넌트:
  - `packages/shared/src/shared/ui/data-table-box`
- 우선 적용 화면:
  - 코드관리
  - 메뉴관리
  - 사용자관리

다른 앱에서 선택 액션 패턴이 필요하면 공유 `DataTableBox`를 사용하고 앱별 액션 컴포넌트를 조합한다.

## 오류 및 상태 처리

- 데이터 변경으로 현재 행 집합이 바뀌면 존재하지 않는 선택 항목을 제거한다.
- 페이지 이동 시 기존 `DataTable` 정책에 따라 선택을 초기화한다.
- 삭제 성공 시 선택을 초기화한다.
- 부분 실패 시 콜백이 반환한 항목만 선택을 유지한다.
- 삭제 콜백이 예외를 던지면 기존 선택을 유지한다.
- 삭제 진행 중 삭제 버튼을 비활성화한다.

## 테스트

- Header 선언 없이도 `onCreate`가 있으면 전체 건수와 등록 버튼이 표시된다.
- Header 선언 없이도 `onDelete`가 있으면 선택 후 삭제 버튼이 표시된다.
- `canDelete`가 `false`이면 삭제 버튼이 비활성화된다.
- 기본 액션과 Header가 모두 없으면 Header가 렌더링되지 않는다.
- Header를 선언해 기타 액션을 추가해도 기본 Header가 중복되지 않는다.
- 행 선택 시 전체 건수가 선택 개수와 선택 해제로 전환된다.
- 선택 시 일괄 작업과 삭제가 등록 버튼 왼쪽에 추가된다.
- 선택 중에도 등록 버튼이 유지된다.
- 선택 해제 시 일괄 작업과 삭제만 사라진다.
- 삭제 클릭 시 정확한 `selectedRows`가 콜백에 전달된다.
- 삭제 성공 시 선택이 초기화된다.
- 부분 실패 반환 항목만 선택이 유지된다.
- 삭제 콜백이 예외를 던지면 기존 선택이 유지된다.
- 조회 버튼과 Enter가 조건을 적용한다.
- 초기화가 입력 조건과 적용 조건을 모두 비운다.
- 기존 단독 `DataTable`의 테두리, 정렬, 페이지네이션 동작은 유지된다.

## 제외 범위

- 실제 상태 변경 API가 없는 화면에 가짜 액션을 추가하지 않는다.
- 업무별 삭제 API를 공통 컴포넌트로 이동하지 않는다.
- 서버 조회 방식으로의 전환은 이번 범위에 포함하지 않는다.
