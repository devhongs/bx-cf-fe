import Button from '@/components/button/Button'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login/')({
  component: App,
})

function App() {
  return (
    <div className="text-center">
      <Button label="Login" />
    </div>
  )
}
