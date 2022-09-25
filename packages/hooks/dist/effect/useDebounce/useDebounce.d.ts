import { AnyFunction } from "@m78/utils";
/**
 * 传入一个函数，经过防抖处理后返回, 返回函数的内存地址会一直保持不变
 * @param fn - 待防抖的函数
 * @param wait - 防抖延迟时间
 * @returns debounceFn - 经过防抖处理后的函数
 * @returns debounceFn.cancel() - 取消防抖调用
 */
export declare function useDebounce<T extends AnyFunction>(fn: T, wait?: number): T & {
    cancel: () => void;
};
//# sourceMappingURL=useDebounce.d.ts.map