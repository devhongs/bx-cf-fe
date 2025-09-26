import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_page/menu/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_page/menu/"!</div>
}
