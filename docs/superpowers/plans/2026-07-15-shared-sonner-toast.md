# Shared Sonner Toast Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a reusable Sonner toast interface to `@bx/shared` and make it available in the PC and mobile applications.

**Architecture:** The shared package owns a thin Sonner wrapper and re-exports the imperative toast API. Each application mounts one shared toaster at its existing React root, leaving current alert call sites unchanged.

**Tech Stack:** React 19, TypeScript, Sonner, Vitest, Testing Library, pnpm

## Global Constraints

- Keep existing `alert(...)` behavior unchanged.
- Do not mount the toaster in admin routes.
- Do not modify unrelated presentation assets or existing uncommitted files.
- Do not create a git commit unless the user requests one.

---

### Task 1: Shared Toast Interface

**Files:**
- Create: `packages/shared/src/shared/ui/toast/Toaster.test.tsx`
- Create: `packages/shared/src/shared/ui/toast/Toaster.tsx`
- Create: `packages/shared/src/shared/ui/toast/Toaster.module.css`
- Create: `packages/shared/src/shared/ui/toast/index.ts`
- Modify: `packages/shared/src/shared/ui/index.ts`
- Modify: `packages/shared/package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes: Sonner's `Toaster` component and `toast` function.
- Produces: `Toaster(props: ComponentProps<typeof SonnerToaster>)` and the re-exported `toast` function from `@bx/shared`.

- [x] **Step 1: Add the Sonner package to `@bx/shared`**

Run: `pnpm add sonner --filter @bx/shared`

Expected: `packages/shared/package.json` and `pnpm-lock.yaml` list Sonner.

- [x] **Step 2: Write the failing wrapper test**

```tsx
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Toaster } from './Toaster';

afterEach(cleanup);

describe('Toaster', () => {
  it('renders the Sonner toaster region', () => {
    render(<Toaster />);

    expect(screen.getByLabelText('Notifications alt+T')).not.toBeNull();
  });
});
```

- [x] **Step 3: Run the focused test and confirm RED**

Run: `pnpm exec vitest run packages/shared/src/shared/ui/toast/Toaster.test.tsx --environment jsdom`

Expected: FAIL because `./Toaster` does not exist.

- [x] **Step 4: Implement and export the wrapper**

```tsx
import type { ComponentProps } from 'react';
import { Toaster as SonnerToaster } from 'sonner';

export type ToasterProps = ComponentProps<typeof SonnerToaster>;

export function Toaster(props: ToasterProps) {
  return <SonnerToaster closeButton position="bottom-center" theme="dark" {...props} />;
}
```

```ts
export { toast } from 'sonner';
export * from './Toaster';
```

Add `export * from './toast';` to the shared UI barrel.

- [x] **Step 5: Run the focused test and confirm GREEN**

Run: `pnpm exec vitest run packages/shared/src/shared/ui/toast/Toaster.test.tsx --environment jsdom`

Expected: PASS.

### Task 2: Application Root Mounts

**Files:**
- Modify: `apps/pc-web/src/main.tsx`
- Modify: `apps/mobile-web/src/main.tsx`

**Interfaces:**
- Consumes: `Toaster` exported by `@bx/shared`.
- Produces: One mounted Sonner toaster per application runtime.

- [x] **Step 1: Import `Toaster` in both application roots**

Update each shared import to include `Toaster`.

- [x] **Step 2: Render one toaster beside the router provider**

```tsx
<QueryClientProvider client={queryClient}>
  <RouterProvider router={router} />
  <Toaster />
</QueryClientProvider>
```

- [x] **Step 3: Run type checks**

Run: `pnpm --filter @bx/shared check && pnpm --filter pc-web check && pnpm --filter mobile-web check`

Expected: All commands exit with status 0.

- [x] **Step 4: Run production builds**

Run: `pnpm --filter pc-web build && pnpm --filter mobile-web build`

Expected: Both commands exit with status 0.
