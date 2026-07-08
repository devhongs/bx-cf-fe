import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT_DIR = new URL('../', import.meta.url);

const API_DIR = 'packages/shared/src/shared/api';
const ROUTES_PATH = `${API_DIR}/routes.json`;
const ENTITY_DIR = 'packages/shared/src/entities';

const ALLOWLIST = [
  {
    rawPathPrefix: '/products',
    reason:
      'legacy product mutation endpoints are used by FE but are not currently exposed in product OpenAPI',
  },
  {
    rawPathPrefix: '/accounts',
    reason: 'legacy account endpoints are not currently managed by OpenAPI',
  },
  {
    rawPathPrefix: '/recentAccounts',
    reason: 'legacy recent account endpoint is not currently managed by OpenAPI',
  },
  {
    rawPathPrefix: '/alarms',
    reason: 'legacy alarm endpoints are not currently managed by OpenAPI',
  },
  {
    rawPathPrefix: '/menus',
    reason: 'legacy menu endpoints are not currently migrated to system OpenAPI routes',
  },
  {
    method: 'delete',
    rawPathPrefix: '/system/common-codes/groups',
    reason:
      'temporary system common-code delete endpoints are used by FE before backend OpenAPI is ready',
  },
  {
    method: 'delete',
    rawPathPrefix: '/system/menus',
    reason:
      'temporary system menu delete endpoints are used by FE before backend OpenAPI is ready',
  },
  {
    rawPathPrefix: '/users',
    reason: 'temporary user management endpoints are used by FE before backend OpenAPI is ready',
  },
];

const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete'];

const toFsPath = (relativePath) => fileURLToPath(new URL(relativePath, ROOT_DIR));

const toPosixPath = (filePath) =>
  path.relative(fileURLToPath(ROOT_DIR), filePath).split(path.sep).join('/');

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const schemaPathToRegExp = (schemaPath) => {
  const pattern = escapeRegExp(schemaPath).replace(/\\\{[^/]+?\\\}/g, '[^/]+');
  return new RegExp(`^${pattern}$`);
};

const referencePathForMatch = (referencePath) =>
  referencePath.replace(/\$\{[^}]+\}/g, '__path_param__');

const isTypeScriptSource = (filePath) => filePath.endsWith('.ts') || filePath.endsWith('.tsx');

const fileExists = async (filePath) => {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
};

const listFiles = async (dir) => {
  if (!(await fileExists(dir))) return [];

  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return listFiles(entryPath);
      if (entry.isFile() && isTypeScriptSource(entryPath)) return [entryPath];
      return [];
    }),
  );

  return files.flat();
};

const normalizeUrlPath = (url) => {
  if (!url) return null;
  try {
    return new URL(url, 'http://localhost').pathname.replace(/\/+$/, '') || '/';
  } catch {
    return null;
  }
};

const commonPathPrefix = (paths) => {
  const parts = paths.map((item) => item.split('/').filter(Boolean));
  const prefix = [];
  const max = Math.min(...parts.map((item) => item.length));

  for (let index = 0; index < max; index++) {
    const segment = parts[0][index];
    if (parts.every((item) => item[index] === segment)) {
      prefix.push(segment);
      continue;
    }
    break;
  }

  return `/${prefix.join('/')}`.replace(/\/+$/, '') || '/';
};

export const deriveServicePrefixes = (services) => {
  const serverPaths = services
    .map((service) => normalizeUrlPath(service.serverUrl))
    .filter(Boolean);
  const commonPrefix = commonPathPrefix(serverPaths);

  return services.map((service) => {
    const serverPath = normalizeUrlPath(service.serverUrl);
    const sourcePrefix =
      serverPath && commonPrefix !== '/' && serverPath.startsWith(`${commonPrefix}/`)
        ? serverPath.slice(commonPrefix.length)
        : serverPath;

    return {
      ...service,
      sourcePrefix: sourcePrefix || '/',
    };
  });
};

