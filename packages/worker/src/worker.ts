import {
  createPromise,
  createTempID,
  deleteNamePathValue,
  getNamePathValue,
  isEmpty,
  isObject,
  isWorker,
  PromiseTask,
  throwError,
  isBrowser,
} from "@m78/utils";

import {
  M78WorkerConfig,
  M78WorkerHandleMap,
  M78WorkerHandle,
  _InnerHandlers,
  _InvokeData,
  _ErrorCode,
  _ErrorMessages,
  _Message,
  _PickArgs,
  _PickReturns,
  _WorkerData,
} from "./types.js";

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
export class M78Worker<H extends M78WorkerHandleMap = any> {
  /** Whether it has been initialized */
  initialized = false;

  /** Initialization in progress, can wait for completion through this promise */
  initializeTask: PromiseTask<void> | null;

  /** Whether it is a worker thread */
  isWorker = isWorker();

  /** Store thread objects and their information */
  private worker: _WorkerData[] = [];

  /** 注册的handle, 以handleName为key, 无论主线程, 子线程都会对当前handle进行注册 */
  private handleMap = new Map<string, M78WorkerHandle>();

  /** 执行中的invoke, key为执行id, promise会返回执行结果, 也有可能抛出错误, main/sub线程的执行任务均存储在此 */
  private invokingMap = new Map<string, _InvokeData>();

  /** handle是否应强制在主线程执行 */
  private forceUseMainThread = false;

  /** 默认的子线程数量 */
  private readonly defaultWorkerNum = 1;

  private readonly defaultWorkerName = "m78-worker";

  /** invoke id 的key */
  static ID_KEY = "__M78_WORKER_ID_KEY";

  constructor(public config: M78WorkerConfig<H>) {
    // 非worker线程 且 不支持worker或非浏览器环境, 在主进程执行handle
    if (!this.isWorker && (typeof Worker === "undefined" || !isBrowser())) {
      this.forceUseMainThread = true;
    }

    if (this.isWorker) {
      this.addListeners();
      this.processInnerHandler();
    }
  }

  /**
   * Initialize and create a thread. By default, it will automatically initialize on the first invoke.
   * This method can be called repeatedly, but subsequent calls will be ignored.
   *
   * As it involves asynchronous operations such as loading thread scripts, triggering it in advance
   * can improve the speed of the first execution, especially when working with worker threads.
   */
  init = async () => {
    if (this.initialized) return;

    if (this.initializeTask) return this.initializeTask.promise;

    /* # # # # # # # 子进程初始化 # # # # # # # */
    if (this.isWorker) {
      this.initialized = true;

      await this.processLoader();

      return;
    }

    /* # # # # # # # 主进程初始化 # # # # # # # */
    this.initializeTask = createPromise();

    try {
      // 主线程预先加载好所有loader并在本身进行注册, 防止包含import()加载时, 子进程重复加载

      await this.processLoader();

      if (this.forceUseMainThread) return;

      const num = this.config.workerNum || this.defaultWorkerNum;

      const name = this.config.name || this.defaultWorkerName;

      for (let i = 0; i < num; i++) {
        this.worker.push({
          worker: new Worker(this.config.url, {
            type: this.config.type || "module",
            name: `${name}-${i}`,
          }),
          taskNum: 0,
        });
      }

      this.addListeners();

      // 这里有意顺序创建而不是并发创建
      for (const w of this.worker) {
        await this.invokeInner(w, _InnerHandlers.init);
      }
    } catch (e: any) {
      // 创建worker失败时, 改为主线程执行
      this.forceUseMainThread = true;

      console.warn(`${this.getErrorText(_ErrorCode.CREATE_WORKER_FAIL)}: ${e}`);
    } finally {
      this.initialized = true;
      this.initializeTask.resolve();
      this.initializeTask = null;
    }
  };

  /** Destroy instance */
  destroy() {
    this.removeListeners();

    if (this.worker.length) {
      this.worker.forEach((w) => {
        w.worker.terminate();
      });
    }

    this.worker = [];
    deleteNamePathValue(this, "handleMap");
    deleteNamePathValue(this, "invokingMap");
  }

  /** Execute specified handle */
  async invoke<K extends keyof H = keyof H>(
    handleName: K,
    ...args: _PickArgs<H, K>
  ): Promise<_PickReturns<H, K>> {
    if (!this.initialized) {
      await this.init();
    }

    if (this.initializeTask) {
      await this.initializeTask.promise;
    }

    if (this.isWorker) this.throwError(_ErrorCode.ONLY_MAIN);

    const handleData = this.handleMap.get(handleName as any);

    if (!handleData) this.throwError(_ErrorCode.HANDLE_NOT_REGISTER);

    if (this.forceUseMainThread) {
      return handleData(...args);
    }

    if (!this.worker.length) this.throwError(_ErrorCode.NOT_WORKER);

    const current = this.pickWorker();

    if (!current) return this.throwError(_ErrorCode.NOT_WORKER);

    return this.invokeInner(current, handleName as string, ...args);
  }

