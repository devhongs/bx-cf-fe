import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { findCssTokenViolations } from './check-css-tokens.mjs';

async function createFixture(files) {
  const root = await mkdtemp(join(tmpdir(), 'bx-css-tokens-'));

  for (const [relativePath, content] of Object.entries(files)) {
    const filePath = join(root, relativePath);
    await mkdir(join(filePath, '..'), { recursive: true });
    await writeFile(filePath, content);
  }

  return root;
}

test('reports raw colors in CSS Modules', async (context) => {
  const root = await createFixture({
    'src/Card.module.css': `
        .card {
          color: #fff;
          border: 1px solid oklch(87.2% 0.01 258.338);
          box-shadow: 0 1px 2px rgb(0 0 0 / 10%);
        }
      `,
  });
  context.after(() => rm(root, { recursive: true, force: true }));

  assert.deepEqual(await findCssTokenViolations(root), [
    { file: 'src/Card.module.css', line: 3, rule: 'raw-color' },
    { file: 'src/Card.module.css', line: 4, rule: 'raw-color' },
    { file: 'src/Card.module.css', line: 5, rule: 'raw-color' },
  ]);
});

test('reports raw colors in component source', async (context) => {
  const root = await createFixture({
    'src/Card.tsx': `
      export function Card() {
        return <Icon color="#16c481" />;
      }
    `,
  });
  context.after(() => rm(root, { recursive: true, force: true }));

  assert.deepEqual(await findCssTokenViolations(root), [
    { file: 'src/Card.tsx', line: 3, rule: 'raw-color' },
  ]);
});

test('accepts semantic tokens and color keywords', async (context) => {
  const root = await createFixture({
    'src/Card.module.css': `
        .card {
          color: var(--text-primary);
          border-color: currentColor;
          background: transparent;
          outline-color: inherit;
          box-shadow: var(--shadow-control);
        }
      `,
  });
  context.after(() => rm(root, { recursive: true, force: true }));

  assert.deepEqual(await findCssTokenViolations(root), []);
});

test('does not exempt brand artwork modules', async (context) => {
  const root = await createFixture({
    'packages/shared/src/shared/ui/mesh-background/MeshBackground.module.css': `
        .mesh { background: #f5f0f9; }
      `,
    'apps/mobile-web/src/features/auth/ui/login-form/index.module.css': `
        .logo { background: linear-gradient(45deg, #fd5949, #d6249f); }
      `,
  });
  context.after(() => rm(root, { recursive: true, force: true }));

  assert.deepEqual(await findCssTokenViolations(root), [
    {
      file: 'apps/mobile-web/src/features/auth/ui/login-form/index.module.css',
      line: 2,
      rule: 'raw-color',
    },
    {
      file: 'packages/shared/src/shared/ui/mesh-background/MeshBackground.module.css',
      line: 2,
      rule: 'raw-color',
    },
  ]);
});
