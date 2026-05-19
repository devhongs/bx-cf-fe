import { createFileRoute } from '@tanstack/react-router'
import { MessageCircle } from 'lucide-react'

import MenuList from '@/features/menu/ui/menu-list'
import { IconButton, Page, PageBody } from '@/shared/ui'

import styles from './index.module.css'

export const Route = createFileRoute('/_page/menu/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Page className={styles.start}>
      <PageBody>
        <MenuList className={styles.menuList} />
        <IconButton
          size="sm"
          variant="secondary"
          icon={MessageCircle}
          className={styles.chatbotButton}
          label="상담챗봇"
        />
      </PageBody>
    </Page>
  )
}
