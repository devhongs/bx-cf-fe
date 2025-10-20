//  @ts-check
import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  // 설정 파일들을 완전히 제외
  {
    ignores: ['*.config.js', '*.config.ts', 'vite.config.ts'],
  },
  ...tanstackConfig,
  // 임포트 순서 정렬
  {
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
    },
  },
]
