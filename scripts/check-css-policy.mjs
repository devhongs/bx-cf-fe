import { readdir, readFile } from 'node:fs/promises';
import { extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const EXCLUDED_DIRECTORIES = new Set([
  '.git',
  '.turbo',
  'dist',
  'node_modules',
  'output',
  'playwright-report',
  'test-results',
  'tmp',
]);

const SOURCE_EXTENSIONS = new Set(['.css', '.js', '.jsx', '.mjs', '.ts', '.tsx', '.yaml', '.yml']);
const TAILWIND_DEPENDENCY_PATTERN = /(?:@tailwindcss\/vite|tailwind-merge|["']tailwindcss["'])/;
const TAILWIND_DIRECTIVE_PATTERN = /@(?:apply|custom-variant|source|theme)\b|@import\s+["']tailwindcss["']/;
const CSS_MODULE_IMPORT_PATTERN = /(?:from\s+)?["'][^"']+\.module\.css["']/;
const INLINE_STYLE_PATTERN = /style\s*=\s*\{\{/;

const UTILITY_TOKEN_PATTERN = /^(?:!?(?:(?:sm|md|lg|xl|2xl|hover|focus|focus-visible|active|disabled|group-hover|placeholder|file|data-\[[^\]]+\]):)*(?:\[&[^\]]+\]:)?(?:flex|grid|block|inline-block|inline-flex|hidden|relative|absolute|fixed|sticky|sr-only|appearance-none|cursor-[\w-]+|pointer-events-[\w-]+|items-[\w-]+|justify-[\w-]+|self-[\w-]+|shrink(?:-0)?|grow|overflow(?:-[xy])?-[\w-]+|z-(?:\d+|\[[^\]]+\])|inset(?:-[xy])?-(?:\d+|0|\[[^\]]+\])|(?:top|right|bottom|left)-(?:\d+|0|1\/2|\[[^\]]+\])|-?translate-[xy]-(?:\d+|1\/2|full)|w-(?:\d+|full|screen|auto|\[[^\]]+\])|h-(?:\d+|full|screen|dvh|auto|\[[^\]]+\])|min-[wh]-(?:\d+|full|screen|dvh|\[[^\]]+\])|max-[wh]-(?:\d+|full|screen|dvh|\[[^\]]+\])|p[trblxy]?-(?:\d+(?:\.5)?|\[[^\]]+\])|-?m[trblxy]?-(?:\d+(?:\.5)?|auto|\[[^\]]+\])|space-[xy]-(?:\d+(?:\.5)?|\[[^\]]+\])|gap(?:-[xy])?-(?:\d+(?:\.5)?|\[[^\]]+\])|rounded(?:-[\w\[\].]+)?|border(?:-[trblxy])?(?:-\d+)?|bg-[^\s]+|text-(?:xs|sm|base|lg|xl|[2-9]xl|left|center|right|white|black|red-[^\s]+|gray-[^\s]+|pink-[^\s]+|blue-[^\s]+|background|foreground|muted|faint|accent[^\s]*|\[[^\]]+\])|font-(?:thin|light|normal|medium|semibold|bold|extrabold|black|sans|serif|mono)|leading-[^\s]+|tracking-[^\s]+|shadow(?:-[^\s]+)?|opacity-[^\s]+|transition(?:-[^\s]+)?|duration-[^\s]+|scale-[^\s]+|outline-[^\s]+|ring(?:-[^\s]+)?|backdrop-[^\s]+|object-[^\s]+|stroke-[^\s]+|box-border|whitespace-[^\s]+|underline(?:-[^\s]+)?|resize|list-[^\s]+|col-span-[^\s]+))$/;

function isTailwindClassList(value) {
  const tokens = value.trim().split(/\s+/).filter(Boolean);
  return tokens.some((token) => UTILITY_TOKEN_PATTERN.test(token));
}

function containsTailwindClass(content) {
  const directClassPatterns = [
    /className\s*=\s*["']([^"']+)["']/g,
    /\b(?:baseStyles|rootStyles)\s*=\s*["']([^"']+)["']/g,
  ];

  for (const pattern of directClassPatterns) {
    for (const match of content.matchAll(pattern)) {
      if (isTailwindClassList(match[1])) return true;
    }
  }

  for (const call of content.matchAll(/\bcn\(([\s\S]*?)\)/g)) {
    for (const literal of call[1].matchAll(/["']([^"']+)["']/g)) {
      if (isTailwindClassList(literal[1])) return true;
    }
  }

  return false;
}

async function collectFiles(directory, rootDirectory, files) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolutePath = resolve(directory, entry.name);
    const relativePath = relative(rootDirectory, absolutePath);

    if (entry.isDirectory()) {
      if (EXCLUDED_DIRECTORIES.has(entry.name)) continue;
      if (relativePath === 'docs/superpowers' || relativePath.startsWith('docs/superpowers/')) {
        continue;
      }
      await collectFiles(absolutePath, rootDirectory, files);
      continue;
    }

    if (
      relativePath === 'scripts/check-css-policy.mjs' ||
      relativePath === 'scripts/check-css-policy.test.mjs'
    ) {
      continue;
    }
    if (entry.name === 'package.json' || entry.name === 'pnpm-lock.yaml') {
      files.push(absolutePath);
      continue;
    }
    if (SOURCE_EXTENSIONS.has(extname(entry.name))) files.push(absolutePath);
  }
}

export async function findCssPolicyViolations(rootDir) {
  const rootDirectory = resolve(rootDir);
  const files = [];
  const violations = [];
  await collectFiles(rootDirectory, rootDirectory, files);

  for (const filePath of files) {
    const content = await readFile(filePath, 'utf8');
    const file = relative(rootDirectory, filePath);

    if (TAILWIND_DEPENDENCY_PATTERN.test(content)) {
      violations.push({ file, rule: 'tailwind-dependency' });
    }
    if (TAILWIND_DIRECTIVE_PATTERN.test(content)) {
      violations.push({ file, rule: 'tailwind-directive' });
    }
    if (/\.[jt]sx$/.test(file) && containsTailwindClass(content)) {
      violations.push({ file, rule: 'tailwind-class' });
    }
    if (
      /\.[jt]sx$/.test(file) &&
      INLINE_STYLE_PATTERN.test(content) &&
      !CSS_MODULE_IMPORT_PATTERN.test(content)
    ) {
      violations.push({ file, rule: 'inline-style-module' });
    }
  }

  return violations.sort((a, b) => a.file.localeCompare(b.file) || a.rule.localeCompare(b.rule));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const violations = await findCssPolicyViolations(process.cwd());
  for (const item of violations) console.error(`${item.file}: ${item.rule}`);

  if (violations.length === 0) {
    console.log('CSS policy check passed.');
  } else {
    process.exitCode = 1;
  }
}
