import {
  AnyObject,
  isArray,
  isFunction,
  simplyEqual as isEqual,
} from "@m78/utils";
import { usePrev } from "../use-prev/use-prev.js";

/**
 * compare props and prev props, return changed props
 *
 * The main use case is to develop react components with the existing js version library
 *
 * return null if equal or first render
 * */
export function usePropsChange<T extends Object = AnyObject>(
  props: T,
  options: {
    /** only verify specified keys, not affected by exclude and skipReferenceType */
    include?: string[] | ((key: string, value: any) => boolean);
    /** skip specified keys check */
    exclude?: string[] | ((key: string, value: any) => boolean);
    /** use deep equal for specified keys */
    deepEqual?: string[] | ((key: string, value: any) => boolean);
    /** skip reference type check */
    skipReferenceType?: boolean;
  } = {}
): null | T {
  const { include, exclude, deepEqual, skipReferenceType } = options;

  const prev = usePrev(props);

  // first render return all props directly
  if (!prev) return props;

  const prevKeys = Object.keys(prev);
  const keys = Object.keys(props);

  const keyExistCheck: any = {};

  const allKeys: string[] = [];

  prevKeys.concat(keys).forEach((key) => {
    if (keyExistCheck[key]) return;
    allKeys.push(key);
    keyExistCheck[key] = true;
  });

  const changes: any = {};
  let hasChanged = false;

  allKeys.forEach((key) => {
    const nextValue = (props as any)[key];

    let hasInclude = false;

    if (isArray(include)) {
      if (include.includes(key)) {
        hasInclude = true;
      } else {
        return;
      }
    } else if (isFunction(include)) {
      if (include(key, nextValue)) {
        hasInclude = true;
      } else {
        return;
      }
    }

    const prevValue = (prev as any)[key];

    if (!hasInclude) {
      if (isArray(exclude) && exclude.includes(key)) return;
      if (isFunction(exclude) && exclude(key, nextValue)) return;

      if (skipReferenceType) {
        if (typeof prevValue === "object" && typeof nextValue === "object")
          return;
      }
    }

    if (
      (isArray(deepEqual) && deepEqual.includes(key)) ||
      (isFunction(deepEqual) && deepEqual(key, nextValue))
    ) {
      if (isEqual(prevValue, nextValue)) return;
    } else {
      if (Object.is(prevValue, nextValue)) return;
    }

    hasChanged = true;

    (changes as any)[key] = nextValue;
  });

  return hasChanged ? changes : null;
}
