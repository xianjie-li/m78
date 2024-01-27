import { PromiseTask } from "@m78/utils";
import { M78WorkerConfig, M78WorkerHandleMap, _PickArgs, _PickReturns } from "./types.js";
/**
 * 一个让你能更轻松使用Web Worker的库, 支持浏览器和nodejs
 *
 * - 更简单的worker创建流程
 * - 它允许你注册多个不同的handle, 并在后续通过和使用异步函数相同的方式使用这些handle, 这让你避免了通过消息通讯来进行线程通讯的糟糕方式
 * - handle在独立的线程中运行, 如果浏览器不支持Web Worker, 将回退到使用浏览器主线程
 * - 自动调度任务到空闲线程
 * - 类型安全, 所有invoke()调用都包含对应handle的入参和返回类型提示
 *
 * 注意事项:
 * - 请将new M78Worker()放到单独的脚本文件中执行, 该脚本会在主线程和子线程分别执行并创建各自线程内的的M78Worker实例, 这些实例在不同的线程中会有不同的职责
 *    - 创建脚本和其导入的模块不应包含和创建worker无关的内容或副作用代码, 因为这些内容(脚本/导入模块)会根据创建的线程数量被执行多次
 *    - 在当前脚本访问worker实例是不正确的, 必须在其他脚本中导入后使用
 * - 并不是所有任务都适合分配到独立线程执行, 当需要传输大量数据, 甚至包含编解码时, 多线程计算带来的收益可能会不足以填补线程之间传送数据的损耗.
 *
 * 其他:
 * - 一些类似的库提供 instance.run((a, b) => a + b) 的方式来之间在子线程中运行给定函数, 由于线程通讯序列化的限制,  这些函数其实是通过字符串形式传输的, 不能包含任何对函数外内容的访问, 这在实际开发中意义不大, 故不会提供.
 * */
export declare class M78Worker<H extends M78WorkerHandleMap = any> {
    config: M78WorkerConfig<H>;
    /** 是否已初始化 */
    initialized: boolean;
    /** 初始化进行中, 可通过该promise等待完成 */
    initializeTask: PromiseTask<void> | null;
    /** 是否是工作线程 */
    isWorker: boolean;
    /** 存放线程对象及其信息 */
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
     * 初始化并创建线程, 默认会在首次执行invoke时自动初始化, 此方法可重复调用, 但后续调用会直接忽略
     *
     * 由于会涉及到加载线程脚本等异步操作, 可以在确定会使用到工作线程时提前触发来提升首次执行的速度 */
    init: () => Promise<void>;
    /** 销毁 */
    destroy(): void;
    /**
     * 执行指定的handle
     * */
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