import { createFileRoute } from '@tanstack/react-router'

import ProductList from '@/features/alarm/ui/prodict-list'
import { Page, PageBody } from '@/shared/ui'

import styles from './index.module.css'

export const Route = createFileRoute('/_page/product/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Page>
      <PageBody>
        <div className={styles.start}>
          <ProductList className={styles.product_list} />
        </div>
      </PageBody>
    </Page>
  )
}
