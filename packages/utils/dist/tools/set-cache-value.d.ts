import { EmptyFunction } from "../types.js";
/**
 * Set a value for the object and cache the value. In subsequent settings, a comparison will be made with the cached value, and if there is no change, the setting action will be skipped.
 *
 * If passed in cb, the value is no longer set directly internally, but is set by the user in the callback
 *  */
export declare function setCacheValue<O extends object = any, K = keyof O>(obj: O, key: K, val: any, cb?: EmptyFunction): void;
//# sourceMappingURL=set-cache-value.d.ts.map