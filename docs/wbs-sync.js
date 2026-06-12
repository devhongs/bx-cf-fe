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
  'Must Have': 'bf905d18',   // P0
  'Should Have': 'de852fb6', // P1
  'Could Have': 'dc19bd70',  // P2
  "Won't Have": null
};

// Helper mapping issue title prefixes to priorities
function getPriorityByTitle(title) {
  const match = title.match(/^(\d+)\./);
  if (match) {
    const num = parseInt(match[1], 10);
    if (num >= 1 && num <= 8) return 'Must Have';
    if (num >= 9 && num <= 13) return 'Should Have';
    if (num >= 14 && num <= 19) return 'Could Have';
    return "Won't Have";
  }
  // For child issues, look at their prefix bracket: e.g. "[프로젝트 기반 구축] 모노레포 설정"
  const childPrefixMatch = title.match(/^\[(.*?)\]/);
  if (childPrefixMatch) {
    const parentName = childPrefixMatch[1].trim();
    // Guess priority from parent numbering logic
    if (parentName.includes('프로젝트 기반') || parentName.includes('라우팅') || parentName.includes('인증') || parentName.includes('API 연동') || parentName.includes('Mock API') || parentName.includes('공통 레이아웃') || parentName.includes('핵심 업무') || parentName.includes('상태 관리')) {
      return 'Must Have';
    }
    if (parentName.includes('테스트') || parentName.includes('CI/CD') || parentName.includes('폼 처리') || parentName.includes('UX 기본') || parentName.includes('보안 기본')) {
      return 'Should Have';
    }
    if (parentName.includes('제외') || parentName.includes('범위 제외')) {
      return "Won't Have";
    }
    return 'Could Have';
  }
  return null;
}

function runGraphQL(query, variables = {}) {
  try {
    const payload = { query };
    if (Object.keys(variables).length > 0) {
      payload.variables = variables;
    }
    
    const payloadPath = path.resolve('docs/graphql_payload.json');
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
    const res = execSync(`"${GH_PATH}" ${args}`, { encoding: 'utf-8' });
    return JSON.parse(res.trim());
  } catch (err) {
    return null;
  }
}

// Fetch all open issues in the repo (paginated — repos can exceed 100 issues)
function getOpenIssues() {
  const all = [];
  let after = null;
  while (true) {
    const query = `
      query {
        repository(owner: "${OWNER}", name: "${REPO_NAME}") {
          issues(first: 100, states: OPEN${after ? `, after: "${after}"` : ''}) {
            pageInfo { hasNextPage endCursor }
            nodes {
              id
              number
              title
              body
              parent {
                id
                number
              }
            }
          }
        }
      }
    `;
    const res = runGraphQL(query);
    if (!res || !res.data || !res.data.repository) break;
    const conn = res.data.repository.issues;
    all.push(...conn.nodes);
    if (!conn.pageInfo.hasNextPage) break;
    after = conn.pageInfo.endCursor;
  }
  return all;
}

// Get GraphQL ID by issue number
function getIssueGraphQLIdByNumber(number) {
  const query = `
    query {
      repository(owner: "${OWNER}", name: "${REPO_NAME}") {
        issue(number: ${number}) {
          id
        }
      }
    }
  `;
  const res = runGraphQL(query);
  if (res && res.data && res.data.repository && res.data.repository.issue) {
    return res.data.repository.issue.id;
  }
  return null;
}

