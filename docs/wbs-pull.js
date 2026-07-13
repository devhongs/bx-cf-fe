// GitHub Project V2 -> docs/wbs.md append-only import
// Preview: pnpm wbs:pull -- --dry-run
// Apply:   pnpm wbs:pull

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {
  appendImportedItems,
  findUntrackedItems,
  projectItemsFromConnection,
  renderImportedSection,
} from './wbs-pull.lib.js';

const WBS_MD_PATH = path.resolve('docs/wbs.md');
const GH_PATH = os.platform() === 'win32' ? 'C:/Program Files/GitHub CLI/gh.exe' : 'gh';
const OWNER = 'devhongs';
const PROJECT_NUMBER = 1;

const PROJECT_ITEMS_QUERY = `
  query($owner: String!, $projectNumber: Int!, $after: String) {
    user(login: $owner) {
      projectV2(number: $projectNumber) {
        items(first: 100, after: $after) {
          pageInfo { hasNextPage endCursor }
          nodes {
            id
            type
            content {
              ... on Issue { id number title body state }
              ... on DraftIssue { id title body }
              ... on PullRequest { id number title body state }
            }
            fieldValues(first: 20) {
              nodes {
                ... on ProjectV2ItemFieldSingleSelectValue {
                  name
                  field { ... on ProjectV2SingleSelectField { name } }
                }
              }
            }
          }
        }
      }
    }
  }
`;

function runGraphQL(after) {
  const args = [
    'api',
    'graphql',
    '-f',
    `query=${PROJECT_ITEMS_QUERY}`,
    '-F',
    `owner=${OWNER}`,
    '-F',
    `projectNumber=${PROJECT_NUMBER}`,
  ];
  if (after) args.push('-F', `after=${after}`);

  const output = execFileSync(GH_PATH, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return JSON.parse(output);
}

export function fetchProjectItems() {
  const imported = [];
  let after = null;

  do {
    const response = runGraphQL(after);
    const connection = response?.data?.user?.projectV2?.items;
    if (!connection)
      throw new Error(`GitHub Project ${OWNER}/${PROJECT_NUMBER}를 찾지 못했습니다.`);

    imported.push(...projectItemsFromConnection(connection));
    after = connection.pageInfo?.hasNextPage ? connection.pageInfo.endCursor : null;
  } while (after);

  return imported;
}

function main() {
  const dryRun = process.argv.includes('--dry-run');
  const wbs = fs.readFileSync(WBS_MD_PATH, 'utf8');
  const projectItems = fetchProjectItems();
  const untrackedItems = findUntrackedItems(wbs, projectItems);

  console.log(`GitHub Project 항목: ${projectItems.length}개`);
  console.log(`WBS 신규 항목: ${untrackedItems.length}개`);

  if (untrackedItems.length === 0) {
    console.log('추가할 항목이 없습니다.');
    return;
  }

  if (dryRun) {
    console.log('\n--- dry-run ---\n');
    console.log(renderImportedSection(untrackedItems));
    return;
  }

  fs.writeFileSync(WBS_MD_PATH, appendImportedItems(wbs, untrackedItems));
  console.log(`docs/wbs.md에 ${untrackedItems.length}개 항목을 추가했습니다.`);
}

const isDirectRun =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename);
if (isDirectRun) {
  try {
    main();
  } catch (error) {
    console.error(`WBS 가져오기 실패: ${error.message}`);
    process.exitCode = 1;
  }
}
