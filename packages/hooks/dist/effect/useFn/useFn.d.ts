import { AnyFunction } from "@m78/utils";
/**
 * 用于代替`useCallback`，使回调函数的引用地址永久不变, 从而减少消费组件不必要的更新。
 * 该hook的另一个用例是解决闭包导致的回调内外状态不一致问题，并且它不需要传递`deps`参数
 * @param fn - 需要`memo`化的函数
 * @param wrapper - 接收fn并返回，可以藉此对函数实现节流等增强操作, 只在初始化和deps改变时调用
 * @param deps - 依赖数组，如果传入，其中任意值改变都会重载缓存的fn，可以用来更新wrapper包装的函数
 * @returns - 经过memo化的函数
 */
export declare function useFn<T extends AnyFunction>(fn: T, wrapper?: (fn: T) => T, deps?: any[]): T;
//# sourceMappingURL=useFn.d.ts.map