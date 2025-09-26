import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_page/main/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>main page</div>
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
