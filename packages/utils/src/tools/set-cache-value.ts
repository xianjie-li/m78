const CACHE_PREFIX = "__M78SetCacheKey";

/** Set a value for the object and cache the value. In subsequent settings, a comparison will be made with the cached value, and if there is no change, the setting action will be skipped. */
export function setCacheValue<O extends object = any, K = keyof O>(
  obj: O,
  key: K,
  val: any
) {
  const k = `${CACHE_PREFIX}__${key}`;
  const cache = obj[k];

  // 设置新值
  if (cache === undefined || cache !== val) {
    (obj as any)[key] = val;
    obj[k] = val;

    return;
  }

  // 缓存相同, 跳过
}
