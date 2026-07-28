# Backend Environment Modes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** PC, Admin, Mobile 앱이 소스 수정 없이 `remote`, `spring`, `mock` Vite mode를 선택해 해당 백엔드에 연결되게 한다.

**Architecture:** 앱별 `.env.<mode>` 파일이 런타임 API URL과 개발 프록시 목적지를 선언한다. 공용 Vite 환경 해석기는 mode 파일에서 `VITE_API_PROXY_TARGET`을 읽고, 세 앱의 Vite 설정은 이 값을 `/channel` 프록시에 사용한다. 루트 package script가 앱과 mode를 명시적으로 조합한다.

**Tech Stack:** Vite 8, TypeScript, Node.js ESM, Vitest, Turbo, pnpm

## Global Constraints

- 지원 mode는 `remote`, `spring`, `mock` 세 개로 고정한다.
- `remote` proxy target은 `http://192.168.110.217`이다.
- `spring` proxy target은 `http://127.0.0.1:18081`이다.
- `mock` API URL은 `http://127.0.0.1:3333`이다.
- `remote`와 `spring`의 `VITE_API_URL`은 `/channel/backend/api/v1`을 유지한다.
- mode를 지정하지 않은 기존 `dev:pc`, `dev:admin`, `dev:mobile` 동작을 유지한다.
- MOCK 서버는 앱 mode script가 자동 시작하지 않으며 기존 `pnpm dev:server`로 별도 실행한다.
- README 변경 후 `landing/assets/fe.readme.html`은 재생성하지 않는다.
- OpenAPI 생성 주소와 앱 런타임 mode는 결합하지 않는다.

## File Map

- Create `scripts/vite-api-environment.mjs`: mode별 프록시 환경을 읽고 기본값 및 시작 로그를 제공한다.
- Create `scripts/vite-api-environment.d.mts`: Vite 설정이 공용 `.mjs` 해석기를 타입 안전하게 import하도록 선언한다.
- Create `scripts/vite-api-environment.test.mjs`: 실제 앱 환경파일과 공용 해석기를 검증한다.
- Create `scripts/vite-config-api-proxy.test.mjs`: 세 Vite 설정이 mode별 proxy target을 사용하는지 검증한다.
- Create `scripts/backend-environment-scripts.test.mjs`: 루트 실행 명령이 올바른 Vite mode를 전달하는지 검증한다.
- Create `apps/{pc-web,admin-portal,mobile-web}/.env.{remote,spring,mock}`: 앱별 물리 환경 설정을 선언한다.
- Modify `apps/{pc-web,admin-portal,mobile-web}/vite.config.ts`: 하드코딩된 proxy target을 공용 환경 해석기로 교체한다.
- Modify `package.json`: 앱·환경별 실행 명령 9개를 추가한다.
- Modify `.gitignore`: `.env.*.local` 개인 덮어쓰기 파일을 제외한다.
- Modify `README.md`: mode별 연결 대상, 실행법, 개인 override, OpenAPI 설정 분리를 문서화한다.

---

### Task 1: Mode Environment Contract

**Files:**
- Create: `scripts/vite-api-environment.test.mjs`
- Create: `scripts/vite-api-environment.mjs`
- Create: `scripts/vite-api-environment.d.mts`
- Create: `apps/pc-web/.env.remote`
- Create: `apps/pc-web/.env.spring`
- Create: `apps/pc-web/.env.mock`
- Create: `apps/admin-portal/.env.remote`
- Create: `apps/admin-portal/.env.spring`
- Create: `apps/admin-portal/.env.mock`
- Create: `apps/mobile-web/.env.remote`
- Create: `apps/mobile-web/.env.spring`
- Create: `apps/mobile-web/.env.mock`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: Vite `loadEnv(mode, envDir, ['VITE_API_URL', 'VITE_API_PROXY_TARGET'])`
- Produces: `loadApiEnvironment({ mode, envDir }): { mode: string; apiUrl: string; proxyTarget: string }`
- Produces: `formatApiEnvironmentLog({ mode, apiUrl, proxyTarget }): string`
- Produces: `DEFAULT_API_PROXY_TARGET = 'http://192.168.110.217'`

