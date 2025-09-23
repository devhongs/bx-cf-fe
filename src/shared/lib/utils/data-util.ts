import { t } from 'i18next';
import { isArray } from 'lodash';

/**
 * 특정 키 값을 기준으로 객체를 리스트에 추가하거나 제거하는 함수
 *
 * @param list 기존 리스트
 * @param item 추가하거나 제거할 객체
 * @param key 비교할 객체의 키 (ex: "id")
 * @returns 변경된 리스트
 *
 * @example
 * const users = [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }];
 * addOrRemoveItemByKey(users, { id: 2, name: "Bob" }, "id");
 * // 결과: [{ id: 1, name: "Alice" }]
 */
export const addOrRemoveItemByKey = <T, K extends keyof T>(list: T[], item: T, key?: K): T[] => {
  if (!list || !item || !key) {
    return list;
  }
  const appendedList = [...list, item];
  const removedList = list.filter((d) => d[key] !== item[key]);
  const isRemove = list.find((d) => d[key] === item[key]);
  return isRemove ? removedList : appendedList;
};

/**
 * 리스트에서 특정 키의 값이 `item`과 일치하는 항목을 필터링하는 함수
 *
 * @template T - 리스트의 요소 타입
 * @param list - 검색할 객체 배열 (null 또는 undefined 허용)
 * @param item - 비교할 값 (string, array, object 가능)
 * @param key - 비교할 키 (필수)
 * @returns 필터링된 배열 (일치하는 항목만 포함)
 *
 * @example
 * const users = [
 *   { id: 1, name: "Alice", age: 25 },
 *   { id: 2, name: "Bob", age: 30 },
 *   { id: 3, name: "Charlie", age: 25 },
 * ];
 *
 * // ✅ 문자열 비교: name이 "Alice"인 객체 찾기
 * getMatchingItemsByKey(users, "Alice", "name");
 * // [{ id: 1, name: "Alice", age: 25 }]
 *
 * // ✅ 배열 비교: age가 25 또는 30인 객체 찾기
 * getMatchingItemsByKey(users, [25, 30], "age");
 * // [{ id: 1, name: "Alice", age: 25 }, { id: 2, name: "Bob", age: 30 }, { id: 3, name: "Charlie", age: 25 }]
 *
 * // ✅ 객체 비교: name이 "Alice"인 객체 찾기 (객체를 넣었을 때)
 * getMatchingItemsByKey(users, { name: "Alice" }, "name");
 * // [{ id: 1, name: "Alice", age: 25 }]
 *
 * // ✅ 숫자 비교: age가 25인 객체 찾기
 * getMatchingItemsByKey(users, 25, "age");
 * // [{ id: 1, name: "Alice", age: 25 }, { id: 3, name: "Charlie", age: 25 }]
 */
export const getMatchingItemsByKey = <T>(
  list: T[] | null | undefined,
  item: any,
  key?: string,
): T[] => {
  if (!list || !item || !key) return [];

  // item is string
  if (checkType(item) === 'string') {
    return list?.filter((d: any) => d[key] === item);
  }

  // item is array
  if (checkType(item) === 'array') {
    return list?.filter((d: any) => item.includes(d[key]));
  }

  // item is object
  if (checkType(item) === 'object') {
    return list?.filter((d: any) => d[key] === item[key]);
  }

  return [];
};

/**
 * 주어진 값의 타입을 확인하는 함수
 * @param value - 확인할 값
 * @returns "array" | "string" | "object" | "other"
 */
export const checkType = (value: unknown): 'array' | 'string' | 'object' | 'other' => {
  if (Array.isArray(value)) {
    return 'array'; // 배열인 경우
  }
  if (typeof value === 'string') {
    return 'string'; // 문자열인 경우
  }
  if (typeof value === 'object' && value !== null) {
    return 'object'; // 객체인 경우 (null 제외)
  }
  return 'other'; // 위 조건에 해당하지 않는 경우 (null, number, boolean 등)
};

/**
 * value 에 배열이 넘어오면 그대로 반환하고, 배열이 아닌 경우 하나의 값을 배열로 감싸서 반환한다. 값이 없는 경우는 빈 배열을 반환
 * @param value value
 * @return Array<any> | any
 */
export const toArray = (value: any) => {
  return isArray(value) ? value : value ? [value] : [];
};

/**
 * 옵션 목록을 재정렬하는 함수
 * @param options 기존 옵션 배열
 * @param valueField 옵션 객체에서 ID 값을 참조하는 필드명
 * @param activeId 현재 드래그 중인 요소의 ID
 * @param overId 드롭된 위치의 요소 ID
 * @returns 새로운 순서의 옵션 배열
 */
export const reorderOptions = (options: any[], valueField: string, activeId: any, overId: any) => {
  const oldIndex = options.findIndex((d) => d[valueField] === activeId);
  const newIndex = options.findIndex((d) => d[valueField] === overId);

  const newOptions = [...options]; // 원본 배열 복사
  const [movedItem] = newOptions.splice(oldIndex, 1); // oldIndex에서 요소 제거
  newOptions.splice(newIndex, 0, movedItem); // newIndex에 요소 삽입

  return newOptions;
};

/**
 * 서버 Enum 데이터와 로컬 데이터를 병합하여 옵션을 생성합니다.
 * @param data - 서버에서 받은 데이터
 * @param localData - 하드코딩된 로컬 데이터 (아이콘, 설명 등 포함)
 * @param mergeFields - 병합할 필드들의 배열 (예: ['icon', 'description'])
 * @returns 병합된 옵션 배열
 */
export const mergeEnumDataWithKeys = (
  data: any[],
  localData: any[],
  mergeFields: string[] = ['icon', 'description'],
) => {
  return data.map((item: any) => {
    // localData에서 value가 일치하는 항목 찾기
    const matchingLocalItem = localData.find((localItem: any) => localItem.value === item.cdId);

    const result: any = {
      label: t(item.multilingualKey, { defaultValue: item.cdName }),
      value: item.cdId,
    };

    // mergeFields에 지정된 필드들을 병합
    mergeFields.forEach((field) => {
      if (matchingLocalItem && matchingLocalItem[field] !== undefined) {
        result[field] = matchingLocalItem[field];
      }
    });

    return result;
  });
};

/**
 * 계층 구조 데이터를 평면화하여 depth 정보를 추가하는 함수
 * children 또는 subRows 속성을 가진 객체들을 재귀적으로 평면화 진행.
 */
export const flattenHierarchicalData = (items: any[], depth = 0): any[] => {
  const result: any[] = [];

  items.forEach((item) => {
    const flatItem = { ...item, depth: depth };
    result.push(flatItem);

    const children = item.children || item.subRows;
    if (children && Array.isArray(children) && children.length > 0) {
      result.push(...flattenHierarchicalData(children, depth + 1));
    }
  });

  return result;
};
