import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_page/test/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_page/test/"!</div>
}
