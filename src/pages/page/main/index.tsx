import { useFetchAccounts } from '@/entities/account'
import type { Account } from '@/entities/account'
import AccountCard from '@/entities/account/ui/account-card'

export default function MainPage() {
  const { data } = useFetchAccounts({ userId: '' })
  const content = data?.content ?? []

  const favoriteAccount = content.find((acc: Account) => acc.isFavorite)

  // 임시로 [0]번째 계좌만 보여주기
  return <div>{favoriteAccount && <AccountCard data={favoriteAccount} />}</div>
}

// function DefaultContent() {
//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">메인 대시보드</h1>
//       <p className="text-gray-600">환영합니다! 메뉴를 선택해주세요.</p>
//       <Link to="/main/setting">설정</Link>
//     </div>
//   )
// }
