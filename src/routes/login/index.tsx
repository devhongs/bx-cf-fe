import Button from '@/shared/ui/button/Button'
import { Breadcrumb } from '@bwg-ds/core'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login/')({
  component: App,
})

function App() {
  return (
    <div className="text-center">
      <Breadcrumb
        items={[
          {
            title: 'Home',
          },
          {
            title: 'Component',
          },
          {
            title: 'Breadcrumb',
          },
          {
            title: 'Default',
          },
        ]}
      />
      <Button label="Login" />
    </div>
  )
}
