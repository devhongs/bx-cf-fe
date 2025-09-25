import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/setting/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>setting page</div>
}
