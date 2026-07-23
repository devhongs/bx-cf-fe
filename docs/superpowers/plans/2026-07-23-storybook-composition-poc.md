# Storybook Composition POC Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add independently rendered Shared, PC, Admin, and Mobile Storybooks plus a Composition Hub in one `apps/storybook` workspace.

**Architecture:** `apps/storybook` owns Storybook 10.5.3 and five config profiles selected with `--config-dir`. Target profiles load only their own global CSS and Vite alias, while the Hub references the four local Storybook URLs. Initial component stories remain beside their source components and avoid Storybook type imports so existing app workspaces do not gain Storybook dependencies.

**Tech Stack:** Storybook 10.5.3, `@storybook/react-vite` 10.5.3, React 19.2, Vite 8, TypeScript 6, Vitest 4, pnpm workspaces, Turborepo

## Global Constraints

- Keep the Git repository and the existing `shared`, `pc-web`, `admin-portal`, and `mobile-web` workspaces intact.
- Add exactly one new workspace at `apps/storybook`; its child config directories are not workspaces.
- Keep Storybook dependencies in `apps/storybook/package.json`.
- Use ports Hub 6005, Shared 6006, PC 6007, Admin 6008, and Mobile 6009.
- Do not add Figma, token generation, MSW, router/auth providers, or interaction-test infrastructure.
- Use current CSS files as the token source for this POC.
- Keep initial representative stories free of network and application bootstrap dependencies.

---

### Task 1: Storybook workspace and reusable configuration

**Files:**
- Create: `apps/storybook/package.json`
- Create: `apps/storybook/tsconfig.json`
- Create: `apps/storybook/config/create-storybook-config.test.ts`
- Create: `apps/storybook/config/create-storybook-config.ts`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes: repository `public` directory, app source roots, Vite `mergeConfig`
- Produces: `createStorybookConfig(options: StorybookProfileOptions): StorybookConfig`

- [ ] **Step 1: Add the workspace manifest and TypeScript configuration**

