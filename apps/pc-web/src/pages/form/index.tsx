import { useState } from 'react';

import { SignupForm, type SignupPayload } from '@/features/auth/ui/signup-form';

export function FormPage() {
  const [payload, setPayload] = useState<SignupPayload | null>(null);
  const handleSubmit = (nextPayload: SignupPayload) => {
    setPayload(nextPayload);
  };

  return (
    <div className="h-full overflow-y-auto bg-background p-8 text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold">Form</h1>
          <p className="mt-2 text-sm text-muted">폼 샘플</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,560px)_minmax(360px,1fr)]">
          <section className="rounded-lg border border-border bg-surface p-6 shadow-sm">
            <SignupForm onSubmit={handleSubmit} />
          </section>

          <section className="rounded-lg border border-border bg-surface p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-base font-semibold">Submit Payload</h2>
              <span className="text-xs text-muted">{payload ? 'SUCCESS' : 'EMPTY'}</span>
            </div>
            <pre className="min-h-72 overflow-auto rounded-md bg-background-deep p-4 text-sm leading-6 text-accent-subtle">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </section>
        </div>
      </div>
    </div>
  );
}
