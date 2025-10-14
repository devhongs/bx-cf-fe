import { type BaseProps } from '@/shared/types'

import { type Product } from '@/entities/product'
import IconButton from '@/shared/ui/icon-button/IconButton'
import styles from './index.module.css'

interface ProductItemProps extends BaseProps {
  data: Product
  onItemClick?: (menu: Product) => void
}

export default function ProductItem({
  data,
  onItemClick = () => null,
}: ProductItemProps) {
  const {
    name,
    description,
    icon,
    iconColor,
    rateDescription,
    baseRate,
    maxRate,
  } = data
  return (
    <div className={styles.start}>
      {/* 아이콘 + 상품명 */}
      <div className={styles.product} onClick={() => onItemClick(data)}>
        {/* 아이콘 */}
        <div className={styles.icon}>
          <IconButton
            type={icon}
            size={30}
            strokeColor={iconColor}
            circleBackground={true}
          />
        </div>
        <div className={styles.content}>
          <h3 className={styles.name}>{name}</h3>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
      {/* 금리 */}
      <div className={styles.rate}>
        <div className={styles.icon}></div>
        <div className={styles.content}>
          {rateDescription && (
            <p className={styles.rateDescription}>{rateDescription}</p>
          )}
          <div className={styles.rateText}>
            {maxRate && (
              <span className={styles.maxRate}>최고 연 {maxRate}%</span>
            )}
            {baseRate && (
              <span className={styles.baseRate}>기본 연 {baseRate}%</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
