import { M78Worker } from "@m78/worker";
/** 在内部组件中共享的worker, 用于执行某些可能导致阻塞的耗时操作 */
declare const __worker: M78Worker<typeof import("../../table-vanilla/worker-handlers.js")>;
export { __worker };
//# sourceMappingURL=index.d.ts.map