  /** invoke的主要实现, 也用于内部handle调用 */
  private async invokeInner(
    wd: _WorkerData,
    handleName: string,
    ...args: any[]
  ) {
    const id = createTempID();

    const invokingData = {
      workerData: wd,
    } as _InvokeData;

    const task = new Promise<any>((resolve, reject) => {
      invokingData.resolve = resolve;
      invokingData.reject = reject;
    }).finally(() => {
      this.invokingMap.delete(id);
    });

    invokingData.task = task;

    this.invokingMap.set(id, invokingData);

    wd.taskNum++;

    wd.worker.postMessage(
      this.buildMessage(id, handleName, {
        args,
      })
    );

    return task;
  }

  /** 根据当前handleLoader配置加载handler, 此函数不会抛出异常 */
  private async processLoader() {
    const handleRecord = await this.config.handleLoader().catch((e: any) => {
      // loader包含错误时, 进行提示, 无需中断
      console.warn(`${this.getErrorText(_ErrorCode.HAS_LOADER_ERROR)}: ${e}`);
    });

    if (isEmpty(handleRecord)) return;

    Object.entries(handleRecord!).forEach(([k, v]) => {
      this.handleMap.set(k, v);
    });
  }

  /** 从当前的worker列表中挑选出一个空闲或任务数量最少的worker, 若没有获取到worker则返回null(通常是由于没有任何worker创建) */
  private pickWorker(): _WorkerData | null {
    const min: number = Math.min(...this.worker.map((i) => i.taskNum));
    let current: _WorkerData | null = null;

    this.worker.forEach((w) => {
      if (w.taskNum === min) {
        current = w;
      }
    });

    return current;
  }

  /** 注册内部使用的handle */
  private processInnerHandler() {
    this.handleMap.set(_InnerHandlers.init, this.init);
  }

  private onMessage = ({ data }: MessageEvent<any>) => {
    if (!isObject(data)) return;

    const id = getNamePathValue(data, M78Worker.ID_KEY);
    if (!id) return;

    this.isWorker
      ? this.workerMessageHandle(id, data)
      : this.mainMessageHandle(id, data);
  };

  // 主线程事件监听
  private mainMessageHandle(id: string, data: _Message) {
    const taskData = this.invokingMap.get(id);

    if (!taskData) return;

    taskData.workerData.taskNum--;
    this.invokingMap.delete(id);

    if (data.error !== undefined) {
      taskData.reject(data.error);
      return;
    }

    taskData.resolve(data.payload);
  }

  // 子线程事件监听
  private async workerMessageHandle(id: string, data: _Message) {
    const handle = this.handleMap.get(data.handleName);

    const message = this.buildMessage(id, data.handleName);

    if (handle) {
      try {
        message.payload = await handle(...(data.args || []));
      } catch (e: any) {
        message.error =
          e.message || this.getErrorText(_ErrorCode.HANDLE_INVOKE_FAIL);
      }
    } else {
      message.error = `${this.getErrorText(_ErrorCode.HANDLE_NOT_REGISTER)}: ${
        data.handleName
      }`;
    }

    // console.log(data.handleName, name);

    postMessage(message);
  }

  // 事件监听
  private addListeners() {
    if (this.isWorker) {
      addEventListener("message", this.onMessage);
    } else {
      this.worker.length &&
        this.worker.forEach((w) => {
          w.worker.addEventListener("message", this.onMessage);
        });
    }
  }

  // 移除监听器
  private removeListeners() {
    if (this.isWorker) {
      removeEventListener("message", this.onMessage);
    } else {
      this.worker.length &&
        this.worker.forEach((w) => {
          w.worker.removeEventListener("message", this.onMessage);
        });
    }
  }

  // 抛出指定code的错误
  private throwError(code: _ErrorCode): never {
    throwError(_ErrorMessages[code]);
  }

  // 获取指定错误信息
  private getErrorText(code: _ErrorCode) {
    return _ErrorMessages[code];
  }

  // 构造专用传输结构
  private buildMessage(
    id: string,
    handleName: string,
    msg?: Partial<_Message>
  ) {
    return {
      [M78Worker.ID_KEY]: id,
      handleName,
      ...msg,
    };
  }
}
