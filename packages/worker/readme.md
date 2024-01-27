<h1 align="center" style="color: #61dafb;">M78 Worker</h1>

<br>

<p align="center" style="color:#666">A library that makes it easier for you to use Web Workers</p>

<br>

## Features

- Simplified worker creation process
- It allows you to register multiple different handles and use them later in a way similar to using asynchronous functions, avoiding the cumbersome way of thread communication through message passing.
- Handles run in separate threads. If the browser does not support Web Workers, it falls back to using the browser's main thread.
- Automatically schedules tasks to idle threads.
- Type-safe – all invoke() calls include hints for the input parameters and return types of the corresponding handle.

> Compatibility with nodejs may be added in the future

## Getting Started

1. install package

```bash
npm install @m78/worker
```

2. create worker.js

```js
import { M78Worker } from "@m78/worker";
import { createRandString } from "@m78/utils";

// Create a new instance of the M78Worker class
const worker = new M78Worker({
  url: import.meta.url, // The path of the current script; if using a bundler, it usually requires passing a URL object
  async handleLoader() {
    const handlers = await import("./xxx.js"); // // Asynchronously import handle functions

    // Return an object containing the handle functions
    return {
      calc2: (a, b) => a + b,
      createString: createRandString, //  Using an external module function
      handleSomething: handlers.handleSomething, // Asynchronously using an module function
    };
  },
});

export default worker;
```

> Notes:
>
> - Please execute new M78Worker() in a separate script file. This script will be executed separately in the main thread and subthreads, creating instances of M78Worker in their respective threads, each with different responsibilities.
>   - The script and its imported modules should not include content or side-effect code unrelated to creating workers, as this content (scripts/imported modules) will be executed multiple times based on the number of created threads.
>   - Accessing worker instances in the current script is incorrect; they must be imported and used in other scripts.
> - Not all tasks are suitable for execution in separate threads. When transferring large amounts of data, or even involving encoding/decoding, the benefits of multi-threaded computation may not be sufficient to offset the data transfer costs between threads.

3. use worker

```js
import worker from "./worker.js";

// Will be executed in sub threads
worker.invoke("calc", 1, 2).then((res) => {
  console.log(res);
});
```

## Config

```ts
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
```

## Worker

```ts
interface M78Worker {
  /** Whether it has been initialized */
  initialized: boolean;

  /** Initialization in progress, can wait for completion through this promise */
  initializeTask: PromiseTask<void> | null;

  /** Store thread objects and their information */
  isWorker: boolean;

  /**
   * Initialize and create a thread. By default, it will automatically initialize on the first invoke.
   * This method can be called repeatedly, but subsequent calls will be ignored.
   *
   * As it involves asynchronous operations such as loading thread scripts, triggering it in advance
   * can improve the speed of the first execution, especially when working with worker threads.
   */
  init(): Promise<any>;

  /** Destroy instance */
  destroy(): void;

  /** Execute specified handle */
  invoke(handleName: string, ...args: ArgType[]): RetType;
}
```

## Handles

```ts
/**
 * Handle executed in a dedicated thread. The request and return types must adhere to the web standard's structured clone algorithm. If you're unsure about which types are available, please refer to the following list. Alternatively, you can simply pass types that can be parsed by `json.parse` (although a wider range of types is supported):
 *
 * Structured clone algorithm: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
 */
export type M78WorkerHandle = AnyFunction;
```
