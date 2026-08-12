import { useFetchProductList } from '@bx/shared';

import styles from './index.module.css';

export function ProductPage() {
  const { data: products, isLoading, isError, error } = useFetchProductList();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>상품</h1>

      {isLoading && <p className={styles.message}>불러오는 중...</p>}

      {isError && (
        <p className={styles.error}>
          상품을 불러오지 못했습니다. {error instanceof Error ? error.message : ''}
        </p>
      )}

      {!isLoading && !isError && (
        <ul className={styles.list}>
          {products?.map((product) => (
            <li key={product.productId} className={styles.item}>
              <p className={styles.name}>{product.productNm}</p>
              {product.productDesc && <p className={styles.description}>{product.productDesc}</p>}
            </li>
          ))}
        </ul>
      )}

      {!isLoading && !isError && (products?.length ?? 0) === 0 && (
        <p className={styles.message}>등록된 상품이 없습니다.</p>
      )}
    </div>
  );
}
