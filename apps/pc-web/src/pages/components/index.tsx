const componentSamples = ['Button', 'Input', 'Select', 'Modal'];

export function ComponentsPage() {
  return (
    <div className="h-full overflow-y-auto bg-background p-8 text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold">Components</h1>
          <p className="mt-2 text-sm text-muted">컴포넌트 샘플</p>
        </div>

        <section className="rounded-lg border border-border bg-surface p-6 shadow-sm">
          <div className="mb-4 border-b border-border pb-3">
            <h2 className="text-base font-semibold">Components</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {componentSamples.map((name) => (
              <div key={name} className="rounded-md border border-border bg-background-deep p-4">
                <span className="text-sm font-medium text-accent-subtle">{name}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
