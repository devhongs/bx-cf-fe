import { House, Menu, PiggyBank, SquareChartGantt } from 'lucide-react'

import styles from './Footer.module.css'

import { cn } from '@/shared/lib/utils'
import type { BaseProps } from '@/shared/types'
import { FooterButton } from '@/widgets/components'

interface FooterProps extends BaseProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export function Footer(props: FooterProps) {
  return (
    <footer className={cn(styles.root, props.className)}>
      <div className={styles.buttonWrapper}>
        <FooterButton label="홈" icon={<House fill="#ff4d6d" />} />
        <FooterButton label="자산" icon={<PiggyBank />} />
        <FooterButton label="상품 " icon={<SquareChartGantt />} />
        <FooterButton label="메뉴" icon={<Menu />} />
      </div>
    </footer>
  )
}
