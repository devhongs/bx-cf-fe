import { useState } from 'react';

import { AdminFilterBar } from './AdminFilterBar';

export default {
  title: 'UI/AdminFilterBar',
  component: AdminFilterBar,
};

function AdminFilterBarExample() {
  const [searchValue, setSearchValue] = useState('');
  const [submittedValue, setSubmittedValue] = useState('');

  return (
    <>
      <AdminFilterBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onSearch={() => setSubmittedValue(searchValue)}
        onReset={() => {
          setSearchValue('');
          setSubmittedValue('');
        }}
      />
      <p>조회 조건: {submittedValue || '전체'}</p>
    </>
  );
}

export const Default = {
  render: () => <AdminFilterBarExample />,
};