export const parseSchemaPaths = (schemaText) => {
  const paths = [];
  let current = null;

  for (const line of schemaText.split('\n')) {
    const pathMatch = line.match(/^\s*(['"])(\/[^'"]+)\1:\s*\{$/);
    if (pathMatch) {
      if (current) paths.push(current);
      current = { path: pathMatch[2], methods: new Set() };
      continue;
    }

    if (!current) continue;

    const methodMatch = line.match(/^\s+(get|post|put|patch|delete): operations/);
    if (methodMatch) {
      current.methods.add(methodMatch[1]);
    }
  }

  if (current) paths.push(current);
  return paths;
};

export const extractHttpServiceReferences = (sourceText, file) => {
  const callPattern =
    /httpService\.(get|post|put|patch|delete)[^\n(]*\(\s*(['`])((?:\\.|(?!\2)[\s\S])*?)\2/g;
  const references = [];

  for (const match of sourceText.matchAll(callPattern)) {
    const [, method, , rawPath] = match;
    const line = sourceText.slice(0, match.index).split('\n').length;
    references.push({ method, rawPath, file, line });
  }

  return references;
};

export const normalizeServicePath = (rawPath, prefix) => {
  if (rawPath === prefix) return '/';
  if (rawPath.startsWith(`${prefix}/`)) return rawPath.slice(prefix.length);
  return null;
};

const findSchemaMatch = (normalizedPath, method, schemaPaths) => {
  const referencePath = referencePathForMatch(normalizedPath);
  return schemaPaths.find((schemaPath) => {
    if (!schemaPath.methods.has(method)) return false;
    if (schemaPath.path === normalizedPath) return true;
    return schemaPathToRegExp(schemaPath.path).test(referencePath);
  });
};

const matchesAllowlist = (entry, reference) => {
  if (entry.method && entry.method !== reference.method) return false;
  if (entry.rawPath && entry.rawPath === reference.rawPath) return true;
  if (entry.rawPathPrefix) {
    return (
      reference.rawPath === entry.rawPathPrefix ||
      reference.rawPath.startsWith(`${entry.rawPathPrefix}/`) ||
      reference.rawPath.startsWith(`${entry.rawPathPrefix}\${`)
    );
  }
  return false;
};

export const checkApiReferences = ({ services, references, allowlist = ALLOWLIST }) => {
  const result = {
    matched: [],
    allowed: [],
    missing: [],
  };

  for (const reference of references) {
    const allowlistEntry = allowlist.find((entry) => matchesAllowlist(entry, reference));
    if (allowlistEntry) {
      result.allowed.push(reference);
      continue;
    }

    let matched = null;
    let bestNormalizedPath = null;

    for (const service of services) {
      const normalizedPath = normalizeServicePath(reference.rawPath, service.sourcePrefix);
      if (!normalizedPath) continue;

      bestNormalizedPath ??= normalizedPath;
      const schemaMatch = findSchemaMatch(normalizedPath, reference.method, service.schemaPaths);
      if (schemaMatch) {
        matched = { service, normalizedPath, schemaPath: schemaMatch.path };
        break;
      }
    }

    if (matched) {
      result.matched.push({
        ...reference,
        service: matched.service.name,
        normalizedPath: matched.normalizedPath,
        schemaPath: matched.schemaPath,
      });
      continue;
    }

    const prefixes = services.map((service) => service.sourcePrefix).join(', ');
    result.missing.push({
      ...reference,
      service: null,
      normalizedPath: bestNormalizedPath,
      message: `no ${reference.method.toUpperCase()} ${reference.rawPath} in OpenAPI paths (expected one of prefixes: ${prefixes})`,
    });
  }

  return result;
};

const loadRoutes = async () => {
  const raw = await readFile(toFsPath(ROUTES_PATH), 'utf8');
  return JSON.parse(raw).services ?? [];
};

const loadService = async (service) => {
  const schemaPath = `${API_DIR}/${service.name}.schema.d.ts`;
  const schemaText = await readFile(toFsPath(schemaPath), 'utf8');

  return {
    ...service,
    schemaPaths: parseSchemaPaths(schemaText),
  };
};

const loadReferences = async () => {
  const files = await listFiles(toFsPath(ENTITY_DIR));
  return (
    await Promise.all(
      files.map(async (filePath) =>
        extractHttpServiceReferences(await readFile(filePath, 'utf8'), toPosixPath(filePath)),
      ),
    )
  ).flat();
};

const printResult = (result) => {
  console.log(
    `[api-path-check] ${result.matched.length} matched, ${result.allowed.length} allowed, ${result.missing.length} missing`,
  );

  for (const item of result.matched) {
    console.log(
      `  OK    ${item.method.toUpperCase()} ${item.rawPath} -> ${item.service}:${item.schemaPath}`,
    );
  }

  for (const item of result.allowed) {
    const rule = ALLOWLIST.find((entry) => matchesAllowlist(entry, item));
    console.log(
      `  ALLOW ${item.method.toUpperCase()} ${item.rawPath} (${rule?.reason ?? 'allowed'})`,
    );
  }

  for (const item of result.missing) {
    const location = item.file ? `${item.file}:${item.line}` : 'unknown';
    console.error(`  MISS  ${item.method.toUpperCase()} ${item.rawPath} at ${location}`);
    console.error(`        ${item.message}`);
  }
};

export const runApiPathCheck = async () => {
  const services = await Promise.all(deriveServicePrefixes(await loadRoutes()).map(loadService));
  const references = await loadReferences();
  const result = checkApiReferences({ services, references });

  printResult(result);

  if (result.missing.length > 0) {
    throw new Error(`API path check failed with ${result.missing.length} missing path(s).`);
  }
};

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  try {
    await runApiPathCheck();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
