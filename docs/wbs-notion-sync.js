// docs/wbs.md -> Notion FE WBS one-way incremental sync
// Preview: pnpm wbs:notion-sync -- --dry-run
// Apply:   pnpm wbs:notion-sync

import fs from 'node:fs';
import path from 'node:path';

import {
  buildContentBlocks,
  buildNotionProperties,
  buildSectionProperties,
  parseWbsMarkdown,
  readPageSnapshot,
  resolveStatus,
  taskSnapshot,
} from './wbs-notion-sync.lib.js';

const API_BASE = 'https://api.notion.com/v1';
const API_VERSION = '2026-03-11';
const WBS_PATH = path.resolve('docs/wbs.md');
const REQUEST_INTERVAL_MS = 350;

const token = process.env.NOTION_API_TOKEN;
const dataSourceId = process.env.NOTION_DATA_SOURCE_ID;
let lastRequestAt = 0;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function notionRequest(endpoint, options = {}, retries = 3) {
  const wait = REQUEST_INTERVAL_MS - (Date.now() - lastRequestAt);
  if (wait > 0) await sleep(wait);

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Notion-Version': API_VERSION,
      ...options.headers,
    },
  });
  lastRequestAt = Date.now();

  if (response.status === 429 && retries > 0) {
    const retryAfter = Number(response.headers.get('retry-after') ?? 1);
    await sleep(retryAfter * 1000);
    return notionRequest(endpoint, options, retries - 1);
  }

  const body = await response.json();
  if (!response.ok) {
    throw new Error(
      `${response.status} ${body.code ?? 'notion_error'}: ${body.message ?? 'Unknown error'}`,
    );
  }
  return body;
}

async function getExistingPages() {
  const pages = [];
  let startCursor;

  do {
    const body = await notionRequest(`/data_sources/${dataSourceId}/query`, {
      method: 'POST',
      body: JSON.stringify({
        page_size: 100,
        ...(startCursor ? { start_cursor: startCursor } : {}),
      }),
    });
    pages.push(...body.results);
    startCursor = body.has_more ? body.next_cursor : undefined;
  } while (startCursor);

  return pages;
}

function indexPagesByKey(pages) {
  const pagesByKey = new Map();
  for (const page of pages) {
    const snapshot = readPageSnapshot(page);
    if (snapshot.syncKey) pagesByKey.set(snapshot.syncKey, { page, snapshot });
  }
  return pagesByKey;
}

function planSync(tasks, pagesByKey, parentPages) {
  return tasks.map((task) => {
    const existing = pagesByKey.get(task.syncKey);
    const parentId = parentPages.get(task.section)?.id ?? `pending:${task.section}`;
    const status = resolveStatus(task.checked, existing?.snapshot.status);
    const desired = taskSnapshot(task, status, parentId);
    if (!existing) return { type: 'create', task, status, desired, parentId, contentChanged: true };
    const contentChanged = existing.snapshot.description !== desired.description;
    const parentChanged = existing.snapshot.parentId !== parentId;
    if (JSON.stringify(existing.snapshot) === JSON.stringify(desired)) {
      return {
        type: 'unchanged',
        task,
        status,
        desired,
        parentId,
        page: existing.page,
        contentChanged,
        parentChanged,
      };
    }
    return {
      type: 'update',
      task,
      status,
      desired,
      parentId,
      page: existing.page,
      contentChanged,
      parentChanged,
    };
  });
}

async function appendPageContent(pageId, blocks) {
  if (blocks.length === 0) return;
  await notionRequest(`/blocks/${pageId}/children`, {
    method: 'PATCH',
    body: JSON.stringify({ children: blocks }),
  });
}

async function replacePageContent(pageId, blocks) {
  let cursor;
  do {
    const query = new URLSearchParams({ page_size: '100' });
    if (cursor) query.set('start_cursor', cursor);
    const result = await notionRequest(`/blocks/${pageId}/children?${query}`);
    for (const block of result.results) {
      await notionRequest(`/blocks/${block.id}`, { method: 'DELETE' });
    }
    cursor = result.has_more ? result.next_cursor : undefined;
  } while (cursor);
  await appendPageContent(pageId, blocks);
}

