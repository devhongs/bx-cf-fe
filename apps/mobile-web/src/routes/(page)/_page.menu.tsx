import { createFileRoute } from '@tanstack/react-router';

import { MenuList } from '@/features/menu/ui/menu-list';
import { Page } from '@bx/shared';

function MenuPage() {
  return (
    <Page>
      <Page.Body>
        <MenuList />
      </Page.Body>
    </Page>
  );
}

export const Route = createFileRoute('/(page)/_page/menu')({
  component: MenuPage,
});