// Parse wbs.md
function parseWbsMarkdown() {
  const content = fs.readFileSync(WBS_MD_PATH, 'utf-8');
  const lines = content.split(/\r?\n/);
  
  const wbs = [];
  let currentPriority = null;
  let currentParent = null;
  let currentChild = null;

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('## 🔴 Must Have')) {
      currentPriority = 'Must Have';
      currentParent = null;
      currentChild = null;
      continue;
    } else if (trimmed.startsWith('## 🟡 Should Have')) {
      currentPriority = 'Should Have';
      currentParent = null;
      currentChild = null;
      continue;
    } else if (trimmed.startsWith('## 🟢 Could Have')) {
      currentPriority = 'Could Have';
      currentParent = null;
      currentChild = null;
      continue;
    } else if (trimmed.startsWith('## ⚪ Won\'t Have')) {
      currentPriority = "Won't Have";
      currentParent = null;
      currentChild = null;
      continue;
    }

    if (trimmed.startsWith('#') && !trimmed.startsWith('###')) continue;
    if (trimmed.startsWith('※')) continue;

    if (trimmed.startsWith('###')) {
      // Parent WBS topic: e.g. "### 01. 프로젝트 기반 구축"
      const title = trimmed.replace(/^###\s*/, '');
      currentParent = {
        title: title,
        priority: currentPriority,
        children: []
      };
      wbs.push(currentParent);
      currentChild = null;
    } else if (trimmed.startsWith('- [ ]')) {
      // Child task: e.g. "- [ ] 모노레포 구조 설정"
      if (currentParent) {
        const titleText = trimmed.replace(/^- \[ \]\s*/, '');
        currentChild = {
          title: titleText,
          bodyLines: []
        };
        currentParent.children.push(currentChild);
      }
    } else {
      // Bullets or detail description
      if (currentChild) {
        currentChild.bodyLines.push(trimmed);
      }
    }
  }

  return wbs;
}

