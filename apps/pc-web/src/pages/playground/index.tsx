import { useState } from 'react';

import { SignupForm, type SignupPayload } from '@/features/auth/ui/signup-form';

export function PlaygroundPage() {
  const [payload, setPayload] = useState<SignupPayload | null>(null);
  const handleSubmit = (nextPayload: SignupPayload) => {
    setPayload(nextPayload);
  };

  return (
    <div className="h-full overflow-y-auto bg-[#131314] p-8 text-[#e3e3e3]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold">Playground</h1>
          <p className="mt-2 text-sm text-[#9aa0a6]">회원가입 폼 샘플</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,560px)_minmax(360px,1fr)]">
          <section className="rounded-lg border border-[#2f3033] bg-[#1b1c1f] p-6 shadow-sm">
            <SignupForm onSubmit={handleSubmit} />
          </section>

          <section className="rounded-lg border border-[#2f3033] bg-[#1b1c1f] p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b border-[#2f3033] pb-3">
              <h2 className="text-base font-semibold">Submit Payload</h2>
              <span className="text-xs text-[#9aa0a6]">{payload ? 'SUCCESS' : 'EMPTY'}</span>
            </div>
            <pre className="min-h-72 overflow-auto rounded-md bg-[#101113] p-4 text-sm leading-6 text-[#c4d7ff]">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </section>
        </div>
      </div>
    </div>
  );
}
