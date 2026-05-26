import { MessageCircle } from 'lucide-react';

import { MenuList } from '@/features/menu/ui/menu-list';
import { IconButton, Page, PageBody } from '@/shared/ui';

import styles from './index.module.css';

export function MenuPage() {
  return (
    <Page className={styles.layout}>
      <PageBody>
        <MenuList className={styles.menuList} />
        <IconButton
          size="sm"
          icon={MessageCircle}
          className={styles.chatbotButton}
          label="상담챗봇"
        />
      </PageBody>
    </Page>
  );
}
