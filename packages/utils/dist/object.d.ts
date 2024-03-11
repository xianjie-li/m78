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
export type NameItem = string | number;
/**
 * Represents the character or character array of name. usage for get chain value, such as: ['user', 'address']、['1', 'name']、['list', '4', 'name']
 *
 * 表示name的字符或字符数组，用于链式取值，如: ['user', 'address']、[1, 'name']、['list', 4, 'name']
 * */
export type NamePath = NameItem | NameItem[];
/**
 * Get value on obj through NamePath
 *
 * When name pass `[]`, will return obj directly
 * */
export declare function getNamePathValue<V = any>(obj: any, name: NamePath): V;
/** Convert NamePath to string */
export declare function stringifyNamePath(name: NamePath): string;
/**
 * Set value on obj through NamePath, if skipExist is passed in, the value will be skipped if it already exists
 *
 * If val is undefined, will delete the value specified by name like deleteNamePathValue() do
 * */
export declare function setNamePathValue(obj: any, name: NamePath, val: any, skipExist?: boolean): void;
/**
 * Delete value on obj through NamePath
 * */
export declare function deleteNamePathValue(obj: any, name: NamePath): void;
/** Delete multiple value on obj, through nameList, ensures no index misalignment when deleting the same array content multiple times */
export declare function deleteNamePathValues(obj: any, nameList: NamePath[]): void;
type Constructor = new (...args: any[]) => any;
/**
 * 对给定的多个类执行混合, 首个类会被视为主类, 执行混合后类的类型默认与主类相同
 *
 * - 为了更好的可读性和可维护性, 若存在同名的属性/方法会抛出错误
 * - 构造函数内不可访其他类的成员, 因为初始化尚未完成
 * - 不会处理静态方法/属性, 应统一维护到主类
 * - 仅主类支持集成, 其他类的集成属性/方法会被忽略
 * */
export declare function applyMixins<C extends Constructor>(MainConstructor: C, ...constructors: Constructor[]): C;
export {};
//# sourceMappingURL=object.d.ts.map