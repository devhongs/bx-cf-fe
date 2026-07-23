/// <reference types="node" />

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const cssPath = join(process.cwd(), 'src/shared/ui/admin-form/AdminForm.module.css');

describe('AdminForm styles', () => {
  it('resets the shared vertical form child margin for grid layout', () => {
    const css = readFileSync(cssPath, 'utf8');

    expect(css).toMatch(/\.form\s*>\s*\*\s*\+\s*\*\s*{[^}]*margin-top:\s*0;[^}]*}/s);
  });
});
