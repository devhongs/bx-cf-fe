# 코드 행 액션 시인성 개선 구현 계획

> **에이전트 작업자용:** 필수 하위 스킬로 `superpowers:test-driven-development`를 사용해 아래 단계를 순서대로 구현한다. 현재 세션에서 직접 실행할 때는 `superpowers:executing-plans`도 사용한다. 각 단계는 체크박스(`- [ ]`)로 추적한다.

**목표:** 관리자 코드 그룹 드로어에서 코드 추가와 행 삭제 액션을 의미색으로 명확히 구분하되, 하단 저장 버튼의 주요 액션 위계를 유지한다.

**구조:** 기존 공용 `Button`의 `outline` 변형과 앱 전용 CSS 클래스를 조합해 추가 버튼을 소프트 강조색으로 표현한다. 행 삭제 버튼은 편집 그리드 내부 구현을 유지하면서 `Trash2` 아이콘과 소프트 위험색을 적용하고, 기존 필드 배열 추가·삭제 동작과 접근성 이름은 그대로 보존한다.

**기술 스택:** React 19, TypeScript, React Hook Form 기반 `useFieldArray`, CSS Modules, Lucide React, Vitest, Testing Library

## 전역 제약

- 단색 강조 배경은 하단 `저장` 버튼에만 사용한다.
- 삭제 버튼은 기본 상태부터 위험색을 노출한다.
- 라이트·다크 관리자 테마 모두 기존 `--accent`, `--danger`, `--border` 토큰만 사용하고 원시 색상값을 추가하지 않는다.
- API 호출, 폼 유효성 검사, 그룹 삭제, 저장, 확인창 동작은 변경하지 않는다.
- 공용 버튼 API나 공용 변형을 추가하지 않는다.
- 현재 작업 트리의 관련 없는 변경은 스테이징하거나 수정하지 않는다.

---

### 작업 1: 코드 추가·행 삭제 액션의 의미색과 아이콘 적용

**파일:**
- 수정: `apps/admin-portal/src/features/code-group-form/ui/CodeGroupFormDrawer.test.tsx`
- 수정: `apps/admin-portal/src/features/code-group-form/ui/CodeGroupFormDrawer.tsx`
- 수정: `apps/admin-portal/src/features/code-group-form/ui/CodeGroupFormDrawer.module.css`

**인터페이스:**
- 사용: 공용 `Button`의 `variant="outline"`, `size="sm"` 속성과 Lucide의 `Plus`, `Trash2` 컴포넌트
- 유지: `append({ code: '', codeNm: '', useYn: 'Y' })`, `remove(index)`, `aria-label={`${index + 1}번째 코드 삭제`}`
- 생성: 앱 전용 CSS 클래스 `addButton`, 기존 `removeButton`의 소프트 위험색 상태 스타일

- [ ] **1단계: 시각 의미와 행 삭제 동작을 고정하는 실패 테스트 작성**

`CodeGroupFormDrawer.test.tsx`의 Testing Library import에 `fireEvent`를 추가하고 `describe` 블록을 다음과 같이 작성한다.

```tsx
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

describe('CodeGroupFormDrawer', () => {
  it('코드 추가와 행 삭제를 의미색 아이콘 액션으로 렌더링한다', () => {
    render(<CodeGroupFormDrawer open onClose={vi.fn()} />);

    const addButton = screen.getByRole('button', { name: '코드 추가' });

    expect(addButton.className).toContain('outline');
    expect(addButton.className).toContain('sizeSm');
    expect(addButton.className).toContain('addButton');
    expect(addButton.querySelector('svg')).not.toBeNull();

    fireEvent.click(addButton);

    const removeButton = screen.getByRole('button', { name: '1번째 코드 삭제' });

    expect(removeButton.className).toContain('removeButton');
    expect(removeButton.querySelector('svg')).not.toBeNull();
  });

  it('선택한 코드 행만 삭제한다', () => {
    render(<CodeGroupFormDrawer open onClose={vi.fn()} />);

    const addButton = screen.getByRole('button', { name: '코드 추가' });
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    const firstCode = document.querySelector<HTMLInputElement>('input[name="codes.0.code"]');
    const secondCode = document.querySelector<HTMLInputElement>('input[name="codes.1.code"]');

    expect(firstCode).not.toBeNull();
    expect(secondCode).not.toBeNull();
    fireEvent.change(firstCode!, { target: { value: 'FIRST' } });
    fireEvent.change(secondCode!, { target: { value: 'SECOND' } });

    fireEvent.click(screen.getByRole('button', { name: '1번째 코드 삭제' }));

    expect(
      document.querySelector<HTMLInputElement>('input[name="codes.0.code"]')?.value,
    ).toBe('SECOND');
    expect(document.querySelector('input[name="codes.1.code"]')).toBeNull();
  });
});
```

