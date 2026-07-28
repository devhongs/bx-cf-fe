# Nest Environment Mode Rename Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the local backend Vite mode name `spring` with `nest` across environment files, commands, focused tests, and runtime documentation.

**Architecture:** Keep the existing environment loader and Vite proxy behavior unchanged. Rename only the mode-facing inputs—physical environment files, root development scripts, focused test expectations, and developer-facing documentation—so mode `nest` still proxies `/channel/backend/api/v1` to `http://127.0.0.1:18081`.

**Tech Stack:** Vite 8 modes and `loadEnv`, pnpm/Turborepo scripts, Vitest, Markdown.

## Global Constraints

- Remove the old `spring` mode, scripts, and environment files; do not keep compatibility aliases.
- Do not change `http://192.168.110.217`, `http://127.0.0.1:18081`, `http://127.0.0.1:3333`, or `/channel/backend/api/v1`.
- Do not alter entity API wrappers, payload contracts, or generated OpenAPI types.
- Do not regenerate `landing/assets/fe.readme.html`.
- Do not globally replace unrelated historical or architecture-level Spring references.

---

### Task 1: Rename the executable environment contract

**Files:**
- Modify: `scripts/vite-api-environment.test.mjs`
- Modify: `scripts/vite-config-api-proxy.test.mjs`
- Modify: `scripts/backend-environment-scripts.test.mjs`
- Rename: `apps/pc-web/.env.spring` → `apps/pc-web/.env.nest`
- Rename: `apps/admin-portal/.env.spring` → `apps/admin-portal/.env.nest`
- Rename: `apps/mobile-web/.env.spring` → `apps/mobile-web/.env.nest`
- Modify: `package.json`

**Interfaces:**
- Consumes: `loadApiEnvironment({ mode, envDir })` and existing app Vite configs.
- Produces: mode `nest`, commands `dev:{pc|admin|mobile}:nest`, and three `.env.nest` files.

- [ ] **Step 1: Change focused tests to require `nest`**

In `scripts/vite-api-environment.test.mjs`, replace the local backend case with:

```js
it.each(appDirs)('loads nest mode for %s', (envDir) => {
  expect(loadApiEnvironment({ mode: 'nest', envDir })).toEqual({
    mode: 'nest',
    apiUrl: '/channel/backend/api/v1',
    proxyTarget: 'http://127.0.0.1:18081',
  });
});
```

Update the diagnostic assertion to expect:

```text
[vite-api] mode=nest apiUrl=/channel/backend/api/v1 proxyTarget=http://127.0.0.1:18081
```

In `scripts/vite-config-api-proxy.test.mjs`, resolve mode `nest` and retain the expected proxy target `http://127.0.0.1:18081`.

In `scripts/backend-environment-scripts.test.mjs`, replace the three `spring` entries with:

```js
'dev:pc:nest': 'turbo dev --filter=pc-web -- --mode nest',
'dev:admin:nest': 'turbo dev --filter=admin-portal -- --mode nest',
'dev:mobile:nest': 'turbo dev --filter=mobile-web -- --mode nest',
```

- [ ] **Step 2: Run focused tests and verify RED**

Run:

```bash
./node_modules/.bin/vitest run scripts/vite-api-environment.test.mjs scripts/vite-config-api-proxy.test.mjs scripts/backend-environment-scripts.test.mjs
```

Expected: failures show `.env.nest` is missing, Vite mode `nest` falls back to the remote target, and `dev:<app>:nest` scripts are undefined.

- [ ] **Step 3: Rename the physical environment files**

Rename each `.env.spring` file to `.env.nest` without changing its contents:

```dotenv
VITE_API_URL=/channel/backend/api/v1
VITE_API_PROXY_TARGET=http://127.0.0.1:18081
```

- [ ] **Step 4: Rename the root development commands**

In `package.json`, replace:

```json
"dev:pc:spring": "turbo dev --filter=pc-web -- --mode spring",
"dev:mobile:spring": "turbo dev --filter=mobile-web -- --mode spring",
"dev:admin:spring": "turbo dev --filter=admin-portal -- --mode spring"
```

with:

```json
"dev:pc:nest": "turbo dev --filter=pc-web -- --mode nest",
"dev:mobile:nest": "turbo dev --filter=mobile-web -- --mode nest",
"dev:admin:nest": "turbo dev --filter=admin-portal -- --mode nest"
```

- [ ] **Step 5: Run focused tests and verify GREEN**

Run:

```bash
./node_modules/.bin/vitest run scripts/vite-api-environment.test.mjs scripts/vite-config-api-proxy.test.mjs scripts/backend-environment-scripts.test.mjs
```

Expected: 25 tests pass.

- [ ] **Step 6: Verify command forwarding**

Run:

```bash
pnpm dev:pc:nest --help
pnpm dev:admin:nest --help
pnpm dev:mobile:nest --help
```

Expected: each app invokes Vite 8 with `--mode nest`.

- [ ] **Step 7: Commit the executable rename**

```bash
git add package.json scripts/vite-api-environment.test.mjs scripts/vite-config-api-proxy.test.mjs scripts/backend-environment-scripts.test.mjs apps/pc-web/.env.nest apps/admin-portal/.env.nest apps/mobile-web/.env.nest apps/pc-web/.env.spring apps/admin-portal/.env.spring apps/mobile-web/.env.spring
git commit -m "refactor: rename local backend mode to Nest"
```

---

### Task 2: Update runtime documentation and verify the repository

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: the `dev:<app>:nest` commands and `.env.nest` files from Task 1.
- Produces: copy-pasteable Nest mode instructions for developers.

- [ ] **Step 1: Update README runtime terminology**

Replace local mode examples and the environment table so they use:

```text
pnpm dev:pc:nest
pnpm dev:mobile:nest
pnpm dev:admin:nest
.env.nest
.env.nest.local
```

Describe `nest` as the local Nest backend at `http://127.0.0.1:18081`. Keep remote and production targets unchanged.

- [ ] **Step 2: Check that executable `spring` mode references are gone**

Run:

```bash
rg -n '"dev:(pc|admin|mobile):spring"|--mode spring|\.env\.spring' package.json scripts apps README.md
```

Expected: no matches.

- [ ] **Step 3: Run focused formatting and tests**

Run:

```bash
./node_modules/.bin/biome check README.md package.json scripts/vite-api-environment.test.mjs scripts/vite-config-api-proxy.test.mjs scripts/backend-environment-scripts.test.mjs
./node_modules/.bin/vitest run scripts/vite-api-environment.test.mjs scripts/vite-config-api-proxy.test.mjs scripts/backend-environment-scripts.test.mjs
git diff --check
```

Expected: Biome passes, 25 tests pass, and `git diff --check` exits 0.

- [ ] **Step 4: Run repository verification**

Run:

```bash
pnpm check
pnpm lint
```

Expected: both commands exit 0.

- [ ] **Step 5: Verify protected paths and worktree state**

Run:

```bash
git diff --name-only -- packages/shared/src/shared/api landing/assets
git status --short
```

Expected: generated API and landing assets are unchanged; status contains only intended README changes before commit.

- [ ] **Step 6: Commit documentation**

```bash
git add README.md
git commit -m "docs: rename local backend mode to Nest"
```