- [ ] **Step 1: Write the failing environment contract test**

Create `scripts/vite-api-environment.test.mjs`:

```js
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import {
  DEFAULT_API_PROXY_TARGET,
  formatApiEnvironmentLog,
  loadApiEnvironment,
} from './vite-api-environment.mjs';

const rootDir = resolve(fileURLToPath(new URL('..', import.meta.url)));
const appDirs = ['apps/pc-web', 'apps/admin-portal', 'apps/mobile-web'].map((path) =>
  resolve(rootDir, path),
);

describe('vite API environment', () => {
  it.each(appDirs)('loads remote mode for %s', (envDir) => {
    expect(loadApiEnvironment({ mode: 'remote', envDir })).toEqual({
      mode: 'remote',
      apiUrl: '/channel/backend/api/v1',
      proxyTarget: 'http://192.168.110.217',
    });
  });

  it.each(appDirs)('loads spring mode for %s', (envDir) => {
    expect(loadApiEnvironment({ mode: 'spring', envDir })).toEqual({
      mode: 'spring',
      apiUrl: '/channel/backend/api/v1',
      proxyTarget: 'http://127.0.0.1:18081',
    });
  });

  it.each(appDirs)('loads mock mode for %s', (envDir) => {
    expect(loadApiEnvironment({ mode: 'mock', envDir })).toEqual({
      mode: 'mock',
      apiUrl: 'http://127.0.0.1:3333',
      proxyTarget: DEFAULT_API_PROXY_TARGET,
    });
  });

  it('formats a startup diagnostic without hiding the selected target', () => {
    expect(
      formatApiEnvironmentLog({
        mode: 'spring',
        apiUrl: '/channel/backend/api/v1',
        proxyTarget: 'http://127.0.0.1:18081',
      }),
    ).toBe(
      '[vite-api] mode=spring apiUrl=/channel/backend/api/v1 proxyTarget=http://127.0.0.1:18081',
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
pnpm exec vitest run scripts/vite-api-environment.test.mjs
```

Expected: FAIL because `scripts/vite-api-environment.mjs` does not exist.

- [ ] **Step 3: Add the mode environment files**

Add the same `.env.remote` to all three apps:

```env
VITE_API_URL=/channel/backend/api/v1
VITE_API_PROXY_TARGET=http://192.168.110.217
```

Add the same `.env.spring` to all three apps:

```env
VITE_API_URL=/channel/backend/api/v1
VITE_API_PROXY_TARGET=http://127.0.0.1:18081
```

Add the same `.env.mock` to all three apps:

```env
VITE_API_URL=http://127.0.0.1:3333
```

- [ ] **Step 4: Implement the shared environment loader**

Create `scripts/vite-api-environment.mjs`:

```js
import { loadEnv } from 'vite';

export const DEFAULT_API_PROXY_TARGET = 'http://192.168.110.217';

export const loadApiEnvironment = ({ mode, envDir }) => {
  const env = loadEnv(mode, envDir, ['VITE_API_URL', 'VITE_API_PROXY_TARGET']);
  return {
    mode,
    apiUrl: env.VITE_API_URL ?? '',
    proxyTarget: env.VITE_API_PROXY_TARGET || DEFAULT_API_PROXY_TARGET,
  };
};

export const formatApiEnvironmentLog = ({ mode, apiUrl, proxyTarget }) =>
  `[vite-api] mode=${mode} apiUrl=${apiUrl} proxyTarget=${proxyTarget}`;
```

- [ ] **Step 5: Ignore personal mode overrides**

Append this rule next to the existing `.env.local` entry in `.gitignore`:

```gitignore
.env.*.local
```

