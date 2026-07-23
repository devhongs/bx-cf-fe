import { useState } from 'react';

import { AdminFilterBar } from './AdminFilterBar';

export default {
  title: 'UI/AdminFilterBar',
  component: AdminFilterBar,
};

function AdminFilterBarExample() {
  const [searchValue, setSearchValue] = useState('');
  const [actionCount, setActionCount] = useState(0);

  return (
    <AdminFilterBar
      searchValue={searchValue}
      resultLabel={`Actions ${actionCount}`}
      primaryActionLabel="Add item"
      onSearchChange={setSearchValue}
      onPrimaryAction={() => setActionCount((count) => count + 1)}
    />
  );
}

export const Default = {
  render: () => <AdminFilterBarExample />,
};
