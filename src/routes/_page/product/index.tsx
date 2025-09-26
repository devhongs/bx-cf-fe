import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_page/product/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_page/product/"!</div>
}
