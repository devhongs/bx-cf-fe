# Admin Portal MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the admin portal MVP with pc-web conventions, generated schema based CRUD entities, auth-protected routes, and the approved B dark workspace design direction.

**Architecture:** `apps/admin-portal` mirrors `apps/pc-web` for Vite, TanStack Router, React Query, auth guard, and FSD app layout. CRUD API/type/query code lives under `packages/shared/src/entities` and follows generated schema paths where present. Admin theme tokens stay local to `apps/admin-portal`.

**Tech Stack:** React 19, TypeScript, Vite, TanStack Router, TanStack Query, React Hook Form, lucide-react, shared `httpService`, Vitest, Testing Library.

## Global Constraints

- Follow pc-web conventions unless there is a specific admin-only reason to diverge.
- Use generated schema under `packages/shared/src/shared/api/*.schema.d.ts` as the API path/type source of truth.
- Do not run base-info bootstrapping in admin protected routes.
- Treat missing CRUD endpoints as planned backend additions and keep API wrappers predictable.
- Use `DELETE` for logical delete, because backend will add delete APIs.
- Manage admin and service users through one user API and distinguish them by `userType`.
- Keep admin light/dark theme tokens local to `apps/admin-portal`.
- Put TanStack Query code in `model/*.queries.ts`, API calls in `api/*.api.ts`, types in `model/*.type.ts`.
- Query keys use the object pattern: `xxxQueryKeys = { all, list, detail, ... }`.

---

### Task 1: Admin App Foundation

**Files:**
- Modify: `apps/admin-portal/package.json`
- Modify: `apps/admin-portal/vite.config.ts`
- Modify: `apps/admin-portal/src/main.tsx`
- Create: `apps/admin-portal/src/queryClient.ts`
- Create: `apps/admin-portal/src/shared/styles/styles.css`
- Create: `apps/admin-portal/src/shared/styles/admin-theme.css`
- Create: `apps/admin-portal/src/shared/guards/requireAuth.ts`
- Create: `apps/admin-portal/src/routes/__root.tsx`
- Create: `apps/admin-portal/src/routes/(auth)/_auth.tsx`
- Create: `apps/admin-portal/src/routes/(auth)/_auth.login.tsx`
- Create: `apps/admin-portal/src/routes/(page)/_page.tsx`
- Create: `apps/admin-portal/src/routes/index.tsx`
- Test: `apps/admin-portal/src/widgets/layout/sidebar/AdminSidebar.test.tsx`

**Interfaces:**
- Produces `requireAuth(args): Promise<object>` that redirects to `/login` when no valid session exists.
- Produces admin route shell with no `ensureBaseInfoBootstrapped` call.

- [ ] Add dependencies and Vite plugins to match pc-web with admin port/base.
- [ ] Add a failing sidebar navigation test.
- [ ] Implement admin router bootstrap and protected layout.
- [ ] Verify `pnpm --filter admin-portal check` passes.

### Task 2: Generated Schema CRUD Entities

**Files:**
- Create: `packages/shared/src/entities/common-code/api/common-code.api.test.ts`
- Create: `packages/shared/src/entities/common-code/api/common-code.api.ts`
- Create: `packages/shared/src/entities/common-code/model/common-code.queries.test.ts`
- Create: `packages/shared/src/entities/common-code/model/common-code.queries.ts`
- Create: `packages/shared/src/entities/common-code/model/common-code.type.ts`
- Create: `packages/shared/src/entities/common-code/index.ts`
- Modify: `packages/shared/src/entities/menu/api/menu.api.test.ts`
- Modify: `packages/shared/src/entities/menu/api/menu.api.ts`
- Modify: `packages/shared/src/entities/menu/model/menu.queries.test.ts`
- Modify: `packages/shared/src/entities/menu/model/menu.queries.ts`
- Modify: `packages/shared/src/entities/menu/model/menu.type.ts`
- Create: `packages/shared/src/entities/user/api/user.api.test.ts`
- Create: `packages/shared/src/entities/user/api/user.api.ts`
- Create: `packages/shared/src/entities/user/model/user.queries.test.ts`
- Create: `packages/shared/src/entities/user/model/user.queries.ts`
- Create: `packages/shared/src/entities/user/model/user.type.ts`
- Modify: `packages/shared/src/entities/user/index.ts`
- Modify: `packages/shared/src/index.ts`

