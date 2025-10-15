import { MessageCircle } from 'lucide-react'

import type {BaseProps} from '@/shared/types';

interface ChatbotButtonProps extends BaseProps {}

export default function ChatbotButton({ onClick }: ChatbotButtonProps) {
  return (
    <button
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '12px',
        width: '100px',
        height: '40px',
        backgroundColor: '#fff',
        color: 'black',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        fontSize: '0.85rem',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        border: '1px solid #ddd',
        cursor: 'pointer',
        borderTopLeftRadius: '32px',
        borderBottomLeftRadius: '32px',
        borderTopRightRadius: '32px',
        borderBottomRightRadius: '32px',
        padding: 0,
        overflow: 'hidden',
      }}
      aria-label="챗봇 열기"
    >
      <MessageCircle className="pr-1" />
      <span>상담챗봇</span>
    </button>
  )
}
