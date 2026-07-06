const componentSamples = ['Button', 'Input', 'Select', 'Modal'];

export function ComponentsPage() {
  return (
    <div className="h-full overflow-y-auto bg-[#131314] p-8 text-[#e3e3e3]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold">Components</h1>
          <p className="mt-2 text-sm text-[#9aa0a6]">컴포넌트 샘플</p>
        </div>

        <section className="rounded-lg border border-[#2f3033] bg-[#1b1c1f] p-6 shadow-sm">
          <div className="mb-4 border-b border-[#2f3033] pb-3">
            <h2 className="text-base font-semibold">Components</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {componentSamples.map((name) => (
              <div key={name} className="rounded-md border border-[#2f3033] bg-[#101113] p-4">
                <span className="text-sm font-medium text-[#c4d7ff]">{name}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
