import { createFileRoute } from '@tanstack/react-router';

import { MenuList } from '@/features/menu/ui/menu-list';
import { Page } from '@bx/shared';

function MenuPage() {
  return (
    <Page>
      <Page.Body>
        <MenuList />
        {/* <IconButton
          size="sm"
          icon={MessageCircle}
          className="fixed bottom-20 right-3 flex items-center justify-center z-10 bg-white shadow-md border border-gray-300 cursor-pointer rounded-full px-3 py-2"
          label="상담챗봇"
        /> */}
      </Page.Body>
    </Page>
  );
}

export const Route = createFileRoute('/(page)/_page/menu')({
  component: MenuPage,
});
