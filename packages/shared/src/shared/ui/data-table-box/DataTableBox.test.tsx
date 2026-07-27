// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { DataTableColumn } from '../data-table/DataTable';
import { DataTableBox, useDataTableBoxSelection } from './DataTableBox';

const mocks = vi.hoisted(() => ({
  openDeleteConfirm: vi.fn(),
}));

vi.mock('../../model/alert/alert.store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../model/alert/alert.store')>();

  return {
    ...actual,
    openDeleteConfirm: mocks.openDeleteConfirm,
  };
});

interface Row {
  id: string;
  name: string;
}

const rows: Row[] = [
  { id: 'a', name: '알파' },
  { id: 'b', name: '브라보' },
  { id: 'c', name: '찰리' },
];

const columns: Array<DataTableColumn<Row>> = [
  { id: 'name', header: '이름', cell: (row) => row.name },
];

function SelectionProbe() {
  const { selectedRows } = useDataTableBoxSelection<Row>();

  return <output aria-label="선택 항목">{selectedRows.map((item) => item.id).join(',')}</output>;
}

function Example() {
  return (
    <DataTableBox rows={rows} getRowId={(row) => row.id}>
      <DataTableBox.Header>
        <button type="button">등록</button>
      </DataTableBox.Header>
      <DataTableBox.Table columns={columns} />
      <SelectionProbe />
    </DataTableBox>
  );
}

beforeEach(() => {
  mocks.openDeleteConfirm.mockReset();
});

afterEach(cleanup);

