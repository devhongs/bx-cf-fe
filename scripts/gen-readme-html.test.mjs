import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';
import * as readmeHtml from './gen-readme-html.mjs';

const { buildReadmeContent } = readmeHtml;

describe('README HTML heading outline', () => {
  it('creates H2-only outline entries and unique body anchors', () => {
    const result = buildReadmeContent('# Document\n\n## Overview\n\n### Details\n\n## Overview');
    const html = readmeHtml.renderReadmeDocument('Document', result);

    expect(result.headings).toEqual([
      { id: 'overview', depth: 2, label: 'Overview' },
      { id: 'overview-2', depth: 2, label: 'Overview' },
    ]);
    expect(result.body).toContain('<h2 id="overview">Overview</h2>');
    expect(result.body).toContain('<h3>Details</h3>');
    expect(result.body).toContain('<h2 id="overview-2">Overview</h2>');
    expect(html).not.toContain('toc-link-depth-3');
    expect(html).not.toContain('href="#details"');
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

  it('renders a sticky TOC for the heading outline', () => {
    const html = readmeHtml.renderReadmeDocument(
      'Document',
      buildReadmeContent('# Document\n\n## Overview\n\n### Details'),
    );

    expect(html).toContain('<nav class="toc" aria-label="문서 목차">');
    expect(html).toContain('class="toc-link toc-link-depth-2" href="#overview"');
    expect(html).not.toContain('class="toc-link toc-link-depth-3"');
    expect(html).toContain('scroll-behavior: smooth');
    expect(html).toContain('position: sticky');
    expect(html).toContain('@media (max-width: 1100px)');
    expect(html).toContain("window.addEventListener('scroll'");
    expect(html).not.toContain('new IntersectionObserver');
    expect(html).toContain('aria-current');
  });

  it('tracks a short final section at document bottom and restores the prior section upward', () => {
    const html = readmeHtml.renderReadmeDocument(
      'Document',
      buildReadmeContent('# Document\n\n## First\n\nContent\n\n## Middle\n\nContent\n\n## Final'),
    );
    const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'https://example.com/' });
    const { document, Event } = dom.window;
    const headingTops = { first: 100, middle: 900, final: 1850 };
    let scrollY = 0;

    Object.defineProperty(dom.window, 'scrollY', { configurable: true, get: () => scrollY });
    Object.defineProperty(dom.window, 'innerHeight', { configurable: true, value: 800 });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 2000,
    });
    Object.defineProperty(document.body, 'scrollHeight', { configurable: true, value: 2000 });
    for (const heading of document.querySelectorAll('.md h2')) {
      heading.getBoundingClientRect = () => ({
        top: headingTops[heading.id] - scrollY,
      });
    }

    dom.window.eval(document.querySelector('script').textContent);

    const currentHrefs = () =>
      Array.from(document.querySelectorAll('.toc-link[aria-current="location"]'), (link) =>
        link.getAttribute('href'),
      );

    scrollY = 1200;
    dom.window.dispatchEvent(new Event('scroll'));
    expect(currentHrefs()).toEqual(['#final']);

    scrollY = 1000;
    dom.window.dispatchEvent(new Event('scroll'));
    expect(currentHrefs()).toEqual(['#middle']);
  });

  it('escapes plain TOC labels without nesting Markdown link anchors', () => {
    const html = readmeHtml.renderReadmeDocument(
      'Document',
      buildReadmeContent(
        '# Document\n\n## [CI/CD](https://example.com) & <script>alert(1)</script>',
      ),
    );

    expect(html).toContain('href="#ci-cd-script-alert-1-script">CI/CD &amp;');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;</a>');
    expect(html).not.toContain('href="#ci-cd-script-alert-1-script"><a ');
  });
});
