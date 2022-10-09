/**
 * swap index of two items in array.
 * if the index is exceeded, no action is performed.
 * return the original array after operation.
 * */
export declare function swap<T extends Array<any>>(arr: T, sourceInd: number, targetInd: number): T;
/**
 * move array item location `form -> to`, return the original array after operation.
 * */
export declare function move<T extends Array<any>>(array: T, form: number, to: number): T | undefined;
/**
 * receive T or T[], return T[]
 * */
export declare function ensureArray<T>(val: T[] | T): T[];
/**
 * array deduplication, use shallow compare
 * */
export declare function uniq<T extends Array<any>>(array: T): T;
/**
 * array deduplication, use comparator
 * */
export declare function uniqWith<T>(array: T[], comparator: (a: T, b: T) => boolean): T[];
//# sourceMappingURL=array.d.ts.map