describe('DataTableBox', () => {
  it('전체 건수와 Header 액션을 테이블 위에 렌더링한다', () => {
    render(<Example />);

    expect(screen.getByText('전체 3건')).toBeTruthy();
    expect(screen.getByRole('button', { name: '등록' })).toBeTruthy();
    expect(screen.getByText('알파')).toBeTruthy();
  });

  it('행을 선택하면 선택 건수와 선택 항목을 공유한다', () => {
    render(<Example />);

    fireEvent.click(within(screen.getAllByRole('row')[1]).getByRole('checkbox'));

    expect(screen.getByText('1건 선택됨')).toBeTruthy();
    expect(screen.getByLabelText('선택 항목').textContent).toBe('a');
    expect(screen.getByRole('button', { name: '등록' })).toBeTruthy();
  });

  it('선택 해제를 누르면 전체 건수 상태로 돌아간다', () => {
    render(<Example />);

    fireEvent.click(within(screen.getAllByRole('row')[1]).getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: '선택 해제' }));

    expect(screen.getByText('전체 3건')).toBeTruthy();
    expect(screen.getByLabelText('선택 항목').textContent).toBe('');
  });

  it('기본 액션이 있으면 Header 선언 없이 Header와 등록 버튼을 렌더링한다', () => {
    const onCreate = vi.fn();

    render(
      <DataTableBox rows={rows} getRowId={(row) => row.id} onCreate={onCreate}>
        <DataTableBox.Table columns={columns} />
      </DataTableBox>,
    );

    expect(document.querySelectorAll('header')).toHaveLength(1);
    expect(screen.getByText('전체 3건')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '등록' }));
    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  it('Header 선언 없이도 선택 후 삭제하고 성공하면 선택을 해제한다', async () => {
    const onDelete = vi.fn().mockResolvedValue(undefined);
    mocks.openDeleteConfirm.mockResolvedValue(true);

    render(
      <DataTableBox rows={rows} getRowId={(row) => row.id} onDelete={onDelete}>
        <DataTableBox.Table columns={columns} />
      </DataTableBox>,
    );

    expect(screen.queryByRole('button', { name: '삭제' })).toBeNull();
    fireEvent.click(within(screen.getAllByRole('row')[1]).getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: '삭제' }));

    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith([rows[0]]);
      expect(screen.getByText('전체 3건')).toBeTruthy();
    });
  });

  it('canDelete 조건이 false면 선택 후 삭제 버튼을 비활성화한다', () => {
    const canDelete = vi.fn(() => false);

    render(
      <DataTableBox rows={rows} getRowId={(row) => row.id} onDelete={vi.fn()} canDelete={canDelete}>
        <DataTableBox.Table columns={columns} />
      </DataTableBox>,
    );

    expect(canDelete).not.toHaveBeenCalled();
    fireEvent.click(within(screen.getAllByRole('row')[1]).getByRole('checkbox'));

    expect((screen.getByRole('button', { name: '삭제' }) as HTMLButtonElement).disabled).toBe(true);
    expect(canDelete).toHaveBeenLastCalledWith([rows[0]]);
  });

  it('명시적 Header에는 기타 액션과 기본 액션을 함께 한 번만 렌더링한다', () => {
    render(
      <DataTableBox rows={rows} getRowId={(row) => row.id} onCreate={vi.fn()}>
        <DataTableBox.Header>
          <button type="button">엑셀 다운로드</button>
        </DataTableBox.Header>
        <DataTableBox.Table columns={columns} />
      </DataTableBox>,
    );

    expect(document.querySelectorAll('header')).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: '등록' })).toHaveLength(1);
    expect(screen.getByRole('button', { name: '엑셀 다운로드' })).toBeTruthy();
  });

  it('기본 액션과 명시적 Header가 없으면 Header를 렌더링하지 않는다', () => {
    render(
      <DataTableBox rows={rows} getRowId={(row) => row.id}>
        <DataTableBox.Table columns={columns} />
      </DataTableBox>,
    );

    expect(document.querySelector('header')).toBeNull();
    expect(screen.queryByText('전체 3건')).toBeNull();
  });

  it('삭제 콜백이 반환한 행만 선택 상태로 유지한다', async () => {
    const onDelete = vi.fn().mockResolvedValue([rows[1]]);
    mocks.openDeleteConfirm.mockResolvedValue(true);

    render(
      <DataTableBox rows={rows} getRowId={(row) => row.id} onDelete={onDelete}>
        <DataTableBox.Table columns={columns} />
      </DataTableBox>,
    );

    fireEvent.click(within(screen.getAllByRole('row')[1]).getByRole('checkbox'));
    fireEvent.click(within(screen.getAllByRole('row')[2]).getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: '삭제' }));

    await waitFor(() => expect(screen.getByText('1건 선택됨')).toBeTruthy());

    const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[];
    expect(checkboxes[1].checked).toBe(false);
    expect(checkboxes[2].checked).toBe(true);
  });

  it('삭제 콜백이 실패하면 기존 선택을 유지한다', async () => {
    const onDelete = vi.fn().mockRejectedValue(new Error('삭제 실패'));
    mocks.openDeleteConfirm.mockResolvedValue(true);

    render(
      <DataTableBox rows={rows} getRowId={(row) => row.id} onDelete={onDelete}>
        <DataTableBox.Table columns={columns} />
      </DataTableBox>,
    );

    fireEvent.click(within(screen.getAllByRole('row')[1]).getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: '삭제' }));

    await waitFor(() => expect(onDelete).toHaveBeenCalledTimes(1));
    expect(screen.getByText('1건 선택됨')).toBeTruthy();
  });

  it('삭제 확인을 취소하면 콜백을 호출하지 않고 선택을 유지한다', async () => {
    const onDelete = vi.fn();
    mocks.openDeleteConfirm.mockResolvedValue(false);

    render(
      <DataTableBox rows={rows} getRowId={(row) => row.id} onDelete={onDelete}>
        <DataTableBox.Table columns={columns} />
      </DataTableBox>,
    );

    fireEvent.click(within(screen.getAllByRole('row')[1]).getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: '삭제' }));

    await waitFor(() => expect(mocks.openDeleteConfirm).toHaveBeenCalledTimes(1));
    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.getByText('1건 선택됨')).toBeTruthy();
  });
});
