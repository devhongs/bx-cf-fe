import { describe, expect, it } from 'vitest';
import { buildReadmeContent } from './gen-readme-html.mjs';

describe('README HTML heading outline', () => {
  it('creates matching H2/H3 outline entries and unique body anchors', () => {
    const result = buildReadmeContent('# Document\n\n## Overview\n\n### Details\n\n## Overview');

    expect(result.headings).toEqual([
      { id: 'overview', depth: 2, label: 'Overview' },
      { id: 'details', depth: 3, label: 'Details' },
      { id: 'overview-2', depth: 2, label: 'Overview' },
    ]);
    expect(result.body).toContain('<h2 id="overview">Overview</h2>');
    expect(result.body).toContain('<h3 id="details">Details</h3>');
    expect(result.body).toContain('<h2 id="overview-2">Overview</h2>');
  });

  it('derives plain labels from inline heading tokens', () => {
    const result = buildReadmeContent(
      '# Document\n\n## [CI/CD](https://example.com) API\\_ERROR\\_CODE',
    );

    expect(result.headings).toEqual([
      { id: 'ci-cd-api-error-code', depth: 2, label: 'CI/CD API_ERROR_CODE' },
    ]);
    expect(result.body).toContain(
      '<h2 id="ci-cd-api-error-code"><a href="https://example.com">CI/CD</a> API_ERROR_CODE</h2>',
    );
  });
});
