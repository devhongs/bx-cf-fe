import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  appendImportedItems,
  findUntrackedItems,
  normalizeProjectItem,
  projectItemsFromConnection,
  renderImportedSection,
} from './wbs-pull.lib.js';

describe('normalizeProjectItem', () => {
  it('maps issue state and project priority to WBS values', () => {
    assert.deepEqual(
      normalizeProjectItem({
        id: 'PVTI_issue',
        type: 'ISSUE',
        content: {
          id: 'I_42',
          number: 42,
          title: '로그인 오류 처리',
          body: '오류 코드를 화면에 표시한다.',
          state: 'CLOSED',
        },
        status: 'Done',
        priority: 'P0',
      }),
      {
        marker: 'ISSUE:I_42',
        number: 42,
        title: '로그인 오류 처리',
        body: '오류 코드를 화면에 표시한다.',
        checked: true,
        priorityTag: 'Must',
      },
    );
  });

  it('supports draft issues and ignores pull requests', () => {
    assert.deepEqual(
      normalizeProjectItem({
        id: 'PVTI_draft',
        type: 'DRAFT_ISSUE',
        content: { id: 'DI_7', title: '초안 작업', body: '', state: null },
        status: 'Todo',
        priority: 'P2',
      }),
      {
        marker: 'DRAFT_ISSUE:DI_7',
        number: null,
        title: '초안 작업',
        body: '',
        checked: false,
        priorityTag: 'Could',
      },
    );

    assert.equal(
      normalizeProjectItem({
        id: 'PVTI_pr',
        type: 'PULL_REQUEST',
        content: { id: 'PR_1', title: 'PR', body: '', state: 'OPEN' },
      }),
      null,
    );
  });
});

describe('projectItemsFromConnection', () => {
  it('reads content and single-select fields from a Project V2 response', () => {
    const connection = {
      nodes: [
        {
          id: 'PVTI_1',
          type: 'ISSUE',
          content: {
            id: 'I_1',
            number: 11,
            title: '프로젝트 항목',
            body: '본문',
            state: 'OPEN',
          },
          fieldValues: {
            nodes: [
              { field: { name: 'Status' }, name: 'In Progress' },
              { field: { name: 'Priority' }, name: 'P1' },
            ],
          },
        },
      ],
    };

    assert.deepEqual(projectItemsFromConnection(connection), [
      {
        marker: 'ISSUE:I_1',
        number: 11,
        title: '프로젝트 항목',
        body: '본문',
        checked: false,
        priorityTag: 'Should',
      },
    ]);
  });
});

describe('findUntrackedItems', () => {
  it('excludes items already represented by marker or normalized title', () => {
    const wbs = `
### 01. 기존
- [ ] 기존 제목 [Must]
  <!-- github-item:ISSUE:I_1 -->
- [ ] 마커 없는 제목 [Should]
- [ ] [협업] 접두사 작업 [Must]
`;
    const items = [
      { marker: 'ISSUE:I_1', title: '변경된 제목' },
      { marker: 'ISSUE:I_2', title: '마커 없는 제목' },
      { marker: 'ISSUE:I_parent', title: '01. 기존' },
      { marker: 'ISSUE:I_prefixed', title: '[기존] [협업] 접두사 작업' },
      { marker: 'DRAFT_ISSUE:DI_3', title: '새 작업' },
    ];

    assert.deepEqual(findUntrackedItems(wbs, items), [items[4]]);
  });
});

describe('renderImportedSection', () => {
  it('renders append-only WBS markdown with an identity marker and indented body', () => {
    assert.equal(
      renderImportedSection([
        {
          marker: 'ISSUE:I_42',
          title: '신규 작업',
          body: '첫 줄\n- 세부 항목',
          checked: false,
          priorityTag: 'Should',
        },
      ]),
      `### GitHub Project 가져오기
- [ ] 신규 작업 [Should]
  <!-- github-item:ISSUE:I_42 -->
  첫 줄
  - 세부 항목
`,
    );
  });

  it('appends to the import section before the next WBS section', () => {
    const wbs = `### GitHub Project 가져오기
- [ ] 기존 가져오기

### 99. 다음 섹션
- [ ] 다음 작업
`;

    const result = appendImportedItems(wbs, [
      {
        marker: 'ISSUE:I_99',
        title: '추가 가져오기',
        body: '',
        checked: false,
        priorityTag: null,
      },
    ]);

    assert.match(
      result,
      /기존 가져오기\n+- \[ \] 추가 가져오기\n {2}<!-- github-item:ISSUE:I_99 -->\n\n### 99\. 다음 섹션/,
    );
  });
});
