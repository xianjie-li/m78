/**
 * 将一个错误优先且回调位于最后一个参数的node风格的callback函数转为Promise return函数
 * @param fn - 要包装的函数
 * @param {object} receiver - 要绑定作用域的对象
 * @return promise - 转换后的函数
 */
import { AnyFunction, EmptyFunction } from "./types";
export declare function promisify<T = any>(fn: AnyFunction, receiver?: object): (...args: Parameters<AnyFunction>) => Promise<T>;
/**
 * 返回一个延迟指定时间的Promise
 * @param ms - 延迟时间
 * @param payload - 将要resolve的任意值，如果是Error对象，则promise会抛出异常
 * @return - Promise
 * */
export declare function delay<T = any>(ms: number, payload?: T): Promise<T extends Error ? void : T>;
/** 接收任意参数并返回, 用例是作为一个无效接收器或默认参数使用 */
export declare const dumpFn: (...arg: any[]) => any;
/** 延迟执行一个函数 */
export declare const defer: (fn: AnyFunction, ...args: any[]) => any;
/** retry函数的配置 */
export interface FunctionReTryConfig {
    maxDelay?: number;
    rate?: number;
    fixed?: boolean;
    maxRetry?: number;
}
/**
 * 执行一次handle，如果handle
 * @param handle - 处理函数，调用retry时会立即执行一次，如果handle执行返回了truthy值，则会在下一延迟执行点重新执行handle
 * @param delay - 进行重试间隔的毫秒，默认情况下，每次执行的间隔会通过边际递增算法增加, 可以通过config.fixed取消此行为
 * @param config - 配置
 * @param config.maxDelay - 重试延迟的最大延迟
 * @param config.rate - 0.2 | 递增比，此比例越大，则重试的频率越小
 * @param config.fixed - 不使用边际递增算法，固定重试时间
 * @param config.maxRetry - 最大重复次数
 * @return clear() - 用于停止重试并清理内部计时器
 * */
export declare function retry(handle: () => any, delay: number, config?: FunctionReTryConfig): EmptyFunction;
//# sourceMappingURL=function.d.ts.map