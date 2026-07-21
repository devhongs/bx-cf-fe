# 폼 아키텍처 (Form Components)

Date: 2026-07-02 (revision 4, 2026-07-13)

공유 폼 레이어의 설계와 사용 규칙을 기록한다. 신규 폼을 만들 때 이 문서의 컨벤션을 따른다.

> **개정 이력**
>
> 1. **초기 (2026-07-02):** 필드 `rules` prop을 커스텀 엔진(필드 레지스트리 + 자체 리졸버)이
>    Zod로 변환. 기각 — RHF·Zod가 이미 제공하는 것을 ~700줄로 재구현.
> 2. **Revision 2:** 폼당 Zod 스키마 + `useZodForm`/`zodResolver` (스키마 우선). 기각 —
>    화면이 늘수록 스키마 보일러플레이트 증가, 검증이 필드 옆에 보이지 않음,
>    cross-field stale 에러를 풀 수 없음.
> 3. **Revision 3:** RHF 네이티브 rules 모드로 전환. 편의 prop → `RegisterOptions` 매핑만
>    수행(엔진 없음). Zod·`@hookform/resolvers` 의존성 제거.
> 4. **Revision 4 (현재):** 계층 구조 확정 — shared `useBaseForm`/`Form` 위에 앱별
>    `useAppForm`/`AppForm` 한 벌. 타입 필드 반환으로 제네릭 반복 제거, 스타일 context
>    상속으로 스타일 반복 제거. `FormItem`(래퍼 제작용 소켓) 도입 방향 합의.

## 한 줄 요약

**react-hook-form을 그대로 쓰되, "폼 화면에는 `<FormXxx>` 한 가지 형식만 등장한다"를
계층 설계로 강제한다.** 커스텀 검증 엔진·스키마 DSL·props 주입 마법은 만들지 않는다.

## 설계 원칙

1. **래퍼는 얇게.** 인수인계받는 사람이 RHF 공식 문서만 알면 코드를 읽을 수 있어야 한다.
   우리가 소유하는 마법(주입기·엔진·DSL)은 만들지 않는다.
2. **컨벤션은 조건 없이 하나.** "상황 A면 패턴 X, 상황 B면 패턴 Y"는 팀에서 지켜지지
   않는다. 약간 덜 최적이어도 규칙이 하나인 쪽을 고른다.
3. **반복은 계층이 흡수한다.** 필드마다 반복되던 것(스타일 지정, 제네릭 선언)은 훅과
   앱 래퍼가 한 번씩만 처리한다.

## 계층 구조

```txt
@bx/shared (앱 무관 — 메커니즘만, 스타일을 모름)
 ├ useBaseForm      폼 인스턴스 생성 + reset 로직 + "타입 바인딩된 필드" 반환
 ├ Form             FormProvider + <form> + 스타일 기본값을 context로 하위 상속
 ├ FormItem         바인딩+label+에러를 가진 범용 소켓 (래퍼 제작 전용, 화면 사용 금지)
 ├ FormInput / FormSelect / FormTextarea / FormAccountInput
 │                  화면이 쓰는 완제품 필드 (FormItem 위의 설탕)
 ├ FormSubmitButton isSubmitting 반영 제출 버튼
 └ rules / messages 편의 prop → RHF RegisterOptions 매핑, 검증 메시지 단일 출처

각 앱 — 앱마다 폼 한 벌 (admin-portal, pc-web)
 ├ useAppForm       useBaseForm + 앱 기본 옵션
 │                  (admin: resetOnDefaultValuesChange 기본 활성 — 드로어 CRUD용)
 └ AppForm          Form + 앱 스타일 기본값
                    (admin: 그리드 필드 레이아웃 / pc-web: 다크 토큰 컨트롤)

화면 (feature)
 └ useAppForm에서 form과 필드를 꺼내 AppForm 안에 나열
```

`FormItem`은 새 `FormXxx` 래퍼 제작 전용이다. 화면에서는 직접 사용하지 않는다.
폼 그리드 배치용 래퍼가 필요하면 `AppFormGridItem`처럼 앱 전용 컴포넌트로 별도 구성한다.

## 화면 코드 표준형

모든 폼 화면은 이 모양이다:

```tsx
import { AppForm, useAppForm } from '@/shared/ui/admin-form';

const { form, FormInput, FormSelect } = useAppForm<MenuFormValues>({ defaultValues });

const handleSubmit = (values: MenuFormValues) => onSubmit(toPayload(values));

return (
  <AppForm id={id} form={form} onSubmit={handleSubmit}>
    <FormInput label="메뉴코드" name="menuCd" required />
    <FormSelect label="메뉴유형" name="menuType" options={menuTypeOptions} />
    <FormInput label="메뉴명" name="menuNm" required fieldClassName={fullFieldClassName} />
  </AppForm>
);
```

