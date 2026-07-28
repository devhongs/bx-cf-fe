import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

const expected = {
  'dev:pc:remote': 'turbo dev --filter=pc-web -- --mode remote',
  'dev:pc:nest': 'turbo dev --filter=pc-web -- --mode nest',
  'dev:pc:mock': 'turbo dev --filter=pc-web -- --mode mock',
  'dev:admin:remote': 'turbo dev --filter=admin-portal -- --mode remote',
  'dev:admin:nest': 'turbo dev --filter=admin-portal -- --mode nest',
  'dev:admin:mock': 'turbo dev --filter=admin-portal -- --mode mock',
  'dev:mobile:remote': 'turbo dev --filter=mobile-web -- --mode remote',
  'dev:mobile:nest': 'turbo dev --filter=mobile-web -- --mode nest',
  'dev:mobile:mock': 'turbo dev --filter=mobile-web -- --mode mock',
};

describe('backend environment scripts', () => {
  it.each(Object.entries(expected))('%s selects the intended Vite mode', (name, command) => {
    expect(pkg.scripts[name]).toBe(command);
  });
});
