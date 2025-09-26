import { House, Menu, PiggyBank, SquareChartGantt } from 'lucide-react'

import styles from './Footer.module.css'

import { FooterButton } from '@/widgets/components'

interface FooterProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export function Footer(props: FooterProps) {
  return (
    <footer className={styles.root}>
      <div className="flex w-full">
        <FooterButton label="홈" icon={<House fill="#ff4d6d" />} />
        <FooterButton label="자산" icon={<PiggyBank />} />
        <FooterButton label="상품 " icon={<SquareChartGantt />} />
        <FooterButton label="메뉴" icon={<Menu />} />
      </div>
    </footer>
  )
}
