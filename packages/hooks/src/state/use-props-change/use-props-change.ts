import { AnyObject, isArray, isFunction } from "@m78/utils";
import isEqual from "lodash/isEqual.js";
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
    /** keys will skip */
    omit?: string[] | ((key: string, value: any) => boolean);
    /** keys will use deep equal */
    deepEqual?: string[] | ((key: string, value: any) => boolean);
  } = {}
): null | T {
  const { omit, deepEqual } = options;

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

    if (isArray(omit) && omit.includes(key)) return;
    if (isFunction(omit) && omit(key, nextValue)) return;

    const prevValue = (prev as any)[key];

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
