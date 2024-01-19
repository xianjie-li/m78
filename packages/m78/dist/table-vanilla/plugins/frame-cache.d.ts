import { EmptyFunction } from "@m78/utils";
/**
 * Cache it! in the tick.
 * */
export declare class CacheTick<K = any> {
    cache?: any;
    /** Get value by specified key, if not, get it through getter and write latest value to the cache */
    get(key: K, getter?: () => any): any;
    /** Start a cache frame, all repeat get will be reuse */
    tick(cb: EmptyFunction): void;
}
//# sourceMappingURL=frame-cache.d.ts.map