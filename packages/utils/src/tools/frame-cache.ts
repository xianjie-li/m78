import { isUndefined } from "../is.js";
import type { EmptyFunction } from "../types.js";

/**
 * Cache it! in the tick.
 * */
export class CacheTick<K = any> {
  cache?: any;

  /** Get value by specified key, if not, get it through getter and write latest value to the cache */
  get(key: K, getter?: () => any) {
    if (!this.cache) {
      if (!getter) return;
      return getter();
    }

    const cCache = this.cache[key];

    if (isUndefined(cCache)) {
      if (!getter) return;

      const fresh = getter();
      this.cache[key] = fresh;

      return fresh;
    }

    return cCache;
  }

  /** Start a cache frame, all repeat get will be reuse */
  tick(cb: EmptyFunction) {
    this.cache = {};
    cb();
    this.cache = undefined;
  }
}
