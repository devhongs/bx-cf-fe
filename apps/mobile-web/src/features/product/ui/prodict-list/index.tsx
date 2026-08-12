import type { BaseProps, Product } from '@bx/shared';
import { ProductItem, useFetchProductList } from '@bx/shared';

import styles from './index.module.css';

interface ProductListProps extends BaseProps {
  dummy?: any;
}

export function ProductList(_props: ProductListProps) {
  const { data } = useFetchProductList();
  const content = data ?? [];

  console.log(data);

  const handleItemClick = (product: Product) => {
    console.log(product);
  };

  return (
    <div className={styles.layout}>
      {content.map((d: Product) => (
        <ProductItem key={d.productId} data={d} onItemClick={handleItemClick} />
      ))}
    </div>
  );
}