```json
{
  "name": "@bx/storybook",
  "private": true,
  "type": "module",
  "scripts": {
    "storybook": "concurrently --kill-others-on-fail -n hub,shared,pc,admin,mobile \"pnpm dev:hub\" \"pnpm dev:shared\" \"pnpm dev:pc\" \"pnpm dev:admin\" \"pnpm dev:mobile\"",
    "dev:hub": "storybook dev --config-dir hub --port 6005 --no-open",
    "dev:shared": "storybook dev --config-dir shared --port 6006 --no-open",
    "dev:pc": "storybook dev --config-dir pc --port 6007 --no-open",
    "dev:admin": "storybook dev --config-dir admin --port 6008 --no-open",
    "dev:mobile": "storybook dev --config-dir mobile --port 6009 --no-open",
    "build:all": "pnpm build:shared && pnpm build:pc && pnpm build:admin && pnpm build:mobile && pnpm build:hub",
    "build:hub": "storybook build --config-dir hub --output-dir dist/hub",
    "build:shared": "storybook build --config-dir shared --output-dir dist/shared",
    "build:pc": "storybook build --config-dir pc --output-dir dist/pc",
    "build:admin": "storybook build --config-dir admin --output-dir dist/admin",
    "build:mobile": "storybook build --config-dir mobile --output-dir dist/mobile",
    "test": "vitest run --passWithNoTests",
    "check": "tsc --noEmit"
  },
  "devDependencies": {
    "@storybook/addon-docs": "10.5.3",
    "@storybook/react-vite": "10.5.3",
    "@types/node": "^25.9.0",
    "@types/react": "^19.2.2",
    "@types/react-dom": "^19.2.2",
    "concurrently": "^9.2.1",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "storybook": "10.5.3",
    "typescript": "^6.0.3",
    "vite": "^8.0.13",
    "vite-plugin-svgr": "^5.2.0",
    "vitest": "^4.1.6"
  }
}
```

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "types": ["vite/client", "node"],
    "paths": {
      "@bx/shared": ["../../packages/shared/src/index.ts"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"]
}
```

- [ ] **Step 2: Install the workspace dependencies**

Run: `pnpm install`

Expected: `apps/storybook` is detected and `pnpm-lock.yaml` contains Storybook 10.5.3 packages.

- [ ] **Step 3: Write the failing configuration contract test**

```ts
import { describe, expect, it } from 'vitest';

import { createStorybookConfig } from './create-storybook-config';

describe('createStorybookConfig', () => {
  it('uses the React Vite framework, docs, stories, and shared public directory', () => {
    const stories = ['../stories/**/*.stories.tsx'];
    const config = createStorybookConfig({ stories, aliasRoot: '/workspace/app/src' });

    expect(config.framework).toBe('@storybook/react-vite');
    expect(config.addons).toEqual(['@storybook/addon-docs']);
    expect(config.stories).toEqual(stories);
    expect(config.staticDirs).toEqual([expect.stringMatching(/\/public$/)]);
  });
});
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `pnpm --filter @bx/storybook test -- config/create-storybook-config.test.ts`

Expected: FAIL because `config/create-storybook-config.ts` does not exist.

- [ ] **Step 5: Implement the shared main-config factory**

```ts
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');

interface StorybookProfileOptions {
  stories: StorybookConfig['stories'];
  aliasRoot?: string;
}

export function createStorybookConfig({
  stories,
  aliasRoot,
}: StorybookProfileOptions): StorybookConfig {
  return {
    framework: '@storybook/react-vite',
    addons: ['@storybook/addon-docs'],
    stories,
    staticDirs: [resolve(repositoryRoot, 'public')],
    async viteFinal(config) {
      return mergeConfig(config, {
        define: {
          'process.env': {},
        },
        plugins: [svgr()],
        resolve: {
          alias: aliasRoot ? { '@': aliasRoot } : {},
          dedupe: ['react', 'react-dom'],
        },
        server: {
          fs: {
            allow: [repositoryRoot],
          },
        },
      });
    },
  };
}
```

- [ ] **Step 6: Run the focused test and type check**

Run: `pnpm --filter @bx/storybook test -- config/create-storybook-config.test.ts`

Expected: PASS.

Run: `pnpm --filter @bx/storybook check`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add apps/storybook/package.json apps/storybook/tsconfig.json \
  apps/storybook/config/create-storybook-config.test.ts \
  apps/storybook/config/create-storybook-config.ts pnpm-lock.yaml
git commit -m "chore(storybook): add centralized workspace"
```

### Task 2: Shared preview behavior and target profiles

**Files:**
- Create: `apps/storybook/config/theme.test.ts`
- Create: `apps/storybook/config/theme.ts`
- Create: `apps/storybook/config/preview.tsx`
- Create: `apps/storybook/shared/main.ts`
- Create: `apps/storybook/shared/preview.ts`
- Create: `apps/storybook/pc/main.ts`
- Create: `apps/storybook/pc/preview.ts`
- Create: `apps/storybook/admin/main.ts`
- Create: `apps/storybook/admin/preview.ts`
- Create: `apps/storybook/mobile/main.ts`
- Create: `apps/storybook/mobile/preview.ts`

**Interfaces:**
- Consumes: `createStorybookConfig`, current app CSS files
- Produces: `basePreview: Preview`, four independently buildable Storybook profiles

- [ ] **Step 1: Write the failing theme behavior test**

```ts
import { describe, expect, it, vi } from 'vitest';

import { applyStorybookTheme } from './theme';

describe('applyStorybookTheme', () => {
  it('adds the dark class only for the dark theme', () => {
    const toggle = vi.fn();
    const root = { classList: { toggle } };

    applyStorybookTheme(root, 'dark');
    expect(toggle).toHaveBeenCalledWith('dark', true);

    applyStorybookTheme(root, 'light');
    expect(toggle).toHaveBeenLastCalledWith('dark', false);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm --filter @bx/storybook test -- config/theme.test.ts`

Expected: FAIL because `config/theme.ts` does not exist.

- [ ] **Step 3: Implement the theme function and base preview**

```ts
export interface ThemeRoot {
  classList: Pick<DOMTokenList, 'toggle'>;
}

export function applyStorybookTheme(root: ThemeRoot, theme: unknown) {
  root.classList.toggle('dark', theme === 'dark');
}
```

```tsx
import type { Preview } from '@storybook/react-vite';

import { applyStorybookTheme } from './theme';

export const basePreview = {
  globalTypes: {
    theme: {
      description: 'Canvas color theme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' }
        ],
        dynamicTitle: true
      }
    }
  },
  initialGlobals: {
    theme: 'light'
  },
  decorators: [
    (Story, context) => {
      applyStorybookTheme(document.documentElement, context.globals.theme);
      return <Story />;
    }
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    htmlLang: 'ko'
  }
} satisfies Preview;
```

- [ ] **Step 4: Add target main and preview profiles**

Use these exact profile configurations:

```ts
// shared/main.ts
import { createStorybookConfig } from '../config/create-storybook-config';

export default createStorybookConfig({
  stories: [
    '../stories/foundation/**/*.stories.@(ts|tsx)',
    '../../../packages/shared/src/**/*.stories.@(ts|tsx)',
  ],
});
```

```ts
// pc/main.ts
import { resolve } from 'node:path';
import { createStorybookConfig } from '../config/create-storybook-config';

export default createStorybookConfig({
  stories: [
    '../stories/foundation/**/*.stories.@(ts|tsx)',
    '../../pc-web/src/**/*.stories.@(ts|tsx)',
  ],
  aliasRoot: resolve(import.meta.dirname, '../../pc-web/src'),
});
```

```ts
// admin/main.ts
import { resolve } from 'node:path';
import { createStorybookConfig } from '../config/create-storybook-config';

export default createStorybookConfig({
  stories: [
    '../stories/foundation/**/*.stories.@(ts|tsx)',
    '../../admin-portal/src/**/*.stories.@(ts|tsx)',
  ],
  aliasRoot: resolve(import.meta.dirname, '../../admin-portal/src'),
});
```

```ts
// mobile/main.ts
import { resolve } from 'node:path';
import { createStorybookConfig } from '../config/create-storybook-config';

export default createStorybookConfig({
  stories: [
    '../stories/foundation/**/*.stories.@(ts|tsx)',
    '../../mobile-web/src/**/*.stories.@(ts|tsx)',
  ],
  aliasRoot: resolve(import.meta.dirname, '../../mobile-web/src'),
});
```

Shared, PC, and Admin previews import their target CSS and export `basePreview`:

```ts
import '../../pc-web/src/shared/styles/styles.css';
import { basePreview } from '../config/preview';
export default basePreview;
```

Mobile uses:

```ts
import type { Preview } from '@storybook/react-vite';
import '../../mobile-web/src/shared/styles/styles.css';
import { basePreview } from '../config/preview';

const preview = {
  ...basePreview,
  parameters: {
    ...basePreview.parameters,
    viewport: {
      options: {
        bxMobile: {
          name: 'BX Mobile',
          styles: { width: '390px', height: '844px' },
          type: 'mobile',
        },
      },
    },
  },
  initialGlobals: {
    ...basePreview.initialGlobals,
    viewport: { value: 'bxMobile', isRotated: false },
  },
} satisfies Preview;

export default preview;
```

- [ ] **Step 5: Run tests and type check**

Run: `pnpm --filter @bx/storybook test -- config/theme.test.ts`

Expected: PASS.

Run: `pnpm --filter @bx/storybook check`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/storybook/config apps/storybook/shared apps/storybook/pc \
  apps/storybook/admin apps/storybook/mobile
git commit -m "feat(storybook): add isolated app profiles"
```

### Task 3: Token showcase and representative component stories

**Files:**
- Create: `apps/storybook/stories/foundation/TokenShowcase.tsx`
- Create: `apps/storybook/stories/foundation/TokenShowcase.module.css`
- Create: `apps/storybook/stories/foundation/TokenShowcase.stories.tsx`
- Create: `packages/shared/src/shared/ui/button/Button.stories.tsx`
- Create: `apps/pc-web/src/shared/ui/popover-panel/PopoverPanel.stories.tsx`
- Create: `apps/admin-portal/src/shared/ui/admin-filter-bar/AdminFilterBar.stories.tsx`
- Create: `apps/mobile-web/src/features/ai-search/ui/AiSearchCard.stories.tsx`

**Interfaces:**
- Consumes: existing CSS custom properties and UI components
- Produces: `Foundation/Tokens` plus one provider-free component story per target

- [ ] **Step 1: Implement the reusable token showcase**

Create a `TokenShowcase` that renders cards for:

```ts
const tokenNames = [
  '--background',
  '--surface',
  '--surface-raised',
  '--foreground',
  '--muted',
  '--border',
  '--accent',
  '--accent-hover',
  '--success',
  '--warning',
  '--danger',
] as const;
```

Render the array with this custom-property bridge:

```tsx
import type { CSSProperties } from 'react';
import styles from './TokenShowcase.module.css';

export function TokenShowcase() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>BX-CF Foundations</p>
        <h1>Semantic tokens</h1>
        <p>Use the Theme toolbar to compare light and dark values.</p>
      </header>
      <section className={styles.grid}>
        {tokenNames.map((token) => (
          <article className={styles.card} key={token}>
            <div
              className={styles.swatch}
              style={{ '--token-value': `var(${token})` } as CSSProperties}
            />
            <code>{token}</code>
          </article>
        ))}
      </section>
    </main>
  );
}
```

`TokenShowcase.module.css` uses only existing semantic CSS variables. The story title is `Foundation/Tokens` and uses fullscreen layout.

- [ ] **Step 2: Add provider-free representative stories**

Shared `UI/Button` renders variants and disabled state:

```tsx
import { Button } from './Button';

export default { title: 'UI/Button', component: Button };

export const Variants = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="destructive">Destructive</Button>
      <Button disabled>Disabled</Button>
    </div>
  ),
};
```

PC `UI/PopoverPanel` wraps the panel in its required Radix root:

```tsx
import { Button, Popover, PopoverTrigger } from '@bx/shared';
import { PopoverPanel } from './PopoverPanel';

export default { title: 'UI/PopoverPanel', component: PopoverPanel };

export const Default = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="secondary">Open panel</Button>
      </PopoverTrigger>
      <PopoverPanel title="Account settings">
        <p style={{ margin: 0 }}>Popover content rendered with the PC theme.</p>
      </PopoverPanel>
    </Popover>
  ),
};
```

Admin `UI/AdminFilterBar` maintains state locally and omits status props:

```tsx
import { useState } from 'react';
import { AdminFilterBar } from './AdminFilterBar';

export default { title: 'UI/AdminFilterBar', component: AdminFilterBar };

export const Default = {
  render: () => {
    const [searchValue, setSearchValue] = useState('');
    const [actionCount, setActionCount] = useState(0);

    return (
      <AdminFilterBar
        searchValue={searchValue}
        resultLabel={`Actions ${actionCount}`}
        primaryActionLabel="Add item"
        onSearchChange={setSearchValue}
        onPrimaryAction={() => setActionCount((count) => count + 1)}
      />
    );
  },
};
```

Mobile `Features/AiSearchCard` needs no provider:

```tsx
import { AiSearchCard } from './AiSearchCard';

export default { title: 'Features/AiSearchCard', component: AiSearchCard };
export const Default = {};
```

Do not import Storybook types into these colocated story files. Export plain CSF objects so existing package type checks remain dependency-free.

- [ ] **Step 3: Run app and storybook type checks**

Run: `pnpm check`

Expected: PASS in `@bx/shared`, `pc-web`, `admin-portal`, `mobile-web`, and `@bx/storybook`.

- [ ] **Step 4: Run lint and CSS token validation**

Run: `pnpm lint`

Expected: PASS.

Run: `pnpm check:css-tokens`

Expected: `CSS token check passed.`

- [ ] **Step 5: Commit**

```bash
git add apps/storybook/stories \
  packages/shared/src/shared/ui/button/Button.stories.tsx \
  apps/pc-web/src/shared/ui/popover-panel/PopoverPanel.stories.tsx \
  apps/admin-portal/src/shared/ui/admin-filter-bar/AdminFilterBar.stories.tsx \
  apps/mobile-web/src/features/ai-search/ui/AiSearchCard.stories.tsx
git commit -m "feat(storybook): add token and representative stories"
```

### Task 4: Composition Hub, root commands, and end-to-end verification

**Files:**
- Create: `apps/storybook/hub/main.ts`
- Create: `apps/storybook/hub/preview.ts`
- Create: `apps/storybook/hub/Introduction.mdx`
- Modify: `package.json`
- Modify: `README.md`

**Interfaces:**
- Consumes: local target Storybook URLs on ports 6006–6009
- Produces: Hub on port 6005, root proxy commands, cached `build:storybook` task

- [ ] **Step 1: Add the Composition Hub**

`hub/main.ts` uses `createStorybookConfig`, loads `./Introduction.mdx`, and defines:

```ts
refs: {
  shared: { title: 'Shared', url: 'http://localhost:6006' },
  pc: { title: 'PC', url: 'http://localhost:6007' },
  admin: { title: 'Admin', url: 'http://localhost:6008' },
  mobile: { title: 'Mobile', url: 'http://localhost:6009' }
}
```

`Introduction.mdx` contains:

```mdx
import { Meta } from '@storybook/addon-docs/blocks';

<Meta title="Welcome/Introduction" />

# BX-CF Storybook

This hub composes four independently rendered Storybooks.

| Catalog | Local URL |
| --- | --- |
| Shared | http://localhost:6006 |
| PC | http://localhost:6007 |
| Admin | http://localhost:6008 |
| Mobile | http://localhost:6009 |

Use the Hub for navigation. Open the target Storybook directly for its preview and addon panels.
```

- [ ] **Step 2: Add root proxy scripts**

Add:

```json
"storybook": "pnpm --filter @bx/storybook storybook",
"storybook:hub": "pnpm --filter @bx/storybook dev:hub",
"storybook:shared": "pnpm --filter @bx/storybook dev:shared",
"storybook:pc": "pnpm --filter @bx/storybook dev:pc",
"storybook:admin": "pnpm --filter @bx/storybook dev:admin",
"storybook:mobile": "pnpm --filter @bx/storybook dev:mobile",
"build:storybook": "pnpm --filter @bx/storybook build:all"
```

Do not add `dev` or `build` scripts to `@bx/storybook` and do not change `turbo.json`; this keeps the existing root `pnpm dev` and `pnpm build` behavior unchanged.

- [ ] **Step 3: Document Storybook usage**

Add a README section listing the architecture, commands, ports, story ownership, and deferred capabilities.

- [ ] **Step 4: Build all five Storybooks**

Run: `pnpm build:storybook`

Expected: exits 0 and creates:

```text
apps/storybook/dist/hub/index.html
apps/storybook/dist/shared/index.html
apps/storybook/dist/pc/index.html
apps/storybook/dist/admin/index.html
apps/storybook/dist/mobile/index.html
```

- [ ] **Step 5: Run the full repository verification**

Run: `pnpm check`

Expected: PASS.

Run: `pnpm test`

Expected: PASS.

Run: `pnpm lint`

Expected: PASS.

Run: `pnpm check:css-tokens`

Expected: `CSS token check passed.`

- [ ] **Step 6: Verify local Composition visually**

Run: `pnpm storybook`

Expected: all five servers become ready on ports 6005–6009. Open Hub 6005 and verify Shared, PC, Admin, and Mobile refs; verify Light/Dark token rendering and Mobile 390 × 844 viewport.

- [ ] **Step 7: Commit**

```bash
git add apps/storybook/hub package.json README.md
git commit -m "feat(storybook): compose app catalogs"
```
