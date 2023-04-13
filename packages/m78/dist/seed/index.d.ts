/**
 * `@m78/seed` 的加单包装, 提供了更易于`react`使用的`api`
 * */
import cacheMiddleware from "@m78/seed/cacheMiddleware.js";
import devtoolMiddleware from "@m78/seed/devtoolMiddleware.js";
export type { Middleware, MiddlewareBonusInit, MiddlewareBonusPatch, CreateSeedConfig, Listener, Subscribe, } from "@m78/seed";
export * from "./types.js";
export { cacheMiddleware, devtoolMiddleware };
export { _CreateSeed as createSeed } from "./create-seed.js";
//# sourceMappingURL=index.d.ts.map