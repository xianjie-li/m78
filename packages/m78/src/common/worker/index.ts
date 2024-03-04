import { M78Worker } from "@m78/worker";

/** 在内部组件中共享的worker, 用于执行某些可能导致阻塞的耗时操作 */
const __worker = new M78Worker({
  url: import.meta.url,
  workerNum: 2,
  async handleLoader() {
    const [tableHandles] = await Promise.all([
      import("../../table-vanilla/worker-handlers.js"),
    ]);

    console.log(tableHandles);

    return Object.assign({}, tableHandles);
  },
  name: "m78-component-worker",
});

export { __worker };