**Interfaces:**
- Produces common code group/code API wrappers using `/system/common-codes/...` generated schema paths.
- Produces menu API wrappers using `/system/menus/...` generated schema paths.
- Produces user API wrappers for planned `/users/...` endpoints with one user model and `userType`.

- [ ] Add failing API path tests for generated-schema paths.
- [ ] Add failing query key tests for object pattern.
- [ ] Implement minimal API/type/query code.
- [ ] Verify `pnpm --filter @bx/shared check` and targeted tests pass.

### Task 3: Admin Workspace UI

**Files:**
- Create: `apps/admin-portal/src/widgets/layout/sidebar/AdminSidebar.tsx`
- Create: `apps/admin-portal/src/widgets/layout/sidebar/AdminSidebar.module.css`
- Create: `apps/admin-portal/src/widgets/layout/sidebar/index.ts`
- Create: `apps/admin-portal/src/widgets/layout/header/AdminHeader.tsx`
- Create: `apps/admin-portal/src/widgets/layout/header/AdminHeader.module.css`
- Create: `apps/admin-portal/src/widgets/layout/header/index.ts`
- Create: `apps/admin-portal/src/shared/ui/admin-data-table/AdminDataTable.tsx`
- Create: `apps/admin-portal/src/shared/ui/admin-data-table/AdminDataTable.module.css`
- Create: `apps/admin-portal/src/shared/ui/admin-filter-bar/AdminFilterBar.tsx`
- Create: `apps/admin-portal/src/shared/ui/admin-filter-bar/AdminFilterBar.module.css`
- Create: `apps/admin-portal/src/shared/ui/admin-drawer/AdminDrawer.tsx`
- Create: `apps/admin-portal/src/shared/ui/admin-drawer/AdminDrawer.module.css`

**Interfaces:**
- Produces reusable admin table/filter/drawer components used by code/menu/user pages.
- Sidebar exposes `/dashboard`, `/codes`, `/menus`, `/users`, `/profile`.

- [ ] Add failing sidebar test for route navigation.
- [ ] Implement B dark workspace shell and reusable table/filter/drawer components.
- [ ] Verify admin typecheck passes.

### Task 4: Admin Pages

**Files:**
- Create: `apps/admin-portal/src/pages/login/index.tsx`
- Create: `apps/admin-portal/src/pages/dashboard/index.tsx`
- Create: `apps/admin-portal/src/pages/codes/index.tsx`
- Create: `apps/admin-portal/src/pages/menus/index.tsx`
- Create: `apps/admin-portal/src/pages/users/index.tsx`
- Create: `apps/admin-portal/src/pages/profile/index.tsx`
- Create: `apps/admin-portal/src/routes/(page)/_page.dashboard.tsx`
- Create: `apps/admin-portal/src/routes/(page)/_page.codes.tsx`
- Create: `apps/admin-portal/src/routes/(page)/_page.menus.tsx`
- Create: `apps/admin-portal/src/routes/(page)/_page.users.tsx`
- Create: `apps/admin-portal/src/routes/(page)/_page.profile.tsx`
- Modify: `apps/admin-portal/e2e/basic.spec.ts`

**Interfaces:**
- Produces page-level screens for login, dashboard, code CRUD, menu CRUD, user CRUD, and profile.
- Pages use filter UI only; API filtering can be connected as backend contracts settle.

- [ ] Add page smoke expectations.
- [ ] Implement route pages using shared entity queries and static fallbacks for empty API data.
- [ ] Verify check/build/e2e smoke path.

### Task 5: Verification

**Files:**
- No new files.

**Interfaces:**
- Confirms the admin MVP compiles and the shared API wrappers follow generated schema paths.

- [ ] Run `pnpm --filter @bx/shared check`.
- [ ] Run `pnpm --filter admin-portal check`.
- [ ] Run relevant Vitest tests.
- [ ] Run `pnpm build:debug:admin`.
