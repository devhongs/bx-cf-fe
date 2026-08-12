import { readdir, readFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const EXCLUDED_DIRECTORIES = new Set([
  '.git',
  '.turbo',
  'dist',
  'node_modules',
  'output',
  'playwright-report',
  'test-results',
]);

const RAW_COLOR_PATTERN =
  /#[\da-f]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color)\(/i;
const COMPONENT_EXTENSIONS = ['.tsx', '.jsx'];

function stripComments(content) {
  return content
    .replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, ' '))
    .replace(/^\s*\/\/.*$/gm, (comment) => comment.replace(/[^\n]/g, ' '));
}

async function collectStyleSources(directory, rootDirectory, files) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolutePath = resolve(directory, entry.name);

    if (entry.isDirectory()) {
      if (EXCLUDED_DIRECTORIES.has(entry.name)) continue;
      await collectStyleSources(absolutePath, rootDirectory, files);
      continue;
    }

    const isCssModule = entry.name.endsWith('.module.css');
    const isComponentSource = COMPONENT_EXTENSIONS.some((extension) =>
      entry.name.endsWith(extension),
    );
    if (!isCssModule && !isComponentSource) continue;

    files.push(absolutePath);
  }
}

export async function findCssTokenViolations(rootDir) {
  const rootDirectory = resolve(rootDir);
  const files = [];
  const violations = [];

  await collectStyleSources(rootDirectory, rootDirectory, files);

  for (const filePath of files) {
    const content = stripComments(await readFile(filePath, 'utf8'));
    const file = relative(rootDirectory, filePath);

    for (const [index, line] of content.split('\n').entries()) {
      if (RAW_COLOR_PATTERN.test(line)) {
        violations.push({ file, line: index + 1, rule: 'raw-color' });
      }
    }
  }

  return violations.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const violations = await findCssTokenViolations(process.cwd());

  for (const violation of violations) {
    console.error(`${violation.file}:${violation.line} ${violation.rule}`);
  }

  if (violations.length === 0) {
    console.log('CSS token check passed.');
  } else {
    process.exitCode = 1;
  }
}