function createRepoIssue(title, body) {
  const titleEscaped = title.replace(/"/g, '\\"');
  
  const tempPath = path.resolve('docs/temp_body_create.txt');
  fs.writeFileSync(tempPath, body);
  
  const cmd = `issue create --repo ${REPO} --title "${titleEscaped}" --body-file "${tempPath}"`;
  const url = runCommandRaw(cmd);
  
  try { fs.unlinkSync(tempPath); } catch {}

  if (url && url.startsWith('http')) {
    const parts = url.split('/');
    const number = parseInt(parts[parts.length - 1], 10);
    return { url, number };
  }
  return null;
}

function updateRepoIssueBody(number, body) {
  const tempPath = path.resolve('docs/temp_body_update.txt');
  fs.writeFileSync(tempPath, body);
  runCommandRaw(`issue edit ${number} --repo ${REPO} --body-file "${tempPath}"`);
  try { fs.unlinkSync(tempPath); } catch {}
}

function linkSubIssue(parentId, childId) {
  const query = `
    mutation($parent: ID!, $child: ID!) {
      addSubIssue(input: { issueId: $parent, subIssueId: $child }) {
        issue { number }
        subIssue { number }
      }
    }
  `;
  const res = runGraphQL(query, { parent: parentId, child: childId });
  return !!(res && res.data && res.data.addSubIssue);
}

function addProjectItem(url, priority) {
  const addRes = runCommandJSON(`project item-add ${PROJECT_NUMBER} --owner ${OWNER} --url "${url}" --format json`);
  if (addRes && addRes.id) {
    const itemId = addRes.id;
    const priorityOptionId = PRIORITY_MAP[priority];
    if (priorityOptionId) {
      const editCmd = `project item-edit --id "${itemId}" --field-id "${PRIORITY_FIELD_ID}" --project-id "${PROJECT_ID}" --single-select-option-id "${priorityOptionId}"`;
      runCommandRaw(editCmd);
    }
  }
}

async function main() {
  console.log('🔄 WBS.md ➔ GitHub Projects 동기화 시작\n');
  
  const wbsParents = parseWbsMarkdown();
  const openIssues = getOpenIssues();
  console.log(`- 로컬 wbs.md 파싱 완료: 대주제 ${wbsParents.length}개`);
  console.log(`- 저장소 내 Open 이슈 조회 완료: ${openIssues.length}개`);

  // Create mappings of title/number to issue objects
  const issueMapByTitle = {};
  const issueMapByNumber = {};
  for (const issue of openIssues) {
    issueMapByTitle[issue.title.trim()] = issue;
    issueMapByNumber[issue.number] = issue;
  }

  // Iterate over parents defined in wbs.md
  for (let i = 0; i < wbsParents.length; i++) {
    const wbsParent = wbsParents[i];
    console.log(`\n📂 [${i + 1}/${wbsParents.length}] 대주제 처리: "${wbsParent.title}"`);
    
    // Find or create parent issue
    let parentIssue = issueMapByTitle[wbsParent.title.trim()];
    if (!parentIssue) {
      console.log(`   -> ⚠️ 부모 이슈 미존재: 새 이슈를 생성합니다.`);
      const created = createRepoIssue(wbsParent.title, '### 세부 작업 목록');
      if (created) {
        console.log(`   -> 이슈 생성 성공: #${created.number}`);
        const gId = getIssueGraphQLIdByNumber(created.number);
        parentIssue = {
          id: gId,
          number: created.number,
          title: wbsParent.title,
          body: '### 세부 작업 목록'
        };
        issueMapByTitle[wbsParent.title.trim()] = parentIssue;
        issueMapByNumber[created.number] = parentIssue;
      } else {
        console.error(`   -> ❌ 부모 이슈 생성 실패!`);
        continue;
      }
    } else {
      console.log(`   -> ✅ 부모 이슈 존재: #${parentIssue.number}`);
    }

    const parentCleanName = wbsParent.title.replace(/^\d+\.\s*/, '').trim();
    const childRefs = [];

    // Process each child task under this parent
    for (let j = 0; j < wbsParent.children.length; j++) {
      const wbsChild = wbsParent.children[j];
      const childTitle = `[${parentCleanName}] ${wbsChild.title}`;
      const childBody = wbsChild.bodyLines.join('\n');
      
      let childIssue = issueMapByTitle[childTitle.trim()];
      if (!childIssue) {
        console.log(`      -> ⚠️ 자식 이슈 미존재: "${wbsChild.title}"`);
        const created = createRepoIssue(childTitle, childBody);
        if (created) {
          console.log(`      -> 이슈 생성 성공: #${created.number}`);
          // Add to project and set priority
          addProjectItem(created.url, wbsParent.priority);
          
          const gId = getIssueGraphQLIdByNumber(created.number);
          childIssue = {
            id: gId,
            number: created.number,
            title: childTitle,
            body: childBody
          };
          
          issueMapByTitle[childTitle.trim()] = childIssue;
          issueMapByNumber[created.number] = childIssue;
        } else {
          console.error(`      -> ❌ 자식 이슈 생성 실패!`);
          continue;
        }
      }

      childRefs.push(`- [ ] #${childIssue.number}`);

      // Verify native parent-child link
      if (!childIssue.parent || childIssue.parent.number !== parentIssue.number) {
        console.log(`      -> 🔗 하위 이슈 네이티브 링크 설정 중... (#${childIssue.number} -> #${parentIssue.number})`);
        const linked = linkSubIssue(parentIssue.id, childIssue.id);
        if (linked) {
          childIssue.parent = { id: parentIssue.id, number: parentIssue.number };
        }
      }
    }

    // Update parent issue body checklist if needed
    const expectedBody = `### 세부 작업 목록\n${childRefs.join('\n')}`;
    if (parentIssue.body.trim() !== expectedBody.trim()) {
      console.log(`   -> 📝 부모 이슈 본문 체크리스트 갱신 중... (#${parentIssue.number})`);
      updateRepoIssueBody(parentIssue.number, expectedBody);
      parentIssue.body = expectedBody; // Update local cache
    }

    // Ensure parent issue is on Project
    addProjectItem(`https://github.com/${REPO}/issues/${parentIssue.number}`, wbsParent.priority);
  }

  console.log('\n✅ WBS ➔ GitHub Projects 동기화 작업이 성료되었습니다.');
}

main();
