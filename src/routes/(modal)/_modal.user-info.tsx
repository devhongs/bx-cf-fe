import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(modal)/_modal/user-info')({
  component: UserInfoModalRoute,
})

function UserInfoModalRoute() {
  return <div>UserInfoModal</div>
}
