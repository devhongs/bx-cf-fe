// docs/wbs-sync.js
// 증분 동기화: docs/wbs.md → GitHub Issues + Projects (삭제하지 않음, idempotent)
//   - 섹션(### NN.) → 부모 이슈, 항목(- [ ] / - [x]) → sub-issue(네이티브 링크)
//   - 우선순위는 항목 끝의 [Must]/[Should]/[Could]/[Won't] 태그로 결정 → Project Priority(P0~P2)
//   - [x] 항목은 closed, [ ] 항목은 open 으로 상태를 맞춤(reconcile)
//   - 제목(태그 제거) 완전일치로 기존 이슈를 찾아 없는 것만 생성
//
// 실행: node docs/wbs-sync.js   (= pnpm wbs:sync)

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const WBS_MD_PATH = path.resolve('docs/wbs.md');
// OS 환경에 따라 gh CLI 경로 설정 (윈도우 로컬 경로는 하드코딩 백업, 리눅스/CI에서는 'gh' 사용)
const isWindows = os.platform() === 'win32';
const GH_PATH = isWindows ? 'C:/Program Files/GitHub CLI/gh.exe' : 'gh';
const PROJECT_NUMBER = '1';
const OWNER = 'devhongs';
const REPO_NAME = 'bx-cf-fe';
const REPO = `${OWNER}/${REPO_NAME}`;
const PROJECT_ID = 'PVT_kwHOAMdJYs4BaHGq';
const PRIORITY_FIELD_ID = 'PVTSSF_lAHOAMdJYs4BaHGqzhVBI00';

const PRIORITY_MAP = {
  'Must Have': 'bf905d18', // P0
  'Should Have': 'de852fb6', // P1
  'Could Have': 'dc19bd70', // P2
  "Won't Have": null,
};

// 항목 끝의 우선순위 태그 → 내부 우선순위명
const PRIORITY_TAG_MAP = {
  Must: 'Must Have',
  Should: 'Should Have',
  Could: 'Could Have',
  "Won't": "Won't Have",
};
const PRIORITY_RANK = { 'Must Have': 0, 'Should Have': 1, 'Could Have': 2, "Won't Have": 3 };

// ---------- gh 호출 헬퍼 ----------
function runGraphQL(query, variables = {}) {
  try {
    const payload = { query };
    if (Object.keys(variables).length > 0) payload.variables = variables;
    const payloadPath = path.resolve('docs/graphql_payload.json');
    fs.writeFileSync(payloadPath, JSON.stringify(payload));
    const cmd = `"${GH_PATH}" api graphql -H "GraphQL-Features: sub_issues" --input "${payloadPath}"`;
    const res = execSync(cmd, { encoding: 'utf-8' });
    try {
      fs.unlinkSync(payloadPath);
    } catch {}
    return JSON.parse(res.trim());
  } catch (err) {
    console.error('GraphQL execution error:', err.message);
    return null;
  }
}

function runCommandRaw(args) {
  try {
    return execSync(`"${GH_PATH}" ${args}`, { encoding: 'utf-8' }).trim();
  } catch (err) {
    console.error('Error running command:', args, err.message);
    return null;
  }
}

function runCommandJSON(args) {
  try {
    return JSON.parse(execSync(`"${GH_PATH}" ${args}`, { encoding: 'utf-8' }).trim());
  } catch {
    return null;
  }
}

// 저장소의 모든 이슈(OPEN+CLOSED, 페이지네이션)
function getAllIssues() {
  const all = [];
  let after = null;
  while (true) {
    const query = `
      query {
        repository(owner: "${OWNER}", name: "${REPO_NAME}") {
          issues(first: 100, states: [OPEN, CLOSED]${after ? `, after: "${after}"` : ''}) {
            pageInfo { hasNextPage endCursor }
            nodes {
              id
              number
              title
              body
              state
              parent { id number }
            }
          }
        }
      }
    `;
    const res = runGraphQL(query);
    if (!res?.data?.repository) break;
    const conn = res.data.repository.issues;
    all.push(...conn.nodes);
    if (!conn.pageInfo.hasNextPage) break;
    after = conn.pageInfo.endCursor;
  }
  return all;
}

function getIssueGraphQLIdByNumber(number) {
  const query = `
    query {
      repository(owner: "${OWNER}", name: "${REPO_NAME}") {
        issue(number: ${number}) { id }
      }
    }
  `;
  const res = runGraphQL(query);
  return res?.data?.repository?.issue?.id ?? null;
}

