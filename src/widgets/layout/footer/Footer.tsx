import { Button } from '@bwg-ds/core'
import { CreditCard, Grid3X3, Send, User } from 'lucide-react'

interface FooterProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export function Footer({ activeTab, onTabChange }: FooterProps) {
  const tabs = [
    { id: 'account', label: '계좌조회', icon: CreditCard },
    { id: 'transfer', label: '이체', icon: Send },
    { id: 'user', label: '사용자', icon: User },
    { id: 'menu', label: '전체메뉴', icon: Grid3X3 },
  ]

  return (
    <footer className="border-t bg-background">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <Button
              key={tab.id}
              className={`flex-1 flex-col h-16 rounded-none ${
                activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={() => onTabChange?.(tab.id)}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{tab.label}</span>
            </Button>
          )
        })}
      </div>
    </footer>
  )
}
