/**
 * Delete all falsy values of the object (except 0)
 * @param source - Target object
 * @return - Processed original object
 */
export declare const shakeFalsy: (source: object) => object;
/**
 * Deletes the specified key value from the target object
 * @param obj - Target object
 * @param props - Key to be removed, comma separated string or string array
 * @return - New object after removal
 * */
export declare function omit<R>(obj: any, props: string | string[]): R;
/**
 * Pick the specified key value from the target object
 * @param obj - Target object
 * @param props - Key to be selected, comma separated string or string array
 * @return - A new object containing the selection key value
 * */
export declare function pick<R>(obj: any, props: string | string[]): R;
/**
 * Represents the character or character array of name. The array usage is used for chain value, such as: ['user', 'address']、['1', 'name']、['list', '4', 'name']
 *
 * 表示name的字符或字符数组，数组用法用于链式取值，如: ['user', 'address']、['1', 'name']、['list', '4', 'name']
 * */
export declare type NamePath = string | number | (string | number)[];
/**
 * Get value on obj through NamePath
 *
 * 通过NamePath在obj上获取值
 * */
export declare function getNamePathValue(obj: any, name: any): any;
/**
 * Convert NamePath to character form
 *
 * 将NamePath转换为字符形式
 * */
export declare function stringifyNamePath(name: any): any;
/**
 * Set value on obj through NamePath
 *
 * 通过NamePath在obj上设置值
 * */
export declare function setNamePathValue(obj: any, name: any, val: any): void;
//# sourceMappingURL=object.d.ts.map