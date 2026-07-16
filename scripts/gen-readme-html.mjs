/**
 * README.md → landing/assets/<name>.readme.html 변환
 *
 * 안내 페이지(landing)에서 브라우저로 바로 열 수 있는 HTML 버전을 생성한다.
 * 스타일(GitHub 유사 마크다운 CSS)을 인라인으로 임베드하므로 외부 의존이 없고,
 * 생성된 단일 파일을 landing/ 와 함께 Nginx로 서빙하면 된다.
 *
 * FE README 는 이 레포, BE README 는 형제 레포(../bx-cf-be)에서 읽는다.
 * 소스가 없으면(예: CI 에 BE 레포 미체크아웃) 해당 항목은 건너뛴다.
 */
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { marked } from 'marked';

const OUT_DIR = new URL('../landing/assets/', import.meta.url);

/** 변환 대상: { src(레포 기준 상대경로), out(파일명), title } */
const TARGETS = [
  { src: '../README.md', out: 'fe.readme.html', title: 'BX-CF Frontend · README' },
  { src: '../../bx-cf-be/README.md', out: 'be.readme.html', title: 'BX-CF Backend · README' },
];

const escapeHtml = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const renderToc = (headings) =>
  headings
    .map(
      ({ id, depth, label }) =>
        `        <a class="toc-link toc-link-depth-${depth}" href="#${id}">${escapeHtml(label)}</a>`,
    )
    .join('\n');