- **제네릭은 `useAppForm<T>()` 한 번.** 반환되는 `FormInput` 등은 shared 컴포넌트를 이
  폼의 값 타입으로 좁힌 **같은 참조**다(래핑이 아니므로 리렌더 시 remount 없음).
  `name` 오타, `validate` 인자, `deps` 목록이 전부 컴파일 타임에 검사된다.
- **스타일은 `AppForm`이 context로 상속.** 필드에는 full-width 같은 예외만 지정한다.
  스타일 기본값의 단일 출처는 각 앱의 `AppForm` 정의부다.
- **검증은 필드 prop.** RHF `RegisterOptions` 어휘 그대로이며 전부 RHF가 실행한다.

## 검증 규칙 (rules 모드)

| ID | 내용 |
| --- | --- |
| FRM-041 | **resolver 금지.** RHF는 resolver가 설정되면 필드 rules를 조용히 무시하므로 두 모드를 섞을 수 없다. 전 코드베이스 rules 모드 단일화. |
| FRM-010 | 필드 검증은 RHF `RegisterOptions`와 이름이 같은 prop으로 선언: `required` `minLength` `maxLength` `min` `max` `pattern` `validate` `deps`. |
| FRM-042 | 검증 실행은 전부 RHF 내장 엔진. shared는 prop과 기본 메시지 매핑만 한다. |
| FRM-043 | `rules` prop이 전체 `RegisterOptions` escape hatch. |
| FRM-027 | 타이밍은 RHF 기본값: 제출 시 검증, 변경 시 재검증, 첫 에러 포커스. |

메시지 규약 (RHF의 value/message 형태 그대로):

```tsx
<FormInput name="userId" required minLength={4} />
// required      → '필수 입력 항목입니다.'   (VALIDATION_MESSAGES 단일 출처)
// minLength={4} → '4자 이상 입력해주세요.'

<FormInput name="userId" required="아이디를 입력하세요." minLength={{ value: 4, message: '너무 짧습니다.' }} />
```

cross-field는 `validate(value, values)` + 상대 필드의 `deps`
(RHF 의미: deps를 가진 필드가 바뀌면 지정된 필드들이 재검증):

```tsx
<FormInput name="password" required minLength={8} deps={['passwordConfirm']} />
<FormInput
  name="passwordConfirm"
  required
  validate={(value, values) => value === values.password || '비밀번호가 일치하지 않습니다.'}
/>
```

## 확장 규칙 — 새 컨트롤 추가

| ID | 내용 |
| --- | --- |
| FRM-050 | **폼 화면에는 `FormXxx`만 등장한다.** `FormItem`·render prop이 화면 코드에 보이면 규칙 위반. |
| FRM-051 | 새 컨트롤이 필요하면 `FormItem`으로 래퍼(~15줄)를 만들어 승격한다. 앱 전용이면 앱에, 범용이면 shared에 둔다. 일회성이어도 래퍼를 만든다. |
| FRM-052 | `FormItem`은 바인딩을 **render prop**으로 넘긴다(`(control) => <DatePicker {...control} />`). AntD식 cloneElement 주입은 쓰지 않는다 — 자식을 한 겹만 감싸도 조용히 바인딩이 끊기고 타입 검증이 불가하기 때문. |

```tsx
// 래퍼 예시 — 새 컨트롤 추가 비용의 전부
export function FormDatePicker<T extends FieldValues>({ name, label, ...props }: Props<T>) {
  return (
    <FormItem name={name} label={label} {...itemProps}>
      {(control) => <DatePicker {...control} {...props} />}
    </FormItem>
  );
}
```

## 데이터 초기화 (조회값 → 폼)

| ID | 내용 |
| --- | --- |
| FRM-060 | **렌더 게이트 + 스냅샷.** 페이지가 `useQuery`로 조회하고, `isPending`이면 스켈레톤, 데이터가 오면 폼 컴포넌트에 `defaultValues` prop으로 전달한다. 폼은 조회를 모른다. |
| FRM-061 | 대상이 바뀌면(`userId` 변경 등) `key={id}`로 폼을 **재생성**한다. RHF `defaultValues`는 첫 마운트에만 반영되므로 값 주입이 아니라 새 폼이다. |
| FRM-062 | 서버 DTO → 폼 값 매퍼(`toFormValues`)에서 `null`/`undefined`는 반드시 `''` 등으로 치환한다(컨트롤드 입력). |
| FRM-063 | 드로어처럼 마운트 유지 상태에서 내용이 교체되는 폼만 `resetOnDefaultValuesChange`를 쓴다(admin `useAppForm` 기본값). |
| FRM-064 | 라우터 loader/`useSuspenseQuery`는 컨벤션이 아니다. 실측으로 느린 라우트에만 개별 최적화로 도입하고 사유를 주석으로 남긴다. |

