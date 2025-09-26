import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_page/account-detail/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>accout-detail</div>
}
