import { AnyFunction } from "@m78/utils";
export interface UseThrottleOption {
    /** true | 在节流开始前调用 */
    leading?: boolean;
    /** true | 在节流结束后调用 */
    trailing?: boolean;
}
/**
 * 传入一个函数，经过节流处理后返回, 返回函数的内存地址会一直保持不变
 * @param fn - 待节流的函数
 * @param wait - 节流延迟时间
 * @param options
 * @param options.leading - true | 在节流开始前调用
 * @param options.trailing - true | 在节流结束后调用
 * @returns throttleFn - 经过节流处理后的函数
 * @returns throttleFn.cancel() - 取消节流调用
 */
export declare function useThrottle<T extends AnyFunction>(fn: T, wait?: number, options?: UseThrottleOption): T & {
    cancel: () => void;
};
//# sourceMappingURL=useThrottle.d.ts.map