- [ ] **Step 6: Run the environment contract test**

Run:

```bash
pnpm exec vitest run scripts/vite-api-environment.test.mjs
```

Expected: 10 tests PASS.

- [ ] **Step 7: Commit the environment contract**

```bash
git add .gitignore scripts/vite-api-environment.mjs scripts/vite-api-environment.test.mjs apps/pc-web/.env.remote apps/pc-web/.env.spring apps/pc-web/.env.mock apps/admin-portal/.env.remote apps/admin-portal/.env.spring apps/admin-portal/.env.mock apps/mobile-web/.env.remote apps/mobile-web/.env.spring apps/mobile-web/.env.mock
git commit -m "feat: add backend environment mode files"
```

---

### Task 2: Vite Proxy Integration

**Files:**
- Create: `scripts/vite-config-api-proxy.test.mjs`
- Modify: `apps/pc-web/vite.config.ts`
- Modify: `apps/admin-portal/vite.config.ts`
- Modify: `apps/mobile-web/vite.config.ts`

**Interfaces:**
- Consumes: `loadApiEnvironment({ mode, envDir })`
- Consumes: `formatApiEnvironmentLog(environment)`
- Produces: `server.proxy['/channel'].target` selected from `.env.<mode>`

- [ ] **Step 1: Write the failing Vite config integration test**

Create `scripts/vite-config-api-proxy.test.mjs`:

```js
import { describe, expect, it } from 'vitest';

const configs = [
  ['pc', await import('../apps/pc-web/vite.config.ts')],
  ['admin', await import('../apps/admin-portal/vite.config.ts')],
  ['mobile', await import('../apps/mobile-web/vite.config.ts')],
];

const resolveConfig = async (module, mode) =>
  module.default({
    command: 'serve',
    mode,
    isSsrBuild: false,
    isPreview: false,
  });

describe('app Vite API proxies', () => {
  it.each(configs)('%s uses the remote proxy target', async (_name, module) => {
    const config = await resolveConfig(module, 'remote');
    expect(config.server.proxy['/channel'].target).toBe('http://192.168.110.217');
  });

  it.each(configs)('%s uses the local Spring proxy target', async (_name, module) => {
    const config = await resolveConfig(module, 'spring');
    expect(config.server.proxy['/channel'].target).toBe('http://127.0.0.1:18081');
  });
});
```

- [ ] **Step 2: Run the integration test to verify it fails**

Run:

```bash
pnpm exec vitest run scripts/vite-config-api-proxy.test.mjs
```

Expected: the three `spring` cases FAIL because the target is still hardcoded to `http://192.168.110.217`.

- [ ] **Step 3: Wire PC Vite config to the environment loader**

In `apps/pc-web/vite.config.ts`:

```ts
import {
  formatApiEnvironmentLog,
  loadApiEnvironment,
} from '../../scripts/vite-api-environment.mjs';

export default defineConfig(({ command, mode }) => {
  const apiEnvironment = loadApiEnvironment({ mode, envDir: __dirname });
  console.info(formatApiEnvironmentLog(apiEnvironment));

  return {
    // preserve existing config
    server: {
      port: 3000,
      proxy: {
        '/channel': {
          target: apiEnvironment.proxyTarget,
          // preserve changeOrigin and configure
        },
      },
    },
  };
});
```

Keep every existing plugin, alias, build base, proxy header hook, optimizeDeps, and `define` entry unchanged.

- [ ] **Step 4: Wire Admin Vite config to the environment loader**

Apply the same imports and `apiEnvironment` initialization in `apps/admin-portal/vite.config.ts`. Replace only the hardcoded proxy target:

```ts
target: apiEnvironment.proxyTarget,
```

Preserve port `3002` and all existing configuration.

- [ ] **Step 5: Wire Mobile Vite config to the environment loader**

Apply the same imports and `apiEnvironment` initialization in `apps/mobile-web/vite.config.ts`. Replace only the hardcoded proxy target:

