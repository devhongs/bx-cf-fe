// docs/wbs-force-sync.js
// ⚠️ 파괴적 스크립트: 저장소의 "모든 이슈를 삭제"한 뒤 docs/wbs.md 기준으로 처음부터 재생성합니다.
//   - wbs.md 의 [ ] 항목 → open 이슈, [x] 항목 → 생성 후 close 처리
//   - 섹션(### NN.)은 부모 이슈, 항목은 sub-issue 로 네이티브 링크
//   - 모든 이슈를 Project 에 추가하고 Priority(P0~P2) 필드 설정
//   - 한 섹션의 모든 항목이 [x] 이면 부모 이슈도 close
//
// 안전장치: 실제 실행은 `--yes` 플래그가 있어야 합니다. (없으면 미리보기만 출력)
//   미리보기:  node docs/wbs-force-sync.js
//   실   행:  node docs/wbs-force-sync.js --yes   (= pnpm wbs:force-sync --yes)

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const WBS_MD_PATH = path.resolve('docs/wbs.md');
const GH_PATH = 'C:/Program Files/GitHub CLI/gh.exe';
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

// ---------- gh 호출 헬퍼 ----------
function runGraphQL(query, variables = {}) {
  try {
    const payload = { query };
    if (Object.keys(variables).length > 0) payload.variables = variables;
    const payloadPath = path.resolve('docs/_force_payload.json');
    fs.writeFileSync(payloadPath, JSON.stringify(payload));
    const cmd = `"${GH_PATH}" api graphql -H "GraphQL-Features: sub_issues" --input "${payloadPath}"`;
    const res = execSync(cmd, { encoding: 'utf-8' });
    try { fs.unlinkSync(payloadPath); } catch {}
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

// ---------- 조회 / 변경 ----------
// 저장소의 모든 이슈 번호(OPEN+CLOSED, 페이지네이션) 수집
function getAllIssueNumbers() {
  const numbers = [];
  let after = null;
  while (true) {
    const query = `
      query {
        repository(owner: "${OWNER}", name: "${REPO_NAME}") {
          issues(first: 100, states: [OPEN, CLOSED]${after ? `, after: "${after}"` : ''}) {
            pageInfo { hasNextPage endCursor }
            nodes { number }
          }
        }
      }
    `;
    const res = runGraphQL(query);
    if (!res || !res.data || !res.data.repository) break;
    const conn = res.data.repository.issues;
    numbers.push(...conn.nodes.map((n) => n.number));
    if (!conn.pageInfo.hasNextPage) break;
    after = conn.pageInfo.endCursor;
  }
  return numbers;
}

function deleteIssue(number) {
  return runCommandRaw(`issue delete ${number} --repo ${REPO} --yes`);
}

function closeIssue(number) {
  return runCommandRaw(`issue close ${number} --repo ${REPO}`);
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
  const tempPath = path.resolve('docs/_force_body.txt');
  fs.writeFileSync(tempPath, body);
  const url = runCommandRaw(`issue create --repo ${REPO} --title "${titleEscaped}" --body-file "${tempPath}"`);
  try { fs.unlinkSync(tempPath); } catch {}
  if (url && url.startsWith('http')) {
    const number = parseInt(url.split('/').pop(), 10);
    return { url, number };
  }
  return null;
}

function updateRepoIssueBody(number, body) {
  const tempPath = path.resolve('docs/_force_body_update.txt');
  fs.writeFileSync(tempPath, body);
  runCommandRaw(`issue edit ${number} --repo ${REPO} --body-file "${tempPath}"`);
  try { fs.unlinkSync(tempPath); } catch {}
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
  const addRes = runCommandJSON(`project item-add ${PROJECT_NUMBER} --owner ${OWNER} --url "${url}" --format json`);
  if (addRes && addRes.id) {
    const optionId = PRIORITY_MAP[priority];
    if (optionId) {
      runCommandRaw(
        `project item-edit --id "${addRes.id}" --field-id "${PRIORITY_FIELD_ID}" --project-id "${PROJECT_ID}" --single-select-option-id "${optionId}"`,
      );
    }
  }
}

// ---------- wbs.md 파싱 ----------
// 우선순위는 항목 끝의 [Must]/[Should]/[Could]/[Won't] 태그로 정의됩니다.
const PRIORITY_TAG_MAP = {
  Must: 'Must Have',
  Should: 'Should Have',
  Could: 'Could Have',
  "Won't": "Won't Have",
};
const PRIORITY_RANK = { 'Must Have': 0, 'Should Have': 1, 'Could Have': 2, "Won't Have": 3 };

// 항목 텍스트 끝의 우선순위 태그를 분리 → { title(태그 제거), priority }
function extractPriority(text) {
  const m = text.match(/^(.*?)\s*\[(Must|Should|Could|Won't)\]\s*$/);
  if (m) return { title: m[1].trim(), priority: PRIORITY_TAG_MAP[m[2]] };
  return { title: text.trim(), priority: null };
}

// 반환: [{ title, priority, children: [{ title, priority, checked, bodyLines }] }]
//   - priority(parent)는 자식 중 가장 높은(긴급한) 우선순위로 산출
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

// ---------- 메인 ----------
function main() {
  const confirmed = process.argv.slice(2).includes('--yes');
  const parents = parseWbsMarkdown();

  const totalChildren = parents.reduce((s, p) => s + p.children.length, 0);
  const checkedChildren = parents.reduce((s, p) => s + p.children.filter((c) => c.checked).length, 0);

  console.log('🔁 WBS Force-Sync (전체 삭제 후 재생성)');
  console.log(`   - wbs.md: 섹션 ${parents.length}개 / 항목 ${totalChildren}개 (완료 ${checkedChildren} · 진행 ${totalChildren - checkedChildren})`);

  const existing = getAllIssueNumbers();
  console.log(`   - 기존 이슈: ${existing.length}개 (전부 삭제 예정)`);

  if (!confirmed) {
    console.log('\n⚠️  미리보기 모드입니다. 실제로 삭제·재생성하려면 --yes 를 붙여 실행하세요:');
    console.log('    node docs/wbs-force-sync.js --yes   (= pnpm wbs:force-sync --yes)');
    return;
  }

  // 1) 전체 삭제
  console.log('\n🗑️  기존 이슈 삭제 중...');
  for (const n of existing) {
    deleteIssue(n);
    console.log(`   - deleted #${n}`);
  }

  // 2) 재생성
  console.log('\n📦 wbs.md 기준 재생성 중...');
  for (let i = 0; i < parents.length; i++) {
    const p = parents[i];
    console.log(`\n📂 [${i + 1}/${parents.length}] ${p.title}  (${p.priority})`);

    const parentCreated = createRepoIssue(p.title, '### 세부 작업 목록');
    if (!parentCreated) { console.error('   ❌ 부모 이슈 생성 실패'); continue; }
    const parentId = getIssueGraphQLIdByNumber(parentCreated.number);
    console.log(`   -> 부모 이슈 #${parentCreated.number}`);

    const cleanName = p.title.replace(/^\d+\.\s*/, '').trim();
    const childRefs = [];

    for (const c of p.children) {
      const title = `[${cleanName}] ${c.title}`;
      const created = createRepoIssue(title, c.bodyLines.join('\n'));
      if (!created) { console.error(`   ❌ 자식 이슈 생성 실패: ${c.title}`); continue; }

      addProjectItem(created.url, c.priority);
      const childId = getIssueGraphQLIdByNumber(created.number);
      if (parentId && childId) linkSubIssue(parentId, childId);
      if (c.checked) closeIssue(created.number);

      childRefs.push(`- [${c.checked ? 'x' : ' '}] #${created.number}`);
      console.log(`      -> #${created.number} ${c.checked ? '[closed]' : ''} ${c.title}`);
    }

    // 부모 본문 체크리스트 갱신 + Project 추가
    updateRepoIssueBody(parentCreated.number, `### 세부 작업 목록\n${childRefs.join('\n')}`);
    addProjectItem(parentCreated.url, p.priority);

    // 모든 항목이 완료면 부모도 close
    if (p.children.length > 0 && p.children.every((c) => c.checked)) {
      closeIssue(parentCreated.number);
      console.log('   -> 모든 항목 완료 → 부모 이슈 close');
    }
  }

  console.log('\n✅ Force-Sync 완료. GitHub 이슈가 wbs.md 와 정확히 일치합니다.');
}

main();