export const renderReadmeDocument = (title, { body, headings }) => {
  const toc = renderToc(headings);

  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <link rel="icon" href="/favicon.ico" />
    <style>
      :root { color-scheme: dark; }
      html { scroll-behavior: smooth; }
      body {
        margin: 0;
        background:
          radial-gradient(900px 500px at 80% -10%, rgba(91, 157, 255, 0.10), transparent 60%),
          #0a0e16;
        color: #eaeef6;
        font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI",
          "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
        line-height: 1.65;
        -webkit-font-smoothing: antialiased;
        min-height: 100vh;
      }
      .readme-layout {
        display: grid;
        grid-template-columns: minmax(0, 880px) 260px;
        gap: 56px;
        width: min(100% - 48px, 1240px);
        margin: 0 auto;
      }
      .md {
        min-width: 0;
        padding: 48px 0 96px;
        font-size: 15px;
      }
      .md h1, .md h2, .md h3 { letter-spacing: -0.02em; line-height: 1.3; }
      .md h1 { font-size: 28px; margin: 0 0 16px; }
      .md h2 {
        font-size: 22px;
        margin: 40px 0 16px;
        padding-bottom: 8px;
        border-bottom: 1px solid #232d3f;
      }
      .md h3 { font-size: 18px; margin: 28px 0 12px; }
      .md h2, .md h3 { scroll-margin-top: 24px; }
      .md a { color: #5b9dff; text-decoration: none; }
      .md a:hover { text-decoration: underline; }
      .md hr { border: none; border-top: 1px solid #232d3f; margin: 32px 0; }
      .md code {
        background: #1c2738;
        border: 1px solid #2a3650;
        border-radius: 5px;
        padding: 1px 6px;
        font-size: 13px;
        font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
      }
      .md pre {
        background: #141a26;
        border: 1px solid #232d3f;
        border-radius: 10px;
        padding: 16px;
        overflow: auto;
      }
      .md pre code { background: none; border: none; padding: 0; }
      .md table { border-collapse: collapse; width: 100%; margin: 16px 0; font-size: 14px; }
      .md th, .md td { border: 1px solid #232d3f; padding: 8px 12px; text-align: left; }
      .md th { background: #1c2738; }
      .md blockquote {
        margin: 16px 0;
        padding: 4px 16px;
        border-left: 3px solid #5b9dff;
        color: #8893a8;
        background: #141a26;
        border-radius: 0 8px 8px 0;
      }
      .md ul, .md ol { padding-left: 24px; }
      .md img { max-width: 100%; }
      .toc-column { padding: 48px 0 96px; }
      .toc {
        position: sticky;
        top: 24px;
        max-height: calc(100vh - 48px);
        overflow-y: auto;
      }
      .toc-link {
        display: block;
        padding: 5px 8px;
        color: #8893a8;
        font-size: 14px;
        line-height: 1.45;
        text-decoration: none;
      }
      .toc-link:hover, .toc-link[aria-current="location"] { color: #eaeef6; background: #1c2738; }
      .toc-link-depth-3 { margin-left: 16px; }
      @media (max-width: 1100px) {
        .readme-layout { display: block; width: min(100% - 32px, 880px); }
        .toc-column { display: none; }
      }
    </style>
  </head>
  <body>
    <div class="readme-layout">
      <main class="md">
${body}
      </main>
      <aside class="toc-column">
        <nav class="toc" aria-label="문서 목차">
${toc}
        </nav>
      </aside>
    </div>
    <script>
      (() => {
        const tocLinks = Array.from(document.querySelectorAll('.toc-link'));
        const linksById = new Map(
          tocLinks.map((link) => [link.getAttribute('href').slice(1), link]),
        );
        const targetHeadings = Array.from(linksById.keys())
          .map((id) => document.getElementById(id))
          .filter(Boolean);
        const setActive = (id) => {
          const activeLink = linksById.get(id);
          tocLinks.forEach((link) => {
            if (link === activeLink) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
          });
        };
        const getHashId = () => {
          try {
            return decodeURIComponent(window.location.hash.slice(1));
          } catch {
            return '';
          }
        };
        const activateHash = () => {
          const hashId = getHashId();
          if (linksById.has(hashId)) setActive(hashId);
        };

        activateHash();
        if (
          !tocLinks.some((link) => link.getAttribute('aria-current') === 'location') &&
          targetHeadings[0]
        ) {
          setActive(targetHeadings[0].id);
        }
        window.addEventListener('hashchange', activateHash);

        const observer = new IntersectionObserver(
          (entries) => {
            const visibleHeading = entries
              .filter((entry) => entry.isIntersecting)
              .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
            if (visibleHeading) setActive(visibleHeading.target.id);
          },
          { rootMargin: '-24px 0px -65% 0px', threshold: 0 },
        );
        targetHeadings.forEach((heading) => observer.observe(heading));
      })();
    </script>
  </body>
</html>
`;
};

const createHeadingId = (label, counts) => {
  const base =
    label
      .normalize('NFKC')
      .toLocaleLowerCase('ko')
      .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
      .replace(/^-|-$/g, '') || 'section';
  const count = (counts.get(base) ?? 0) + 1;
  counts.set(base, count);
  return count === 1 ? base : `${base}-${count}`;
};

const getHeadingLabel = (tokens) => {
  const renderer = new marked.TextRenderer();
  return new marked.Parser({ renderer }).parseInline(tokens);
};

export const buildReadmeContent = (markdown) => {
  const tokens = marked.lexer(markdown, { gfm: true });
  const headings = [];
  const counts = new Map();

  for (const token of tokens) {
    if (token.type !== 'heading' || (token.depth !== 2 && token.depth !== 3)) continue;
    const label = getHeadingLabel(token.tokens);
    token.headingId = createHeadingId(label, counts);
    headings.push({ id: token.headingId, depth: token.depth, label });
  }

  const renderer = new marked.Renderer();
  renderer.heading = function ({ tokens: inlineTokens, depth, headingId }) {
    const content = this.parser.parseInline(inlineTokens);
    return headingId
      ? `<h${depth} id="${headingId}">${content}</h${depth}>\n`
      : `<h${depth}>${content}</h${depth}>\n`;
  };

  return { body: marked.parser(tokens, { renderer }), headings };
};

export const generateReadmeHtml = async ({ targets = TARGETS, outDir = OUT_DIR } = {}) => {
  await mkdir(outDir, { recursive: true });
  const results = [];

  for (const { src, out, title } of targets) {
    const srcUrl = new URL(src, import.meta.url);
    try {
      await access(srcUrl);
    } catch {
      console.warn(`⏭️  ${out} 건너뜀 — 소스 없음 (${src})`);
      results.push({ out, skipped: true });
      continue;
    }
    const md = await readFile(srcUrl, 'utf8');
    const content = buildReadmeContent(md);
    const outUrl = new URL(out, outDir);
    await writeFile(outUrl, renderReadmeDocument(title, content), 'utf8');
    console.log(`✅ ${out} 생성 완료 (${md.length.toLocaleString()}자)`);
    results.push({ out, skipped: false });
  }

  return results;
};

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  await generateReadmeHtml();
}
