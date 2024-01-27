import { AnyFunction } from "@m78/utils";

/**
 * Handle executed in a dedicated thread. The request and return types must adhere to the web standard's structured clone algorithm. If you're unsure about which types are available, please refer to the following list. Alternatively, you can simply pass types that can be parsed by `json.parse` (although a wider range of types is supported):
 *
 * Structured clone algorithm: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
 */
export type M78WorkerHandle = AnyFunction;

/** Configuration for creating a Worker */
export interface M78WorkerConfig<H extends M78WorkerHandleMap = any> {
  /**
   * Current script URL
   *
   * Why is it necessary to pass the URL configuration?
   * - Due to the inherent limitations of web workers, they need to be created at the script level and require the precise access address or JS blob for that script.
   * - When using bundlers like Vite/Webpack, since the module's address may change after bundling, the actual script address needs to be passed through `import.meta.url`. If you use other bundlers, the level of support may vary. Please refer to the documentation of the respective bundler for details.
   */
  url: string | URL;

  /**
   * Handle loader for uniformly registering handles
   *
   * - All handles must be imported directly in the current script or imported through `import()` within handleLoader. If other methods (such as reading from a runtime variable) are used, the worker may not execute as expected because these runtime variables do not exist in the child thread.
   */
  handleLoader: () => Promise<H>;

  /** Provide a name for the thread, useful for debugging */
  name?: string;

  /** 'module' | Type of the current script */
  type?: WorkerType;

  /**
   * 1 | Number of threads to be created. If the number of threads is greater than 1, tasks will be prioritized for idle threads. If there are no idle threads, tasks will be assigned to threads with fewer queued tasks.
   *
   * It is not recommended to create too many workers. Typically, reusing a single thread for different tasks is sufficient. If the use case is more complex, additional workers can be added as needed. The primary goal of using workers should be to prevent the main thread from blocking and causing lag; one additional thread is enough to accomplish this task.
   */
  workerNum?: number;
}

/** Type for the handle registry, with handleName as the key and handle as the value */
export type M78WorkerHandleMap = { [key: string]: AnyFunction };

/** Pick a handle with a specified key from the handleMap and retrieve a tuple of its parameter types */
export type _PickArgs<
  H extends M78WorkerHandleMap,
  K extends keyof H
> = Parameters<H[K]>;

/** Pick a handle with a specified key from the handleMap and retrieve its return type */
export type _PickReturns<
  H extends M78WorkerHandleMap,
  K extends keyof H
> = ReturnType<H[K]>;

// 表示一项正在执行的invoke任务
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

// 包含了worker以及改worker的一些信息, 比如任务数量等
export interface _WorkerData {
  /** 当前worker */
  worker: Worker;
  /** 当前剩余的任务数 */
  taskNum: number;
}

export enum _ErrorCode {
  HANDLE_NOT_REGISTER,
  NOT_WORKER,
  HANDLE_INVOKE_FAIL,
  CREATE_WORKER_FAIL,
  HAS_LOADER_ERROR,
  ONLY_MAIN,
}

export const _ErrorMessages = {
  [_ErrorCode.HANDLE_NOT_REGISTER]: "Handle not register",
  [_ErrorCode.NOT_WORKER]: "Worker not created or failed to create",
  [_ErrorCode.HANDLE_INVOKE_FAIL]: "Handle invoke fail",
  [_ErrorCode.CREATE_WORKER_FAIL]:
    "Failed to create worker, will use main thread to execute handle",
  [_ErrorCode.HAS_LOADER_ERROR]: "An error occurred during the loader",
  [_ErrorCode.ONLY_MAIN]: "Only allowed to use on main thread",
};

// 内部使用的handlers
export enum _InnerHandlers {
  init = "__M78_WORKER_INIT__",
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
