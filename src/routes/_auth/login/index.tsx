import { Button, InputBox, Section, ViewBox } from '@bwg-ds/core'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import useForm from '@/shared/hooks/useForm'
import { session } from '@/shared/lib/utils'

export const Route = createFileRoute('/_auth/login/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  const { control } = useForm({
    formName: 'searchForm1',
    defaultValues: {
      id: '',
      password: '',
    },
  })

  const handleSubmit = () => {
    console.log('submit')

    // TODO: login 처리 로직 추가
    session.set('sessionId', '1234567890')
    navigate({ to: '/main' })
  }

  return (
    <Section>
      <ViewBox>
        <div className="signup-form">
          <h1 className="signup-form__brand">BXUI</h1>

          <div className="signup-form__header">
            <h2 className="signup-form__title">Hello 👋 Sign up here</h2>
            <p className="signup-form__subtitle">
              Your data is protected (at all cost)
            </p>
          </div>

          <Button color=" signup-form__social-button">
            Sign up with facebook
          </Button>

          <div className="signup-form__divider">OR</div>

          <InputBox
            control={control}
            i18n="email"
            name="email"
            type="email"
            placeholder="Email Address*"
            className="signup-form__input"
          />
          <InputBox
            control={control}
            i18n="password"
            name="password"
            type="password"
            placeholder="Password"
            className="signup-form__input"
          />
          <Button
            className="signup-form__submit"
            i18n="Submit"
            onClick={handleSubmit}
          />
        </div>
      </ViewBox>
    </Section>
  )
}
