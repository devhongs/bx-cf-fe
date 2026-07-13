import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  buildContentBlocks,
  buildNotionProperties,
  buildSectionProperties,
  parseWbsMarkdown,
  resolveStatus,
} from './wbs-notion-sync.lib.js';

describe('parseWbsMarkdown', () => {
  it('returns sectioned tasks with body and stable sync keys', () => {
    const markdown = `### 03. 인증
- [x] 로그인 API 연동 [Must]
  * **목적**: 인증 처리
  * **완료 조건(AC)**:
    - 토큰 발급
`;

    assert.deepEqual(parseWbsMarkdown(markdown), [
      {
        section: '03. 인증',
        title: '로그인 API 연동',
        priority: 'Must',
        checked: true,
        description: '* **목적**: 인증 처리\n* **완료 조건(AC)**:\n  - 토큰 발급',
        syncKey: 'wbs:03. 인증:로그인 API 연동',
      },
    ]);
  });
});

describe('Notion mapping', () => {
  it('maps WBS priority and properties to the existing schema', () => {
    const task = {
      section: '03. 인증',
      title: '로그인 API 연동',
      priority: 'Should',
      checked: false,
      description: '상세 내용',
      syncKey: 'wbs:03. 인증:로그인 API 연동',
    };

    assert.deepEqual(buildNotionProperties(task, 'Not started', 'parent-page-id'), {
      'Task name': { title: [{ text: { content: '로그인 API 연동' } }] },
      Status: { status: { name: 'Not started' } },
      Priority: { select: { name: 'Medium' } },
      Section: { select: { name: '03. 인증' } },
      Description: { rich_text: [{ text: { content: '상세 내용' } }] },
      'Sync Key': { rich_text: [{ text: { content: 'wbs:03. 인증:로그인 API 연동' } }] },
      'Parent task': { relation: [{ id: 'parent-page-id' }] },
    });
  });

  it('preserves in-progress work while completed WBS tasks become done', () => {
    assert.equal(resolveStatus(false, 'In progress'), 'In progress');
    assert.equal(resolveStatus(false, 'Done'), 'Not started');
    assert.equal(resolveStatus(true, 'In progress'), 'Done');
  });

  it('creates section parent properties and structured page blocks', () => {
    assert.deepEqual(buildSectionProperties('03. 인증'), {
      'Task name': { title: [{ text: { content: '03. 인증' } }] },
      Status: { status: { name: 'Not started' } },
      Priority: { select: null },
      Section: { select: { name: '03. 인증' } },
      Description: { rich_text: [] },
      'Sync Key': { rich_text: [{ text: { content: 'wbs-section:03. 인증' } }] },
    });

    const blocks = buildContentBlocks(
      '* **목적**: 인증 처리\n* **작업 내용**:\n  - API 호출\n* **완료 조건(AC)**:\n  - 토큰 발급',
    );
    assert.deepEqual(
      blocks.map((block) => [block.type, block[block.type].rich_text[0].text.content]),
      [
        ['heading_2', '목적'],
        ['paragraph', '인증 처리'],
        ['heading_2', '작업 내용'],
        ['bulleted_list_item', 'API 호출'],
        ['heading_2', '완료 조건(AC)'],
        ['bulleted_list_item', '토큰 발급'],
      ],
    );
  });
});
