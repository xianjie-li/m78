import { isArray, isTruthyOrZero } from "./is.js";

/**
 * swap index of two items in array.
 * if the index is exceeded, no action is performed.
 * return the original array after operation.
 * */
export function swap<T extends Array<any>>(
  arr: T,
  sourceInd: number,
  targetInd: number
): T {
  if (sourceInd < 0 || targetInd < 0) return arr;
  if (sourceInd > arr.length - 1 || targetInd > arr.length - 1) return arr;
  arr.splice(targetInd, 1, arr.splice(sourceInd, 1, arr[targetInd])[0]);
  return arr;
}

/**
 * move array item location `form -> to`, return the original array after operation.
 * */
export function move<T extends Array<any>>(
  array: T,
  form: number,
  to: number
): T | undefined {
  if (form < 0 || to < 0) return array;
  if (form > array.length - 1 || to > array.length - 1) return array;
  array.splice(to, 0, ...array.splice(form, 1));
  return array;
}

/**
 * receive T or T[], return T[], if val is falsy and not 0, return []
 * */
export function ensureArray<T>(val: T[] | T): NonNullable<T>[] {
  if (isArray(val)) return val as any;

  if (!isTruthyOrZero(val)) return [];

  return [val] as any;
}

/**
 * array deduplication, use shallow compare
 * */
export function uniq<T extends Array<any>>(array: T): T {
  const arr: any[] = [];

  array.forEach((it) => {
    if (arr.indexOf(it) === -1) {
      arr.push(it);
    }
  });

  return arr as T;
}

/**
 * array deduplication, use comparator
 * */
export function uniqWith<T>(
  array: T[],
  comparator: (a: T, b: T) => boolean
): T[] {
  const arr: T[] = [];

  array.forEach((it) => {
    let flag = false;
    for (const item of arr) {
      if (comparator(item, it)) {
        flag = true;
        break;
      }
    }

    if (!flag) {
      arr.push(it);
    }
  });

  return arr;
}