```ts
target: apiEnvironment.proxyTarget,
```

Preserve the existing plugin options, proxy header hook, aliases, and port behavior.

- [ ] **Step 6: Run the Vite integration and environment tests**

Run:

```bash
pnpm exec vitest run scripts/vite-api-environment.test.mjs scripts/vite-config-api-proxy.test.mjs
```

Expected: 16 tests PASS.

- [ ] **Step 7: Type-check all three apps**

Run:

```bash
pnpm check
```

Expected: all workspace `check` tasks PASS.

- [ ] **Step 8: Commit Vite proxy integration**

```bash
git add scripts/vite-config-api-proxy.test.mjs apps/pc-web/vite.config.ts apps/admin-portal/vite.config.ts apps/mobile-web/vite.config.ts
git commit -m "feat: select Vite API proxy by mode"
```

---

### Task 3: Explicit Root Execution Commands

**Files:**
- Create: `scripts/backend-environment-scripts.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: app workspace names `pc-web`, `admin-portal`, `mobile-web`
- Produces: `dev:<app>:<mode>` root scripts for all nine app/mode combinations

- [ ] **Step 1: Write the failing package script contract test**

Create `scripts/backend-environment-scripts.test.mjs`:

```js
import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

const expected = {
  'dev:pc:remote': 'turbo dev --filter=pc-web -- --mode remote',
  'dev:pc:spring': 'turbo dev --filter=pc-web -- --mode spring',
  'dev:pc:mock': 'turbo dev --filter=pc-web -- --mode mock',
  'dev:admin:remote': 'turbo dev --filter=admin-portal -- --mode remote',
  'dev:admin:spring': 'turbo dev --filter=admin-portal -- --mode spring',
  'dev:admin:mock': 'turbo dev --filter=admin-portal -- --mode mock',
  'dev:mobile:remote': 'turbo dev --filter=mobile-web -- --mode remote',
  'dev:mobile:spring': 'turbo dev --filter=mobile-web -- --mode spring',
  'dev:mobile:mock': 'turbo dev --filter=mobile-web -- --mode mock',
};

describe('backend environment scripts', () => {
  it.each(Object.entries(expected))('%s selects the intended Vite mode', (name, command) => {
    expect(pkg.scripts[name]).toBe(command);
  });
});
```

- [ ] **Step 2: Run the script contract test to verify it fails**

Run:

```bash
pnpm exec vitest run scripts/backend-environment-scripts.test.mjs
```

Expected: all nine cases FAIL because the scripts do not exist.

- [ ] **Step 3: Add the nine root scripts**

Add the exact `expected` entries from the test to the root `package.json` `scripts` object, grouped beside the existing `dev:pc`, `dev:admin`, and `dev:mobile` scripts.

Do not alter `dev:server`, `dev:all`, or the mode-less app scripts.

- [ ] **Step 4: Run the script contract test**

Run:

```bash
pnpm exec vitest run scripts/backend-environment-scripts.test.mjs
```

Expected: 9 tests PASS.

- [ ] **Step 5: Verify Turbo forwards the mode argument**

Run each command only long enough to capture the Vite startup line, then terminate the process:

```bash
pnpm dev:pc:spring
pnpm dev:admin:remote
pnpm dev:mobile:mock
```

Expected startup diagnostics:

```text
[vite-api] mode=spring apiUrl=/channel/backend/api/v1 proxyTarget=http://127.0.0.1:18081
[vite-api] mode=remote apiUrl=/channel/backend/api/v1 proxyTarget=http://192.168.110.217
[vite-api] mode=mock apiUrl=http://127.0.0.1:3333 proxyTarget=http://192.168.110.217
```

- [ ] **Step 6: Commit root execution commands**

```bash
git add package.json scripts/backend-environment-scripts.test.mjs
git commit -m "feat: add backend mode development commands"
```

---

### Task 4: Developer Documentation

**Files:**
- Modify: `README.md:23-110`

**Interfaces:**
- Consumes: environment files and root scripts from Tasks 1-3
- Produces: a single documented workflow for remote, local Spring, and MOCK development

- [ ] **Step 1: Update the quick-start command block**

Document these commands:

```bash
pnpm dev:pc:remote      # PC → 사내 개발 백엔드
pnpm dev:pc:spring      # PC → 로컬 Spring(127.0.0.1:18081)
pnpm dev:pc:mock        # PC → 로컬 MOCK(127.0.0.1:3333)
pnpm dev:server         # MOCK 서버 별도 실행
```

State that the same `remote`, `spring`, `mock` suffixes exist for `admin` and `mobile`.

- [ ] **Step 2: Replace the API connection table**

Use this content:

| mode | API URL | proxy target | prerequisite |
| --- | --- | --- | --- |
| `remote` | `/channel/backend/api/v1` | `http://192.168.110.217` | 사내망 접속 |
| `spring` | `/channel/backend/api/v1` | `http://127.0.0.1:18081` | 로컬 Spring 실행 |
| `mock` | `http://127.0.0.1:3333` | 사용 안 함 | `pnpm dev:server` |

