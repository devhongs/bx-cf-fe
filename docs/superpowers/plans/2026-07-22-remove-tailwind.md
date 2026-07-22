# Tailwind Removal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove Tailwind CSS and `tailwind-merge` from every app and shared package while preserving the current UI, behavior, theme variables, and public component APIs.

**Architecture:** Move component and screen styling into adjacent CSS Modules, keep only reset/theme/app foundations global, and use CSS custom properties for runtime values that must originate in TSX. Add a repository policy checker first so the current Tailwind and unsupported inline-style surface is observed failing, then drive it to zero before removing build dependencies.

**Tech Stack:** React 19, TypeScript, Vite 8, CSS Modules, plain CSS, CSS cascade layers, CSS custom properties, clsx, Vitest, Node test runner, Turbo, Biome.

## Global Constraints

- Preserve the current PC, Mobile, and Admin visual result and component behavior; this is not a redesign.
- Keep `packages/shared/src/shared/styles/theme.css` CSS variable names and values.
- Keep `apps/mobile-web/src/shared/styles/bxui_template.css` unchanged.
- Follow existing naming: `Component.tsx` uses `Component.module.css`; `index.tsx` uses `index.module.css`; existing intentionally shared Module imports remain shared.
- Every file with an existing inline style must own or already import a CSS Module. Static declarations move fully to CSS; runtime values are passed only as CSS custom properties.
- Do not change routing, API, state, form data flow, accessibility attributes, or public props.
- Final source and package metadata must contain no `tailwindcss`, `@tailwindcss/vite`, `tailwind-merge`, `@apply`, `@source`, `@theme`, or `@custom-variant` usage.

---

### Task 1: Add the CSS policy regression guard

