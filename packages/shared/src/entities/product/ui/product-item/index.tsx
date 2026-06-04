import type { Product } from '../..';
import type { BaseProps } from '../../../../shared/types';
import { IconButton } from '../../../../shared/ui';

import styles from './index.module.css';

interface ProductItemProps extends BaseProps {
  data: Product;
  onItemClick?: (menu: Product) => void;
}

export function ProductItem({ data, onItemClick = () => null }: ProductItemProps) {
  const { name, description, iconColor, iconType, baseRate, maxRate } = data;

  // Format rates string dynamically (e.g. "기본 연 6% ↑" or "최고 연 1.2% / 기본 연 6%")
  const renderRates = () => {
    if (!maxRate && !baseRate) return null;
    if (baseRate && !maxRate) {
      return `기본 연 ${baseRate}% ↑`;
    }
    if (maxRate && baseRate) {
      return `최고 연 ${maxRate}% / 기본 연 ${baseRate}%`;
    }
    return null;
  };

  const rateText = renderRates();

  return (
    <div className={styles.card} onClick={() => onItemClick(data)}>
      {/* Clean and clear Left circular icon container with soft pastel theme backing */}
      <div
        className={styles.iconWrapper}
        style={{
          backgroundColor: `${iconColor}14`, // ~8% opacity for delicate pastel filling
          borderColor: `${iconColor}33`,     // ~20% opacity for sharp boundary line
        }}
      >
        <IconButton
          iconType={iconType}
          size="lg"
          iconColor={iconColor}
          className={styles.cleanIconButton}
        />
      </div>

      {/* Product content stacked vertically */}
      <div className={styles.content}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.description}>{description}</p>
        {rateText && <span className={styles.rate}>{rateText}</span>}
      </div>
    </div>
  );
}
