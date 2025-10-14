import { type BaseProps } from '@/shared/types'

import { useFetchProducts, type Product } from '@/entities/product'
import ProductItem from '@/entities/product/ui/product-item'
import styles from './index.module.css'

interface ProductListProps extends BaseProps {
  dummy?: any
}

export default function ProductList({ dummy }: ProductListProps) {
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