- [ ] **2단계: 테스트가 현재 구현에서 실패하는지 확인**

실행:

```bash
pnpm --filter admin-portal test -- CodeGroupFormDrawer.test.tsx
```

예상: 첫 번째 테스트가 `addButton` 클래스가 없거나 삭제 버튼 안에 SVG가 없어서 실패한다. 두 번째 테스트는 기존 `remove(index)` 동작을 보호하며 통과할 수 있다.

- [ ] **3단계: 컴포넌트에 소프트 강조 클래스와 휴지통 아이콘 적용**

`CodeGroupFormDrawer.tsx`에서 아이콘 import와 두 버튼을 다음 형태로 변경한다.

```tsx
import { Plus, Trash2 } from 'lucide-react';

<Button
  type="button"
  size="sm"
  variant="outline"
  className={codeStyles.addButton}
  onClick={() => append({ code: '', codeNm: '', useYn: 'Y' })}
>
  <Plus aria-hidden="true" />
  코드 추가
</Button>

<button
  type="button"
  className={codeStyles.removeButton}
  aria-label={`${index + 1}번째 코드 삭제`}
  onClick={() => remove(index)}
>
  <Trash2 aria-hidden="true" />
</button>
```

- [ ] **4단계: 앱 전용 소프트 의미색 스타일 구현**

`CodeGroupFormDrawer.module.css`에 추가 버튼 상태를 넣고 기존 `.removeButton` 블록을 다음 내용으로 교체한다.

```css
.header .addButton {
  border-color: color-mix(in srgb, var(--accent) 62%, var(--border));
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  color: var(--accent);
  font-weight: 700;
}

.header .addButton:hover {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 18%, transparent);
}

.header .addButton:focus-visible {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 35%, transparent);
}

.removeButton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 36px;
  padding: 0;
  border: 1px solid color-mix(in srgb, var(--danger) 62%, var(--border));
  border-radius: 6px;
  background: color-mix(in srgb, var(--danger) 10%, transparent);
  color: var(--danger);
  cursor: pointer;
  transition: color 0.15s, background-color 0.15s, border-color 0.15s, box-shadow 0.15s;
}

.removeButton svg {
  width: 15px;
  height: 15px;
}

.removeButton:hover {
  border-color: var(--danger);
  background: color-mix(in srgb, var(--danger) 17%, transparent);
}

.removeButton:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--danger) 35%, transparent);
}
```

- [ ] **5단계: 관련 테스트가 통과하는지 확인**

실행:

```bash
pnpm --filter admin-portal test -- CodeGroupFormDrawer.test.tsx
```

예상: `CodeGroupFormDrawer` 테스트 2개가 모두 통과한다.

- [ ] **6단계: 타입과 CSS 토큰 규칙 검증**

실행:

```bash
pnpm --filter admin-portal check
pnpm check:css-tokens
```

예상: TypeScript 오류가 없고 `CSS token check passed.`가 출력된다.

- [ ] **7단계: 관리자 라이트·다크 테마에서 시각적 위계 확인**

실행:

```bash
pnpm dev:admin
```

브라우저에서 `http://localhost:3002/codes`를 열고 코드 그룹을 선택한다. 두 테마 모두에서 다음을 확인한다.

- `코드 추가`는 옅은 청록 배경·청록 테두리·플러스 아이콘으로 입력 필드보다 잘 보인다.
- 행 삭제는 기본 상태부터 옅은 붉은 배경·붉은 테두리·휴지통 아이콘으로 보인다.
- 두 액션 모두 하단의 단색 `저장` 버튼보다 약하게 보인다.
- 키보드 포커스 링과 호버 상태가 각각 강조색과 위험색으로 구분된다.

- [ ] **8단계: 관련 파일만 커밋**

```bash
git add \
  apps/admin-portal/src/features/code-group-form/ui/CodeGroupFormDrawer.test.tsx \
  apps/admin-portal/src/features/code-group-form/ui/CodeGroupFormDrawer.tsx \
  apps/admin-portal/src/features/code-group-form/ui/CodeGroupFormDrawer.module.css
git commit -m "style(admin): improve code row action visibility"
```

예상: 위 세 파일만 커밋되고, 작업 트리의 다른 변경은 스테이징되지 않는다.
