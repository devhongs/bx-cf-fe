import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/main/main2')({
  component: App,
})

function App() {
  return <div className="text-center">main2 page</div>
}