**Files:**
- Create: `scripts/check-css-policy.mjs`
- Create: `scripts/check-css-policy.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `findCssPolicyViolations(rootDir): Promise<Array<{ file: string; rule: string }>>`
- Produces: CLI exit code `1` with one line per violation, or exit code `0` with `CSS policy check passed.`

- [ ] **Step 1: Write the failing scanner test**

Create fixtures in a temporary directory and assert detection of Tailwind dependencies/directives/imports and a TSX inline style without an adjacent Module. Also assert that a TSX file importing its adjacent Module and passing only a CSS custom property is accepted.

```js
test('reports Tailwind and unsupported inline style usage', async () => {
  const violations = await findCssPolicyViolations(fixtureRoot);
  assert.deepEqual(
    new Set(violations.map(({ rule }) => rule)),
    new Set(['tailwind-dependency', 'tailwind-directive', 'tailwind-class', 'inline-style-module']),
  );
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test scripts/check-css-policy.test.mjs`

Expected: FAIL because `check-css-policy.mjs` does not exist.

- [ ] **Step 3: Implement the scanner and CLI**

Scan source and package files while excluding `.git`, `node_modules`, build output, reports, generated docs, the policy test fixtures, and historical `docs/superpowers`. Detect package/import/directive usage, known Tailwind utility syntax in TSX, and inline-style files lacking an adjacent or imported Module. Do not flag CSS custom-property runtime values when the file imports a Module.

```js
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const violations = await findCssPolicyViolations(process.cwd());
  for (const item of violations) console.error(`${item.file}: ${item.rule}`);
  process.exitCode = violations.length === 0 ? 0 : 1;
}
```

- [ ] **Step 4: Verify the unit test passes and repository check fails for the expected current state**

Run: `node --test scripts/check-css-policy.test.mjs`

Expected: PASS.

Run: `node scripts/check-css-policy.mjs`

Expected: FAIL and list current Tailwind/inline-style violations.

- [ ] **Step 5: Add the root command**

Add `"check:css-policy": "node scripts/check-css-policy.mjs"` to root scripts.

### Task 2: Replace shared global Tailwind foundations and primitive UI

**Files:**
- Create: `packages/shared/src/shared/styles/reset.css`
- Modify: `packages/shared/src/shared/styles/theme.css`
- Modify: `apps/pc-web/src/shared/styles/styles.css`
- Modify: `apps/mobile-web/src/shared/styles/styles.css`
- Modify: `apps/admin-portal/src/shared/styles/styles.css`
- Modify: `packages/shared/src/shared/ui/lib/cn.ts`
- Modify: `packages/shared/src/shared/lib/utils/cn.ts`
- Create/Modify: `packages/shared/src/shared/ui/button/Button.module.css`, `Button.tsx`
- Create/Modify: `packages/shared/src/shared/ui/input/Input.module.css`, `Input.tsx`
- Create/Modify: `packages/shared/src/shared/ui/textarea/Textarea.module.css`, `Textarea.tsx`
- Create/Modify: `packages/shared/src/shared/ui/select/Select.module.css`, `Select.tsx`
- Create/Modify: `packages/shared/src/shared/ui/dialog/Dialog.module.css`, `index.tsx`
- Create/Modify: `packages/shared/src/shared/ui/drawer/Drawer.module.css`, `index.tsx`
- Create/Modify: `packages/shared/src/shared/ui/popover/Popover.module.css`, `index.tsx`
- Modify: `packages/shared/src/shared/ui/modal/Modal.module.css`, `Modal.tsx`
- Create/Modify: `packages/shared/src/shared/form/Form.module.css`, `Form.tsx`
- Create/Modify: `packages/shared/src/shared/form/FormItem.module.css`, `FormItem.tsx`

**Interfaces:**
- Keeps all existing component props and exports.
- `cn(...inputs)` continues returning a string but delegates only to `clsx`.
- Runtime open/closed states remain driven by Radix/Vaul `data-state` attributes.

- [ ] **Step 1: Add explicit low-priority reset and remove Tailwind theme directives**

Create `@layer reset { ... }` rules covering box sizing, margin/padding/border reset, inherited form font/color, heading/list/link defaults, image display, and hidden elements. Import reset and theme from each app global stylesheet; remove `@import "tailwindcss"` and `@source`. Preserve existing app element rules.

- [ ] **Step 2: Convert shared primitives to Module classes**

Use Module selectors for base, variant, size, pseudo state, descendant SVG, `data-state`, responsive, and visually-hidden behavior. Button mapping remains:

```tsx
className={cn(styles.root, styles[variant], styles[`size-${size}`], className)}
```

Dialog and Drawer state selectors use forms such as:

```css
.content[data-state='open'] { opacity: 1; transform: translate(-50%, -50%) scale(1); }
.content[data-state='closed'] { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
```

- [ ] **Step 3: Replace Tailwind merge and convert form layout helpers**

Keep both existing `cn` import paths but return `clsx(inputs)`. Convert form spacing, labels, descriptions, errors, required marks, Modal slots, and Select icon layout to Module classes.

- [ ] **Step 4: Run shared tests and type check**

Run: `pnpm --filter @bx/shared test`

Expected: all shared tests PASS.

Run: `pnpm --filter @bx/shared check`

Expected: TypeScript exits 0.

### Task 3: Convert shared entity Modules and inline-style owners

**Files:**
- Modify: `packages/shared/src/entities/account/ui/account-card/index.module.css`
- Modify: `packages/shared/src/entities/alarm/ui/alarm-card/index.module.css`
- Modify: `packages/shared/src/entities/menu/ui/menu-item/index.module.css`
- Modify: `packages/shared/src/entities/product/ui/product-item/index.module.css`, `index.tsx`
- Modify: `packages/shared/src/entities/user/ui/user-avatar/UserAvatar.module.css`, `UserAvatar.tsx`
- Modify: `packages/shared/src/entities/user/ui/user-avatar copy/UserAvatar.module.css`, `UserAvatar.tsx`
- Modify: `packages/shared/src/shared/ui/icon-button/IconButton.module.css`, `IconButton.tsx`
- Modify: `packages/shared/src/shared/ui/page/Page.module.css`
- Modify: `packages/shared/src/shared/ui/data-table/DataTable.module.css`, `DataTable.tsx`
- Modify: `packages/shared/src/shared/ui/toast/Toaster.module.css`, `Toaster.tsx`

**Interfaces:**
- Entity and shared component props remain unchanged.
- Runtime values use typed custom properties such as `--avatar-size`, `--product-color`, `--column-width`, and `--icon-label-color`.

- [ ] **Step 1: Translate all shared `@apply` declarations to explicit CSS**

Map Tailwind spacing using the default scale (`1` = 4px), preserve arbitrary values exactly, and rewrite hover/focus/disabled variants as pseudo selectors. Remove every Module-level Tailwind import.

- [ ] **Step 2: Move inline properties behind Module-owned custom properties**

Use a typed style object only to supply runtime variables:

```tsx
style={{ '--avatar-size': `${size}px` } as React.CSSProperties}
```

and consume them in CSS:

```css
.image { width: var(--avatar-size); height: var(--avatar-size); }
```

Keep Toaster's caller-supplied third-party style passthrough, but move all component-owned static defaults to `Toaster.module.css`.

- [ ] **Step 3: Run shared test and check again**

Run: `pnpm --filter @bx/shared test && pnpm --filter @bx/shared check`

Expected: both commands exit 0.

### Task 4: Convert all PC Tailwind and inline styles

**Files:**
- Create/Modify: `apps/pc-web/src/routes/__root.module.css`, `__root.tsx`
- Create/Modify: `apps/pc-web/src/app/providers/modal/ModalContainer.module.css`, `ModalContainer.tsx`
- Create/Modify: `apps/pc-web/src/routes/(page)/_page.module.css`, `_page.tsx`
- Create/Modify: `apps/pc-web/src/routes/(modal)/setting/index.module.css`, `index.tsx`
- Create/Modify: `apps/pc-web/src/routes/(modal)/user-info/index.module.css`, `index.tsx`
- Create/Modify: `apps/pc-web/src/routes/(modal)/transfer/index.module.css`, `index.tsx`
- Create/Modify: `apps/pc-web/src/routes/(modal)/alarm-list/index.module.css`, `index.tsx`
- Create/Modify: `apps/pc-web/src/routes/(modal)/account-detail/index.module.css`, `index.tsx`
- Create/Modify: `apps/pc-web/src/pages/alarm/index.module.css`, `index.tsx`
- Create/Modify: `apps/pc-web/src/pages/asset/index.module.css`, `index.tsx`
- Create/Modify: `apps/pc-web/src/pages/product/index.module.css`, `index.tsx`
- Create/Modify: `apps/pc-web/src/pages/components/index.module.css`, `index.tsx`
- Create/Modify: `apps/pc-web/src/pages/form/index.module.css`, `index.tsx`
- Create/Modify: `apps/pc-web/src/features/auth/ui/signup-form/SignupForm.module.css`, `SignupForm.tsx`
- Modify: `apps/pc-web/src/features/dashboard/ui/dashboard-cards/DashboardCards.module.css`, `DashboardCards.tsx`

**Interfaces:**
- Route behavior, modal props, form submission, and responsive layout stay unchanged.
- Modal stack z-index and dashboard card colors are Module properties backed by custom variables.

- [ ] **Step 1: Convert route shells and modal provider**

Move utility strings to named Module classes, preserving fixed/flex layout and token colors. `ModalContainer` supplies only `--modal-z-index`; `__root` moves all static gradient and loading styles into its Module.

- [ ] **Step 2: Convert modal route content**

Create one `index.module.css` per modal route, translating layout, state, token colors, inputs, buttons, hover/focus, and disabled rules.

- [ ] **Step 3: Convert PC pages and signup form**

Reuse repeated page-shell declarations through grouped selectors inside each local Module rather than introducing a new shared abstraction. Keep the existing responsive breakpoints at 768px and 1024px.

- [ ] **Step 4: Run PC tests and check**

Run: `pnpm --filter pc-web test && pnpm --filter pc-web check`

Expected: both commands exit 0.

### Task 5: Convert all Mobile Tailwind, `@apply`, and inline styles

**Files:**
- Modify: all 12 existing Mobile Modules containing `@apply` under `widgets/layout`, `features`, and `routes/(modal)`
- Create/Modify: `apps/mobile-web/src/routes/(page)/_page.module.css`, `_page.tsx`
- Create/Modify: `apps/mobile-web/src/routes/(page)/_page.main.module.css`, `_page.main.tsx`
- Create/Modify: `apps/mobile-web/src/routes/(page)/_page.menu.module.css`, `_page.menu.tsx`
- Create/Modify: `apps/mobile-web/src/features/ai-search/ui/AiSearchCard.module.css`, `AiSearchCard.tsx`
- Create/Modify: `apps/mobile-web/src/features/error/ui/not-found/index.module.css`, `index.tsx`
- Create/Modify: `apps/mobile-web/src/app/providers/modal/ModalContainer.module.css`, `ModalContainer.tsx`

**Interfaces:**
- Header and Footer `className` extension props remain supported with `cn`/`clsx`.
- Mobile modal z-index uses `--modal-z-index`.
- Existing `bxui_template.css` remains unchanged and loaded before app `styles.css`.

- [ ] **Step 1: Translate all Mobile `@apply` Modules**

Replace layout, spacing, typography, color, transition, hover, focus, disabled, arbitrary values, viewport calculations, and nested selectors with explicit CSS. Preserve `!important` only where the current Tailwind class used the `!` modifier to overcome legacy template rules.

- [ ] **Step 2: Convert page shell, search, error, and modal TSX utilities**

Use local Module classes and preserve current backdrop filter, gradient, fixed positions, placeholder styles, group hover, and responsive dimensions. Remove the two static inline declarations from not-found and place them in the Module.

- [ ] **Step 3: Run Mobile tests and check**

Run: `pnpm --filter mobile-web test && pnpm --filter mobile-web check`

Expected: both commands exit 0.

### Task 6: Finish Admin conversion and remove Tailwind dependencies

**Files:**
- Create/Modify: `apps/admin-portal/src/routes/__root.module.css`, `__root.tsx`
- Modify: `apps/admin-portal/src/pages/admin-page.module.css`
- Modify: `apps/admin-portal/src/pages/profile/index.tsx`
- Modify: `apps/admin-portal/src/pages/dashboard/index.tsx`
- Modify: `apps/pc-web/vite.config.ts`
- Modify: `apps/mobile-web/vite.config.ts`
- Modify: `apps/admin-portal/vite.config.ts`
- Modify: `package.json`
- Modify: `packages/shared/package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Admin page styling continues using the established shared `admin-page.module.css` pattern.
- Dashboard progress uses `--progress`; profile spacing becomes a named Module class.

- [ ] **Step 1: Convert Admin root and inline declarations**

Move the root loading utility class into `__root.module.css`. Add `profileActions` and progress-fill rules to `admin-page.module.css`; pass only `--progress` from dashboard TSX.

- [ ] **Step 2: Remove Tailwind from Vite and package metadata**

Delete the Tailwind import/plugin call from all Vite configs and remove `@tailwindcss/vite`, `tailwindcss`, and `tailwind-merge` from package manifests. Run `pnpm install --lockfile-only` to update the lockfile.

- [ ] **Step 3: Drive the policy check GREEN**

Run: `node scripts/check-css-policy.mjs`

Expected: `CSS policy check passed.`

- [ ] **Step 4: Run Admin tests and check**

Run: `pnpm --filter admin-portal test && pnpm --filter admin-portal check`

Expected: both commands exit 0.

### Task 7: Repository-wide verification and visual regression review

**Files:**
- Modify only files required by failures proven during this task.

**Interfaces:**
- Produces a repository with no Tailwind policy violations and passing test/check/build commands.

- [ ] **Step 1: Format and lint changed files**

Run: `pnpm exec biome check --write` with the exact changed source, CSS, script, and documentation paths.

Expected: exit 0.

- [ ] **Step 2: Run static and unit verification**

Run: `pnpm check:css-policy && pnpm test && pnpm check`

Expected: all commands exit 0; the pre-existing token-storage stderr remains test fixture output rather than a failure.

- [ ] **Step 3: Build all three applications**

Run: `pnpm build`

Expected: PC, Mobile, Admin, and shared build tasks exit 0 with no Tailwind processing.

- [ ] **Step 4: Verify source inventory and diff quality**

Run `rg` checks for Tailwind dependencies/directives and inspect `git diff --check`, `git status --short`, and the complete diff. Expected: zero Tailwind hits outside historical design/plan docs, no whitespace errors, and only task-related changes.

- [ ] **Step 5: Visually review representative routes**

Use local app servers and available browser automation to inspect login/layout, PC modal/form, Admin dashboard/drawer, Mobile shell/footer/search/transfer, shared alert/toast, focus/hover/disabled states, and responsive widths. Record any environment-only routes that cannot be loaded and use existing Playwright coverage plus CSS inspection for those paths.