- [ ] **Step 3: Document physical files and personal overrides**

Add:

```text
.env.remote       팀 공용 원격 개발 설정
.env.spring       팀 공용 로컬 Spring 설정
.env.mock         팀 공용 MOCK 설정
.env.<mode>.local 개인 전용 덮어쓰기(Git 제외)
```

Explain that editing tracked `.env` or `vite.config.ts` to switch backends is no longer required.

- [ ] **Step 4: Preserve OpenAPI configuration separation**

Keep the existing `API_DOCS_URLS` explanation and explicitly state:

```text
Vite mode는 앱 런타임 연결만 선택한다.
pnpm gen:api의 Swagger 대상은 API_DOCS_URLS로 별도 선택한다.
```

Do not regenerate `landing/assets/fe.readme.html`.

- [ ] **Step 5: Run documentation and formatting checks**

Run:

```bash
pnpm exec biome check README.md package.json scripts/vite-api-environment.mjs scripts/vite-api-environment.test.mjs scripts/vite-config-api-proxy.test.mjs scripts/backend-environment-scripts.test.mjs apps/pc-web/vite.config.ts apps/admin-portal/vite.config.ts apps/mobile-web/vite.config.ts
git diff --check
```

Expected: both commands exit 0.

- [ ] **Step 6: Run the focused tests**

Run:

```bash
pnpm exec vitest run scripts/vite-api-environment.test.mjs scripts/vite-config-api-proxy.test.mjs scripts/backend-environment-scripts.test.mjs
```

Expected: 25 tests PASS.

- [ ] **Step 7: Run repository verification**

Run:

```bash
pnpm check
pnpm lint
```

Expected: both commands exit 0.

- [ ] **Step 8: Commit documentation**

```bash
git add README.md
git commit -m "docs: document backend environment modes"
```

---

## Final Verification

- [ ] Confirm `git status --short` contains no unintended files.
- [ ] Confirm all nine `.env.<mode>` files are tracked and no `.env.<mode>.local` file is tracked.
- [ ] Confirm the three focused test files report 25 passing tests.
- [ ] Confirm `pnpm check` and `pnpm lint` pass.
- [ ] Start one app in each mode and confirm the startup diagnostic shows the selected mode, API URL, and proxy target.
- [ ] For `spring`, request `/channel/backend/api/v1/auth/login` through the Vite dev server and confirm the request reaches `127.0.0.1:18081`.
- [ ] For `mock`, start `pnpm dev:server`, launch one `*:mock` app, and confirm requests go directly to `127.0.0.1:3333`.
- [ ] Confirm `packages/shared/src/shared/api/*`, `landing/assets/fe.readme.html`, and backend repositories are unchanged.
