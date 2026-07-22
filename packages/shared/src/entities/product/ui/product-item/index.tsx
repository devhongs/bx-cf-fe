import type { Product } from '../../model/product.type';
import type { BaseProps } from '../../../../shared/types';
import { IconButton } from '../../../../shared/ui';
import type { CSSProperties } from 'react';

import styles from './index.module.css';

interface ProductItemProps extends BaseProps {
  data: Product;
  onItemClick?: (product: Product) => void;
}

export function ProductItem({ data, onItemClick = () => null }: ProductItemProps) {
  const name = data.productNm ?? '';
  const description = data.productDesc ?? '';
  const iconColor = '#16c481';
  const iconType = 'Banknote';

  return (
    <div className={styles.card} onClick={() => onItemClick(data)}>
      <div
        className={styles.iconWrapper}
        style={{
          '--product-icon-background': `${iconColor}14`,
          '--product-icon-border': `${iconColor}33`,
        } as CSSProperties}
      >
        <IconButton
          iconType={iconType}
          size="lg"
          iconColor={iconColor}
          className={styles.cleanIconButton}
        />
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
}
