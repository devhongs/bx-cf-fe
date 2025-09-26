import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_page/asset/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_page/asset/"!</div>
}