async function applyAction(action) {
  const properties = buildNotionProperties(action.task, action.status, action.parentId);
  const blocks = buildContentBlocks(action.task.description);
  if (action.type === 'create') {
    await notionRequest('/pages', {
      method: 'POST',
      body: JSON.stringify({
        parent: { type: 'data_source_id', data_source_id: dataSourceId },
        properties,
        children: blocks,
      }),
    });
    return;
  }

  await notionRequest(`/pages/${action.page.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ properties }),
  });
  if (action.contentChanged) await replacePageContent(action.page.id, blocks);
  else if (action.parentChanged) await appendPageContent(action.page.id, blocks);
}

async function ensureSectionParents(sections, pagesByKey, dryRun) {
  const parentPages = new Map();
  const missing = [];
  for (const section of sections) {
    const existing = pagesByKey.get(`wbs-section:${section}`)?.page;
    if (existing) parentPages.set(section, existing);
    else missing.push(section);
  }

  console.log(`섹션 부모: 생성 ${missing.length}개 / 기존 ${sections.length - missing.length}개`);
  if (dryRun) return { parentPages, missing };

  for (let index = 0; index < missing.length; index += 1) {
    const section = missing[index];
    const page = await notionRequest('/pages', {
      method: 'POST',
      body: JSON.stringify({
        parent: { type: 'data_source_id', data_source_id: dataSourceId },
        properties: buildSectionProperties(section),
      }),
    });
    parentPages.set(section, page);
    if ((index + 1) % 10 === 0 || index + 1 === missing.length) {
      console.log(`섹션 진행: ${index + 1}/${missing.length}`);
    }
  }
  return { parentPages, missing };
}

function printSummary(actions) {
  const counts = { create: 0, update: 0, unchanged: 0 };
  for (const action of actions) counts[action.type] += 1;
  console.log(`WBS 작업: ${actions.length}개`);
  console.log(
    `생성: ${counts.create}개 / 수정: ${counts.update}개 / 변경 없음: ${counts.unchanged}개`,
  );
  return counts;
}

async function main() {
  if (!token) throw new Error('NOTION_API_TOKEN이 없습니다.');
  if (!dataSourceId) throw new Error('NOTION_DATA_SOURCE_ID가 없습니다.');

  const dryRun = process.argv.includes('--dry-run');
  const tasks = parseWbsMarkdown(fs.readFileSync(WBS_PATH, 'utf8'));
  const keys = new Set(tasks.map((task) => task.syncKey));
  if (keys.size !== tasks.length) throw new Error('wbs.md에 중복된 Section + 작업명이 있습니다.');

  const pages = await getExistingPages();
  const pagesByKey = indexPagesByKey(pages);
  const sections = [...new Set(tasks.map((task) => task.section))];
  const { parentPages, missing } = await ensureSectionParents(sections, pagesByKey, dryRun);
  if (dryRun) {
    for (const section of missing) parentPages.set(section, { id: `pending:${section}` });
  }
  const actions = planSync(tasks, pagesByKey, parentPages);
  const counts = printSummary(actions);

  if (dryRun) {
    for (const action of actions.filter(({ type }) => type !== 'unchanged').slice(0, 20)) {
      console.log(
        `- ${action.type === 'create' ? '생성' : '수정'}: [${action.task.section}] ${action.task.title}`,
      );
    }
    if (counts.create + counts.update > 20) console.log('- 나머지 항목 생략');
    return;
  }

  const pending = actions.filter(({ type }) => type !== 'unchanged');
  for (let index = 0; index < pending.length; index += 1) {
    await applyAction(pending[index]);
    if ((index + 1) % 10 === 0 || index + 1 === pending.length) {
      console.log(`진행: ${index + 1}/${pending.length}`);
    }
  }
  console.log('Notion WBS 동기화 완료');
}

try {
  await main();
} catch (error) {
  console.error(`Notion WBS 동기화 실패: ${error.message}`);
  process.exitCode = 1;
}
