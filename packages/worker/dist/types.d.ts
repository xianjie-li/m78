import { AnyFunction } from "@m78/utils";
/**
 * 在独立线程中执行的handle, 其请求和返回类型必须遵循web标准的 structured clone 算法, 如果你无法确定哪些类型可用, 请参考下面列表, 你也可以简单的只传递能被json.parse解析的类型(尽管受支持的类型更多):
 *
 * structured clone algorithm: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
 * */
export type M78WorkerHandle = AnyFunction;
/** 创建配置 */
export interface M78WorkerConfig<H extends M78WorkerHandleMap = any> {
    /**
     * 当前脚本地址
     *
     * 为什么需要传入url配置?
     * - web worker本身限制, 它需要在脚本级别进行创建, 且需要提供该脚本切确的访问地址或js blob
     * - 在vite/webpack等打包工具中使用时, 由于当前模块的地址会在打包后变更, 需要将脚本的实际地址通过import.meta.url传入, 如果你使用其他的打包器, 可能支持度会有所不同, 具体可查看对应打包器文档
     * */
    url: string | URL;
    /**
     * handle加载器, 用于统一注册handle
     *
     * - 所有handle必须是在当前脚本中直接通过import导入或在handleLoader内通过import()导入的, 如果其他方式(比如从某个运行时变量中读取), worker不会如预期的执行, 因为在子线程中, 这些运行时变量是不存在的.
     * */
    handleLoader: () => Promise<H>;
    /** 为线程提供一个名称, 便于调试 */
    name?: string;
    /** 'module' | 当前脚本类型 */
    type?: WorkerType;
    /**
     *  1 | 需创建的线程数, 如果线程数大于1, 任务会优先分配给空闲的线程, 若没有空闲线程则分配给排队任务较少的线程
     *
     *  不建议创建过多的worker, 通常, 不同任务复用一个线程即可, 如果用例较复杂, 则可酌情添加, 使用worker的主要目标应该是防止主线程阻塞导致卡顿, 一个额外线程就足以完成此工作
     *  */
    workerNum?: number;
}
/** handle注册表类型, 以handleName为key, handle为值 */
export type M78WorkerHandleMap = {
    [key: string]: AnyFunction;
};
/** 从handleMap中挑选指定key的handle, 并获取其参数类型的元组 */
export type _PickArgs<H extends M78WorkerHandleMap, K extends keyof H> = Parameters<H[K]>;
/** 从handleMap中挑选指定key的handle, 并获取返回类型 */
export type _PickReturns<H extends M78WorkerHandleMap, K extends keyof H> = ReturnType<H[K]>;
export interface _InvokeData {
    /** 表示该任务的promise */
    task: Promise<any>;
    /** 负责该任务的worker */
    workerData: _WorkerData;
    /** 成功时调用 */
    resolve: (value: any) => void;
    /** 失败时调用 */
    reject: (reason?: any) => void;
}
export interface _WorkerData {
    /** 当前worker */
    worker: Worker;
    /** 当前剩余的任务数 */
    taskNum: number;
}
export declare enum _ErrorCode {
    HANDLE_NOT_REGISTER = 0,
    NOT_WORKER = 1,
    HANDLE_INVOKE_FAIL = 2,
    CREATE_WORKER_FAIL = 3,
    HAS_LOADER_ERROR = 4,
    ONLY_MAIN = 5
}
export declare const _ErrorMessages: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
};
export declare enum _InnerHandlers {
    init = "__M78_WORKER_INIT__"
}
export interface _Message {
    /** 执行id */
    __M78_WORKER_ID_KEY: string;
    /** handle名称 */
    handleName: string;
    /** 参数 */
    args?: any[];
    /** 载荷或响应 */
    payload?: any;
    /** 发生错误时, 此项为错误信息 */
    error?: string;
}
//# sourceMappingURL=types.d.ts.map