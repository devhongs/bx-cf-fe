import { useFetchProducts } from '@/entities/product'
import type { Product } from '@/entities/product'
import ProductItem from '@/entities/product/ui/product-item'
import type { BaseProps } from '@/shared/types'

import styles from './index.module.css'

interface ProductListProps extends BaseProps {
  dummy?: any
}

export default function ProductList(_props: ProductListProps) {
  const { data } = useFetchProducts()
  const content = data?.content ?? []

  const handleItemClick = (product: Product) => {
    console.log(product)
  }

  return (
    <div className={styles.start}>
      {content.map((d: Product) => (
        <ProductItem key={d.id} data={d} onItemClick={handleItemClick} />
      ))}
    </div>
  )
}
