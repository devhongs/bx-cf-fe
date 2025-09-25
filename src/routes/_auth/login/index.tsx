import { Button } from '@bwg-ds/core'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/login/')({
  component: App,
})

function App() {
  return (
    <div className="text-center">
      <Button>Login</Button>
    </div>
  )
}
