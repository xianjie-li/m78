import { EmptyFunction } from "../types";

const CACHE_PREFIX = "__M78SetCacheKey";

/**
 * Set a value for the object and cache the value. In subsequent settings, a comparison will be made with the cached value, and if there is no change, the setting action will be skipped.
 *
 * If passed in cb, the value is no longer set directly internally, but is set by the user in the callback
 *  */
export function setCacheValue<O extends object = any, K = keyof O>(
  obj: O,
  key: K,
  val: any,
  cb?: EmptyFunction
) {
  const k = `${CACHE_PREFIX}__${key}`;
  const cache = obj[k];

  // 设置新值
  if (cache === undefined || cache !== val) {
    if (cb) cb();
    else (obj as any)[key] = val;

    obj[k] = val;

    return;
  }

  // 缓存相同, 跳过
}
