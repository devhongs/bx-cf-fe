import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { findCssPolicyViolations } from './check-css-policy.mjs';

async function createFixture(files) {
  const root = await mkdtemp(join(tmpdir(), 'bx-css-policy-'));

  for (const [relativePath, content] of Object.entries(files)) {
    const filePath = join(root, relativePath);
    await mkdir(join(filePath, '..'), { recursive: true });
    await writeFile(filePath, content);
  }

  return root;
}

test('reports Tailwind and unsupported inline style usage', async (context) => {
  const root = await createFixture({
    'package.json': JSON.stringify({ dependencies: { tailwindcss: '^4.0.0' } }),
    'src/Bad.tsx': `export function Bad() {
      return <div className="flex" style={{ marginTop: 16 }} />;
    }`,
    'src/styles.css': '@import "tailwindcss";\n.card { @apply p-4; }',
  });
  context.after(() => rm(root, { recursive: true, force: true }));

  const violations = await findCssPolicyViolations(root);

  assert.deepEqual(
    new Set(violations.map(({ rule }) => rule)),
    new Set([
      'tailwind-dependency',
      'tailwind-directive',
      'tailwind-class',
      'inline-style-module',
    ]),
  );
});

test('accepts CSS Modules with runtime custom properties', async (context) => {
  const root = await createFixture({
    'package.json': JSON.stringify({ dependencies: { clsx: '^2.1.1' } }),
    'src/Avatar.module.css': '.image { width: var(--avatar-size); }',
    'src/Avatar.tsx': `import type { CSSProperties } from 'react';
      import styles from './Avatar.module.css';
      export function Avatar({ size }) {
        return <img className={styles.image} style={{ '--avatar-size': size } as CSSProperties} />;
      }`,
  });
  context.after(() => rm(root, { recursive: true, force: true }));

  assert.deepEqual(await findCssPolicyViolations(root), []);
});

test('reports utility strings assigned through class variables', async (context) => {
  const root = await createFixture({
    'src/Form.tsx': `const controlClassName =
      'border-border bg-surface text-foreground placeholder:text-faint';
      export function Form() { return <input className={controlClassName} />; }`,
  });
  context.after(() => rm(root, { recursive: true, force: true }));

  assert.deepEqual(await findCssPolicyViolations(root), [
    { file: 'src/Form.tsx', rule: 'tailwind-class' },
  ]);
});

test('does not report the policy checker source itself', async () => {
  const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
  const violations = await findCssPolicyViolations(projectRoot);

  assert.equal(
    violations.some(({ file }) => file === 'scripts/check-css-policy.mjs'),
    false,
  );
});
