import ProductList from '@/features/product/ui/prodict-list'
import { Page, PageBody } from '@/shared/ui'

import styles from './index.module.css'

export default function ProductPage() {
  return (
    <Page>
      <PageBody>
        <div className={styles.layout}>
          <ProductList className={styles.product_list} />
        </div>
      </PageBody>
    </Page>
  )
}
