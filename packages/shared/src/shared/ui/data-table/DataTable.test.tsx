// @vitest-environment jsdom
import { useState } from 'react';

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DataTable, type DataTableColumn } from './DataTable';

interface Row {
  id: string;
  name: string;
  qty: number;
}

const rows: Row[] = [
  { id: 'a', name: '찰리', qty: 30 },
  { id: 'b', name: '알파', qty: 10 },
  { id: 'c', name: '브라보', qty: 20 },
];

const baseColumns: Array<DataTableColumn<Row>> = [
  { id: 'name', header: '이름', cell: (row) => row.name },
  { id: 'qty', header: '수량', cell: (row) => row.qty },
];

const dataCellTexts = (columnIndex: number) =>
  screen
    .getAllByRole('row')
    .slice(1) // skip header row
    .map((row) => within(row).getAllByRole('cell')[columnIndex]?.textContent);

afterEach(cleanup);

describe('DataTable', () => {
  it('컬럼과 행을 렌더링한다', () => {
    render(<DataTable columns={baseColumns} rows={rows} getRowId={(row) => row.id} />);
    expect(screen.getByText('이름')).toBeTruthy();
    expect(screen.getByText('찰리')).toBeTruthy();
    expect(screen.getByText('알파')).toBeTruthy();
  });

  it('행이 없으면 emptyLabel을 보여준다', () => {
    render(
      <DataTable
        columns={baseColumns}
        rows={[]}
        getRowId={(row) => row.id}
        emptyLabel="비어 있음"
      />,
    );
    expect(screen.getByText('비어 있음')).toBeTruthy();
  });

  it('sortable 컬럼 헤더 클릭 시 정렬된다', () => {
    const columns: Array<DataTableColumn<Row>> = [
      { id: 'name', header: '이름', cell: (row) => row.name },
      {
        id: 'qty',
        header: '수량',
        sortable: true,
        sortValue: (row) => row.qty,
        cell: (row) => row.qty,
      },
    ];
    render(<DataTable columns={columns} rows={rows} getRowId={(row) => row.id} />);

    expect(dataCellTexts(0)).toEqual(['찰리', '알파', '브라보']);
    fireEvent.click(screen.getByRole('button', { name: /수량/ }));
    expect(dataCellTexts(0)).toEqual(['알파', '브라보', '찰리']); // qty 10,20,30 오름차순
  });

  it('pageSize로 페이지네이션한다', () => {
    render(<DataTable columns={baseColumns} rows={rows} getRowId={(row) => row.id} pageSize={2} />);
    expect(dataCellTexts(0)).toEqual(['찰리', '알파']);
    fireEvent.click(screen.getByRole('button', { name: '다음' }));
    expect(dataCellTexts(0)).toEqual(['브라보']);
  });

  it('서버 페이지네이션은 전체 건수로 페이지 수를 계산하고 변경 상태를 전달한다', () => {
    const onPaginationChange = vi.fn();

    render(
      <DataTable
        columns={baseColumns}
        rows={rows.slice(0, 2)}
        getRowId={(row) => row.id}
        serverSide={{
          pagination: { pageIndex: 0, pageSize: 2 },
          sorting: [],
          rowCount: 5,
          onPaginationChange,
          onSortingChange: vi.fn(),
        }}
      />,
    );

    expect(screen.getByText('1 / 3')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '다음' }));
    expect(onPaginationChange).toHaveBeenCalledWith({ pageIndex: 1, pageSize: 2 });
  });

  it('서버 정렬은 현재 행을 직접 정렬하지 않고 변경 상태를 전달한다', () => {
    const onSortingChange = vi.fn();
    const columns: Array<DataTableColumn<Row>> = [
      {
        id: 'qty',
        header: '수량',
        sortable: true,
        sortValue: (row) => row.qty,
        cell: (row) => row.qty,
      },
    ];

    render(
      <DataTable
        columns={columns}
        rows={rows.slice(0, 2)}
        getRowId={(row) => row.id}
        serverSide={{
          pagination: { pageIndex: 0, pageSize: 2 },
          sorting: [],
          rowCount: 5,
          onPaginationChange: vi.fn(),
          onSortingChange,
        }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /수량/ }));

    expect(onSortingChange).toHaveBeenCalledWith([{ id: 'qty', desc: false }]);
    expect(dataCellTexts(0)).toEqual(['30', '10']);
  });

  it('서버 정렬을 바꾸면 첫 페이지로 이동한다', () => {
    const onPaginationChange = vi.fn();
    const columns: Array<DataTableColumn<Row>> = [
      {
        id: 'qty',
        header: '수량',
        sortable: true,
        sortValue: (row) => row.qty,
        cell: (row) => row.qty,
      },
    ];

    render(
      <DataTable
        columns={columns}
        rows={rows.slice(0, 2)}
        getRowId={(row) => row.id}
        serverSide={{
          pagination: { pageIndex: 1, pageSize: 2 },
          sorting: [],
          rowCount: 5,
          onPaginationChange,
          onSortingChange: vi.fn(),
        }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /수량/ }));

    expect(onPaginationChange).toHaveBeenCalledWith({ pageIndex: 0, pageSize: 2 });
  });

  it('editable 컬럼은 클릭 후 편집하면 onCellEdit을 호출한다', () => {
    const onCellEdit = vi.fn();
    const columns: Array<DataTableColumn<Row>> = [
      { id: 'name', header: '이름', editable: true, cell: (row) => row.name },
    ];
    render(
      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        onCellEdit={onCellEdit}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '찰리' }));
    const input = screen.getByDisplayValue('찰리');
    fireEvent.change(input, { target: { value: '델타' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onCellEdit).toHaveBeenCalledWith(rows[0], 'name', '델타');
  });

  it('selectable이면 체크박스 열이 추가되고 행 체크 시 onSelectionChange를 호출한다', () => {
    const onSelectionChange = vi.fn();
    render(
      <DataTable
        columns={baseColumns}
        rows={rows}
        getRowId={(row) => row.id}
        selectable
        selectedRowIds={[]}
        onSelectionChange={onSelectionChange}
      />,
    );

    // 헤더 1 + 데이터 3 = 체크박스 4개
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(4);

    fireEvent.click(within(screen.getAllByRole('row')[1]).getByRole('checkbox'));
    expect(onSelectionChange).toHaveBeenCalledWith([rows[0]]);
  });

  it('헤더 체크박스로 전체 선택한다', () => {
    const onSelectionChange = vi.fn();
    render(
      <DataTable
        columns={baseColumns}
        rows={rows}
        getRowId={(row) => row.id}
        selectable
        selectedRowIds={[]}
        onSelectionChange={onSelectionChange}
      />,
    );

    fireEvent.click(within(screen.getAllByRole('row')[0]).getByRole('checkbox'));
    expect(onSelectionChange).toHaveBeenCalledWith(rows);
  });

  it('페이지네이션 중 헤더 체크박스는 현재 페이지만 선택한다', () => {
    const onSelectionChange = vi.fn();
    render(
      <DataTable
        columns={baseColumns}
        rows={rows}
        getRowId={(row) => row.id}
        pageSize={2}
        selectable
        selectedRowIds={[]}
        onSelectionChange={onSelectionChange}
      />,
    );

    fireEvent.click(within(screen.getAllByRole('row')[0]).getByRole('checkbox'));
    expect(onSelectionChange).toHaveBeenCalledWith(rows.slice(0, 2));
  });

  it('페이지를 이동하면 현재 페이지 선택을 해제한다', () => {
    function PaginatedSelectionTable() {
      const [selectedRows, setSelectedRows] = useState<Row[]>([rows[0]]);

      return (
        <DataTable
          columns={baseColumns}
          rows={rows}
          getRowId={(row) => row.id}
          pageSize={2}
          selectable
          selectedRowIds={selectedRows.map((row) => row.id)}
          onSelectionChange={setSelectedRows}
        />
      );
    }

    render(<PaginatedSelectionTable />);
    expect(
      (within(screen.getAllByRole('row')[1]).getByRole('checkbox') as HTMLInputElement).checked,
    ).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: '다음' }));
    fireEvent.click(screen.getByRole('button', { name: '이전' }));

    expect(
      (within(screen.getAllByRole('row')[1]).getByRole('checkbox') as HTMLInputElement).checked,
    ).toBe(false);
  });

  it('목록에서 사라진 행은 선택을 해제한다', () => {
    function FilteredSelectionTable() {
      const [visibleRows, setVisibleRows] = useState(rows);
      const [selectedRows, setSelectedRows] = useState<Row[]>([rows[0]]);

      return (
        <>
          <button type="button" onClick={() => setVisibleRows(rows.slice(1))}>
            필터 적용
          </button>
          <span>선택 {selectedRows.length}건</span>
          <DataTable
            columns={baseColumns}
            rows={visibleRows}
            getRowId={(row) => row.id}
            pageSize={2}
            selectable
            selectedRowIds={selectedRows.map((row) => row.id)}
            onSelectionChange={setSelectedRows}
          />
        </>
      );
    }

    render(<FilteredSelectionTable />);
    expect(screen.getByText('선택 1건')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '필터 적용' }));

    expect(screen.getByText('선택 0건')).toBeTruthy();
  });

  it('목록이 바뀌어도 남아 있는 행은 선택을 유지한다', () => {
    // 다중 삭제에서 일부만 성공하면 실패한 행은 재시도를 위해 선택이 남아야 한다.
    function PartialRemovalTable() {
      const [visibleRows, setVisibleRows] = useState(rows);
      const [selectedRows, setSelectedRows] = useState<Row[]>([rows[0], rows[1]]);

      return (
        <>
          <button type="button" onClick={() => setVisibleRows(rows.slice(1))}>
            첫 행 삭제
          </button>
          <span>선택 {selectedRows.map((row) => row.id).join(',') || '없음'}</span>
          <DataTable
            columns={baseColumns}
            rows={visibleRows}
            getRowId={(row) => row.id}
            selectable
            selectedRowIds={selectedRows.map((row) => row.id)}
            onSelectionChange={setSelectedRows}
          />
        </>
      );
    }

    render(<PartialRemovalTable />);
    expect(screen.getByText('선택 a,b')).toBeTruthy();

    // a는 목록에서 사라지고 b는 남는다 → b만 선택 유지
    fireEvent.click(screen.getByRole('button', { name: '첫 행 삭제' }));

    expect(screen.getByText('선택 b')).toBeTruthy();
    expect(
      (within(screen.getAllByRole('row')[1]).getByRole('checkbox') as HTMLInputElement).checked,
    ).toBe(true);
  });

  it('목록이 줄어 현재 페이지가 범위를 벗어나면 마지막 페이지로 이동한다', () => {
    function ShrinkingTable() {
      const [visibleRows, setVisibleRows] = useState(rows);

      return (
        <>
          <button type="button" onClick={() => setVisibleRows(rows.slice(0, 1))}>
            필터 적용
          </button>
          <DataTable
            columns={baseColumns}
            rows={visibleRows}
            getRowId={(row) => row.id}
            pageSize={2}
          />
        </>
      );
    }

    render(<ShrinkingTable />);
    fireEvent.click(screen.getByRole('button', { name: '다음' }));
    expect(screen.getByText('2 / 2')).toBeTruthy();

    // 3건 → 1건이면 총 1페이지뿐이므로 2페이지에 머무르면 빈 화면에 갇힌다.
    fireEvent.click(screen.getByRole('button', { name: '필터 적용' }));

    expect(screen.getByText('1 / 1')).toBeTruthy();
    expect(dataCellTexts(0)).toEqual(['찰리']);
    expect(screen.queryByText('표시할 데이터가 없습니다.')).toBeNull();
  });

  it('체크박스에서 Space를 눌러도 행 선택 동작을 호출하지 않는다', () => {
    const onRowSelect = vi.fn();
    render(
      <DataTable
        columns={baseColumns}
        rows={rows}
        getRowId={(row) => row.id}
        selectable
        selectedRowIds={[]}
        onSelectionChange={vi.fn()}
        onRowSelect={onRowSelect}
      />,
    );

    const rowCheckbox = within(screen.getAllByRole('row')[1]).getByRole('checkbox');
    fireEvent.keyDown(rowCheckbox, { key: ' ' });

    expect(onRowSelect).not.toHaveBeenCalled();
  });

  it('selectedRowIds로 체크 상태가 제어된다', () => {
    render(
      <DataTable
        columns={baseColumns}
        rows={rows}
        getRowId={(row) => row.id}
        selectable
        selectedRowIds={['b']}
        onSelectionChange={vi.fn()}
      />,
    );

    const rowCheckbox = within(screen.getAllByRole('row')[2]).getByRole('checkbox');
    expect((rowCheckbox as HTMLInputElement).checked).toBe(true);
  });
});
