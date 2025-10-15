import { useLocation, useRouter } from '@tanstack/react-router'
import { Ellipsis, House, PiggyBank, SquareChartGantt } from 'lucide-react'


import { cn } from '@/shared/lib/utils'
import type { BaseProps } from '@/shared/types'
import { FooterButton } from '@/widgets/components'

import styles from './Footer.module.css'

interface FooterProps extends BaseProps {}

export function Footer(props: FooterProps) {
  const { navigate } = useRouter()
  const location = useLocation()

  const buttons = footerMeta.map((d) => (
    <FooterButton
      key={d.path}
      label={d.label}
      icon={d.icon}
      isSelected={d.path === location.pathname}
      onClick={() => handleClickButton(d.path)}
    />
  ))

  const handleClickButton = (path: string) => {
    // TODO: zustand 통해서 라우팅 되게 수정
    navigate({
      to: path,
    })
  }

  return (
    <footer className={cn(styles.root, props.className)}>
      <div className={styles.buttonWrapper}>{buttons}</div>
    </footer>
  )
}

const footerMeta = [
  { label: '홈', path: '/main', icon: <House /> },
  { label: '자산', path: '/asset', icon: <PiggyBank /> },
  { label: '상품', path: '/product', icon: <SquareChartGantt /> },
  { label: '메뉴', path: '/menu', icon: <Ellipsis /> },
]
