import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_page/account-list/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>accout-list</div>
}
