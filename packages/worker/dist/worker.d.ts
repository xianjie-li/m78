import { PromiseTask } from "@m78/utils";
import { M78WorkerConfig, M78WorkerHandleMap, _PickArgs, _PickReturns } from "./types.js";
/**
 * A library that makes it easier for you to use Web Workers.
 *
 * - Simplified worker creation process
 * - It allows you to register multiple different handles and use them later in a way similar to using asynchronous functions, avoiding the cumbersome way of thread communication through message passing.
 * - Handles run in separate threads. If the browser does not support Web Workers, it falls back to using the browser's main thread.
 * - Automatically schedules tasks to idle threads.
 * - Type-safe – all invoke() calls include hints for the input parameters and return types of the corresponding handle.
 *
 * Notes:
 * - Please execute new M78Worker() in a separate script file. This script will be executed separately in the main thread and subthreads, creating instances of M78Worker in their respective threads, each with different responsibilities.
 *    - The script and its imported modules should not include content or side-effect code unrelated to creating workers, as this content (scripts/imported modules) will be executed multiple times based on the number of created threads.
 *    - Accessing worker instances in the current script is incorrect; they must be imported and used in other scripts.
 * - Not all tasks are suitable for execution in separate threads. When transferring large amounts of data, or even involving encoding/decoding, the benefits of multi-threaded computation may not be sufficient to offset the data transfer costs between threads.
 *
 * Other:
 * - Some similar libraries offer a way to run a given function in a subthread using instance.run((a, b) => a + b). Due to the limitations of thread communication serialization, these functions are actually transmitted in string form and cannot include any access to external content, making them less meaningful in practical development; hence, this feature will not be provided.
 * */
export declare class M78Worker<H extends M78WorkerHandleMap = any> {
    config: M78WorkerConfig<H>;
    /** Whether it has been initialized */
    initialized: boolean;
    /** Initialization in progress, can wait for completion through this promise */
    initializeTask: PromiseTask<void> | null;
    /** Whether it is a worker thread */
    isWorker: boolean;
    /** Store thread objects and their information */
    private worker;
    /** 注册的handle, 以handleName为key, 无论主线程, 子线程都会对当前handle进行注册 */
    private handleMap;
    /** 执行中的invoke, key为执行id, promise会返回执行结果, 也有可能抛出错误, main/sub线程的执行任务均存储在此 */
    private invokingMap;
    /** handle是否应强制在主线程执行 */
    private forceUseMainThread;
    /** 默认的子线程数量 */
    private readonly defaultWorkerNum;
    private readonly defaultWorkerName;
    /** invoke id 的key */
    static ID_KEY: string;
    constructor(config: M78WorkerConfig<H>);
    /**
     * Initialize and create a thread. By default, it will automatically initialize on the first invoke.
     * This method can be called repeatedly, but subsequent calls will be ignored.
     *
     * As it involves asynchronous operations such as loading thread scripts, triggering it in advance
     * can improve the speed of the first execution, especially when working with worker threads.
     */
    init: () => Promise<void>;
    /** Destroy instance */
    destroy(): void;
    /** Execute specified handle */
    invoke<K extends keyof H = keyof H>(handleName: K, ...args: _PickArgs<H, K>): Promise<_PickReturns<H, K>>;
    /** invoke的主要实现, 也用于内部handle调用 */
    private invokeInner;
    /** 根据当前handleLoader配置加载handler, 此函数不会抛出异常 */
    private processLoader;
    /** 从当前的worker列表中挑选出一个空闲或任务数量最少的worker, 若没有获取到worker则返回null(通常是由于没有任何worker创建) */
    private pickWorker;
    /** 注册内部使用的handle */
    private processInnerHandler;
    private onMessage;
    private mainMessageHandle;
    private workerMessageHandle;
    private addListeners;
    private removeListeners;
    private throwError;
    private getErrorText;
    private buildMessage;
}
//# sourceMappingURL=worker.d.ts.map