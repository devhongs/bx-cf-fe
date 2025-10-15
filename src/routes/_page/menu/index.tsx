import { createFileRoute } from '@tanstack/react-router'

import ChatbotButton from '@/entities/menu/ui/chatbot-button'
import MenuList from '@/features/alarm/ui/menu-list'
import { Page, PageBody } from '@/shared/ui'


import styles from './index.module.css'

export const Route = createFileRoute('/_page/menu/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Page>
      <PageBody>
        <div className={styles.start}>
          <MenuList className={styles.menu_list} />
          <ChatbotButton className={styles.chatbot_button} />
        </div>
      </PageBody>
    </Page>
  )
}
