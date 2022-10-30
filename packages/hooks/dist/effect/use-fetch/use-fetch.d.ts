import React from "react";
import { SetStateBase } from "../../";
interface UseFetchOptions<Data, Payload> {
    /** 传递给请求函数的参数, 当发生改变时，会以新值发起调用请求。传递此项时，payload会被忽略。 */
    param?: Payload;
    /** [] | 类似useEffect(fn, deps)，当依赖数组内的值发生改变时，会以当前payload进行更新请求, 请勿传入未memo的引用类型值 */
    deps?: any[];
    /** false | 只能通过send来手动触发请求 */
    manual?: boolean;
    /** 10000 | 超时时间(ms) */
    timeout?: number;
    /** true | 只有为true时才会发起请求, 可以用来实现串联请求 */
    pass?: boolean;
    /** 初始data */
    initData?: (() => Data) | Data;
    /** 初始payload, 在不存在param配置时，作为参数传递给请求方法 */
    initPayload?: (() => Payload) | Payload;
    /** 成功回调, 当为更新请求(无参调用send、deps/param等配置发起请求)时，isUpdate为true */
    onSuccess?: (result: Data, isUpdate: boolean) => void;
    /** 错误回调, error为请求函数中抛出的错误 */
    onError?: (error: any) => void;
    /** 无论成功与否都会调用。在旧的请求被新的请求覆盖掉时, 不会触发。 */
    onFinish?: () => void;
    /** 请求超时的回调 */
    onTimeout?: () => void;
    /** 用于缓存的key，传递后，会将(payload, data, arg)缓存到session中，下次加载时将读取缓存数据作为初始值 */
    cacheKey?: string;
    /** true | 当传入了cacheKey且存在缓存数据时，是否进行swr(stale-while-revalidate)请求 */
    stale?: boolean;
    /** 节流间隔时间，传入时，开启节流, 只有初始化时的配置会生效 */
    throttleInterval?: number;
    /** 防抖间隔时间，传入时，开启防抖, 只有初始化时的配置会生效, 当存在throttleInterval时，此配置不会生效 */
    debounceInterval?: number;
}
interface UseFetchReturns<Data, Payload> {
    /** 是否正在请求 */
    loading: boolean;
    /** method方法reject时，error为它reject的值。 */
    error: any;
    /** 请求超时设置为true */
    timeout: boolean;
    /** method方法resolve的值或initData */
    data: Data;
    /** 当前用于请求的payload或initPayload */
    payload: Payload;
    /** 当前用于请求的param */
    param: Payload;
    /** 设置当前的data */
    setData: SetStateBase<Data>;
    /** 取消请求 */
    cancel: () => void;
    /**
     * 根据参数类型不同，会有不同效果:
     * - 带参数: 以新的payload发起请求并设置payload
     * - 无参数/参数为react合成事件: 以当前参数发起更新请求
     * - 传入了param配置项: 当存在param配置，一律视为更新并以当前param的值发起更新. 此时，传入的payload会被忽略
     *
     * 返回一个promise对象, 请求结果的结果决定其状态
     * */
    send: (newPayload?: Payload | React.SyntheticEvent) => Promise<Data>;
}
/**
 * 以hooks的方式来发起数据请求
 * - <Data> 响应值的类型
 * - <Payload> 参数类型
 * @param method - 获取数据的函数, 其必须返回一个Promise对象, useFetch会根据promise的状态决定请求的结果, 如果此项不为函数时不会走请求流程, 表现与options.pass相似, 可以用来实现简短的串联请求
 * @param options - 请求配置
 * */
declare function useFetch<Data = any, Payload = any>(method?: any, options?: UseFetchOptions<Data, Payload>): UseFetchReturns<Data, Payload> & {
    send: (newPayload?: Payload) => Promise<any>;
    data: Data;
    payload: Payload;
    param: Payload | undefined;
    setData: SetStateBase<Data>;
    cancel: () => void;
    loading: boolean;
    error: any;
    timeout: boolean;
};
export { useFetch, UseFetchOptions, UseFetchReturns };
//# sourceMappingURL=use-fetch.d.ts.map