function createRepoIssue(title, body) {
  const titleEscaped = title.replace(/"/g, '\\"');
  const tempPath = path.resolve('docs/temp_body_create.txt');
  fs.writeFileSync(tempPath, body);
  const url = runCommandRaw(
    `issue create --repo ${REPO} --title "${titleEscaped}" --body-file "${tempPath}"`,
  );
  try {
    fs.unlinkSync(tempPath);
  } catch {}
  if (url?.startsWith('http')) {
    const number = Number.parseInt(url.split('/').pop(), 10);
    return { url, number };
  }
  return null;
}

function updateRepoIssueBody(number, body) {
  const tempPath = path.resolve('docs/temp_body_update.txt');
  fs.writeFileSync(tempPath, body);
  runCommandRaw(`issue edit ${number} --repo ${REPO} --body-file "${tempPath}"`);
  try {
    fs.unlinkSync(tempPath);
  } catch {}
}

function closeIssue(number) {
  return runCommandRaw(`issue close ${number} --repo ${REPO}`);
}

function reopenIssue(number) {
  return runCommandRaw(`issue reopen ${number} --repo ${REPO}`);
}

function linkSubIssue(parentId, childId) {
  const query = `
    mutation($parent: ID!, $child: ID!) {
      addSubIssue(input: { issueId: $parent, subIssueId: $child }) {
        issue { number }
      }
    }
  `;
  const res = runGraphQL(query, { parent: parentId, child: childId });
  return !!res?.data?.addSubIssue;
}

function addProjectItem(url, priority) {
  const addRes = runCommandJSON(
    `project item-add ${PROJECT_NUMBER} --owner ${OWNER} --url "${url}" --format json`,
  );
  if (addRes?.id) {
    const optionId = PRIORITY_MAP[priority];
    if (optionId) {
      runCommandRaw(
        `project item-edit --id "${addRes.id}" --field-id "${PRIORITY_FIELD_ID}" --project-id "${PROJECT_ID}" --single-select-option-id "${optionId}"`,
      );
    }
  }
}

// ---------- wbs.md 파싱 ----------
// 항목 텍스트 끝의 우선순위 태그를 분리 → { title(태그 제거), priority }
function extractPriority(text) {
  const m = text.match(/^(.*?)\s*\[(Must|Should|Could|Won't)\]\s*$/);
  if (m) return { title: m[1].trim(), priority: PRIORITY_TAG_MAP[m[2]] };
  return { title: text.trim(), priority: null };
}

// 반환: [{ title, priority, children: [{ title, priority, checked, bodyLines }] }]
function parseWbsMarkdown() {
  const lines = fs.readFileSync(WBS_MD_PATH, 'utf-8').split(/\r?\n/);
  const parents = [];
  let parent = null;
  let child = null;

  for (const raw of lines) {
    const t = raw.trim();
    if (!t) continue;

    if (t.startsWith('###')) {
      parent = { title: t.replace(/^###\s*/, ''), priority: null, children: [] };
      parents.push(parent);
      child = null;
      continue;
    }
    if (t.startsWith('#') || t.startsWith('※')) continue;

    const m = t.match(/^- \[([ xX])\]\s*(.*)$/);
    if (m) {
      if (parent) {
        const { title, priority } = extractPriority(m[2]);
        child = { title, priority, checked: m[1].toLowerCase() === 'x', bodyLines: [] };
        parent.children.push(child);
      }
      continue;
    }

    // 그 외(불릿/세부 설명) → 현재 자식 본문 (상대 들여쓰기 보존: 기본 2칸 base indent만 제거)
    if (child) child.bodyLines.push(raw.replace(/^ {2}/, '').trimEnd());
  }

  // 부모 우선순위 = 자식 중 가장 긴급한 것
  for (const p of parents) {
    let best = null;
    for (const c of p.children) {
      if (c.priority && (best === null || PRIORITY_RANK[c.priority] < PRIORITY_RANK[best])) {
        best = c.priority;
      }
    }
    p.priority = best;
  }
  return parents;
}

// 이슈 상태를 원하는 상태로 맞춤 (checked=true → CLOSED, false → OPEN)
function reconcileState(issue, shouldBeClosed) {
  const isClosed = issue.state === 'CLOSED';
  if (shouldBeClosed && !isClosed) {
    closeIssue(issue.number);
    issue.state = 'CLOSED';
    return 'closed';
  }
  if (!shouldBeClosed && isClosed) {
    reopenIssue(issue.number);
    issue.state = 'OPEN';
    return 'reopened';
  }
  return null;
}

// ---------- 메인 ----------
function main() {
  console.log('🔄 WBS.md ➔ GitHub Projects 증분 동기화 시작\n');

  const wbsParents = parseWbsMarkdown();
  const allIssues = getAllIssues();
  console.log(`- 로컬 wbs.md 파싱: 섹션 ${wbsParents.length}개`);
  console.log(`- 저장소 이슈 조회(OPEN+CLOSED): ${allIssues.length}개`);

  const issueMapByTitle = {};
  for (const issue of allIssues) issueMapByTitle[issue.title.trim()] = issue;

  for (let i = 0; i < wbsParents.length; i++) {
    const wbsParent = wbsParents[i];
    console.log(`\n📂 [${i + 1}/${wbsParents.length}] "${wbsParent.title}"`);

    // 부모 이슈 찾기/생성
    let parentIssue = issueMapByTitle[wbsParent.title.trim()];
    if (!parentIssue) {
      const created = createRepoIssue(wbsParent.title, '### 세부 작업 목록');
      if (!created) {
        console.error('   ❌ 부모 이슈 생성 실패');
        continue;
      }
      parentIssue = {
        id: getIssueGraphQLIdByNumber(created.number),
        number: created.number,
        title: wbsParent.title,
        body: '### 세부 작업 목록',
        state: 'OPEN',
        parent: null,
      };
      issueMapByTitle[wbsParent.title.trim()] = parentIssue;
      console.log(`   -> 부모 이슈 생성 #${parentIssue.number}`);
    } else {
      if (!parentIssue.id) parentIssue.id = getIssueGraphQLIdByNumber(parentIssue.number);
      console.log(`   -> 부모 이슈 존재 #${parentIssue.number}`);
    }

    const parentCleanName = wbsParent.title.replace(/^\d+\.\s*/, '').trim();
    const childRefs = [];

    for (const wbsChild of wbsParent.children) {
      const childTitle = `[${parentCleanName}] ${wbsChild.title}`.trim();
      const childBody = wbsChild.bodyLines.join('\n');

      let childIssue = issueMapByTitle[childTitle];
      if (!childIssue) {
        const created = createRepoIssue(childTitle, childBody);
        if (!created) {
          console.error(`      ❌ 자식 이슈 생성 실패: ${wbsChild.title}`);
          continue;
        }
        addProjectItem(created.url, wbsChild.priority);
        childIssue = {
          id: getIssueGraphQLIdByNumber(created.number),
          number: created.number,
          title: childTitle,
          body: childBody,
          state: 'OPEN',
          parent: null,
        };
        issueMapByTitle[childTitle] = childIssue;
        console.log(`      -> 생성 #${childIssue.number} ${wbsChild.title}`);
      }

      // 네이티브 부모-자식 링크
      if (!childIssue.parent || childIssue.parent.number !== parentIssue.number) {
        if (!childIssue.id) childIssue.id = getIssueGraphQLIdByNumber(childIssue.number);
        if (parentIssue.id && childIssue.id && linkSubIssue(parentIssue.id, childIssue.id)) {
          childIssue.parent = { id: parentIssue.id, number: parentIssue.number };
        }
      }

      // 완료 상태 맞춤 ([x] → closed / [ ] → open)
      const r = reconcileState(childIssue, wbsChild.checked);
      if (r) console.log(`      -> #${childIssue.number} ${r}`);

      childRefs.push(`- [${wbsChild.checked ? 'x' : ' '}] #${childIssue.number}`);
    }

    // 부모 본문 체크리스트 갱신
    const expectedBody = `### 세부 작업 목록\n${childRefs.join('\n')}`;
    if ((parentIssue.body || '').trim() !== expectedBody.trim()) {
      updateRepoIssueBody(parentIssue.number, expectedBody);
      parentIssue.body = expectedBody;
    }

    // 부모를 Project 에 추가(우선순위 = 자식 중 최상위)
    addProjectItem(`https://github.com/${REPO}/issues/${parentIssue.number}`, wbsParent.priority);

    // 모든 항목이 완료면 부모도 closed, 아니면 open 유지
    if (wbsParent.children.length > 0) {
      reconcileState(
        parentIssue,
        wbsParent.children.every((c) => c.checked),
      );
    }
  }

  console.log('\n✅ 증분 동기화 완료.');
}

main();
