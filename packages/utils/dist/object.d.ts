/**
 * Delete all empty values (except 0) of the object/array
 * @param source - Target object/array
 * @return - Processed original object/array
 *
 * empty values: undefined, null ,'', NaN, [], {}
 */
export declare function shakeEmpty(source: any): any;
/**
 * Recursion delete all empty values of the object/array, use shakeEmpty() internally, return the processed original object/array
 * */
export declare function recursionShakeEmpty(source: any): any;
/**
 * Deletes the specified key value from the target object
 * @param obj - Target object
 * @param props - Key to be removed, comma separated string or string array
 * @return - New object after removal
 * */
export declare function omit(obj: any, props: string | string[]): any;
/**
 * Pick the specified key value from the target object
 * @param obj - Target object
 * @param props - Key to be selected, comma separated string or string array
 * @return - A new object containing the selection key value
 * */
export declare function pick<R>(obj: any, props: string | string[]): R;
export declare type NameItem = string | number;
/**
 * Represents the character or character array of name. usage for get chain value, such as: ['user', 'address']、['1', 'name']、['list', '4', 'name']
 *
 * 表示name的字符或字符数组，用于链式取值，如: ['user', 'address']、[1, 'name']、['list', 4, 'name']
 * */
export declare type NamePath = NameItem | NameItem[];
/** Get value on obj through NamePath */
export declare function getNamePathValue(obj: any, name: NamePath): any;
/** Convert NamePath to string */
export declare function stringifyNamePath(name: NamePath): string;
/**
 * Set value on obj through NamePath, if skipExist is passed in, the value will be skipped if it already exists
 *
 * 通过NamePath在obj上设置值, 如果传入skipExist, 在值已存在时会跳过
 * */
export declare function setNamePathValue(obj: any, name: NamePath, val: any, skipExist?: boolean): void;
/**
 * Delete value on obj through NamePath
 *
 * 通过NamePath在obj上删除值
 * */
export declare function deleteNamePathValue(obj: any, name: NamePath): void;
//# sourceMappingURL=object.d.ts.map