```tsx
function UserEditPage() {
  const { userId } = Route.useParams();
  const { data, isPending } = useQuery(userQuery(userId));   // queryKey에 userId 포함 → 자동 재조회

  if (isPending) return <PageSkeleton />;                    // 렌더 게이트

  return <UserEditForm key={userId} defaultValues={toFormValues(data)} onSubmit={handleSave} />;
}
```

## 제출과 페이로드

| ID | 내용 |
| --- | --- |
| FRM-033 | `onSubmit`은 폼 값 그대로 받고, 페이로드 성형(`toPayload`, `passwordConfirm` 제거 등)은 feature의 제출 핸들러가 한다. |
| FRM-070 | `toFormValues`/`toPayload` 매퍼는 **feature 소유.** 엔티티마다 트림·`''↔undefined` 규칙이 달라 공통화하지 않는다. 위치만 통일(feature의 model 또는 폼 파일 옆). |
| FRM-071 | 저장 성공 시 `form.reset(제출값)`으로 기준선을 갱신한다(`isDirty` 해제). 리셋 버튼은 `form.reset()` — 현재 스냅샷으로 복귀. HTML `type="reset"`은 RHF 상태를 못 되돌리므로 금지. |

## 폼 재사용 판단 기준

| ID | 내용 |
| --- | --- |
| FRM-080 | 재사용 여부는 "화면이 비슷한가"가 아니라 **"필드별 규칙·편집 가능성이 일치하는가"** 로 판단한다. 절반 이상 갈리면 분리한다. (예: 가입 vs 정보수정 — userId 불변, 비밀번호 부재로 별개 폼) |
| FRM-081 | 한 화면에 섹션이 여러 개여도 **같이 저장되면 폼 하나**(중첩 name `basic.name` 등). 따로도 저장될 수 있을 때만 인스턴스를 분리하고 `trigger()` + `getValues()`로 묶는다. |

## 기각한 대안 (재논의 방지용)

| 대안 | 기각 사유 |
| --- | --- |
| 자체 rules DSL + 커스텀 리졸버 | RHF 내장 기능의 ~700줄 재구현. 레지스트리·컨텍스트 병렬 상태 유지 부담 |
| Zod 스키마 모드 (`useZodForm`) | 폼마다 스키마 보일러플레이트, 검증이 필드 옆에 안 보임, `deps` 미지원으로 cross-field stale 에러 해결 불가 |
| AntD식 cloneElement 주입 | 자식 한 겹 래핑에도 조용한 바인딩 단절, 주입 props 타입 검증 불가, `valuePropName`류 설정 표면 증식 |
| 스타일 박은 필드 HOC | 렌더마다 새 컴포넌트 → input remount(포커스·커서 유실). context 상속으로 대체 |
| `useAppForm`을 앱마다 복제 | 스타일 무관한 reset 로직이 3벌 복제됨. 공통 로직은 `useBaseForm`으로 shared에 유지 |

## 효과

- 초기 구현 대비 폼 레이어 약 **-1,100줄**, 폼 스택 의존성 RHF 단일 (zod·resolvers 제거)
- 화면 폼 5개(Login/Signup/Menu/UserDrawer/CodeGroupDrawer)가 동일 형식으로 수렴
- 새 컨트롤 추가 비용: 래퍼 60줄 복사 → `FormItem` 기반 래퍼 ~15줄
- resolver 모드에서 불가능했던 `deps` 기반 cross-field 재검증(비밀번호 확인 stale 에러 해제) 확보

## 현재 상태 / 남은 작업

- ✅ rules 모드, `useBaseForm`/`useAppForm` 분리, 타입 필드 반환, `AppForm` 스타일 상속 — 적용 완료
- ✅ `FormItem` 도입 + FormXxx 4종 내부 재구성 (화면 코드 무변경)
- 스페셜 케이스: pc-web `LoginForm`은 브랜드 전용 입력 디자인이라 `AppForm` 기본 스타일을
  쓰지 않고 자체 스타일을 유지한다 (의도된 예외, 반복 아님)

Deferred (필요 시점에 FRM-051 절차로 추가):

```txt
FormMoneyInput / FormNumberInput / FormCheckbox / FormRadioGroup
CodeRadioGroup / CodeCheckboxGroup / DatePicker 계열
errorDisplay variants (summary / modal)
```

공통코드 select은 별도 컴포넌트 없이 `Select`/`FormSelect`의 `groupCd` prop으로 처리한다.
`options` 대신 `groupCd`를 주면 세션에 적재된 코드맵에서 옵션을 채운다.
