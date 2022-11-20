/**
 * `@m78/seed` 的加单包装, 提供了更易于`react`使用的`api`
 * */
import cacheMiddleware from "@m78/seed/cacheMiddleware";
import devtoolMiddleware from "@m78/seed/devtoolMiddleware";
import { _CreateSeed as createSeed } from "./create-seed";
export * from "@m78/seed";
export * from "./types";
export { cacheMiddleware, devtoolMiddleware };
export { createSeed };
//# sourceMappingURL=index.d.ts.map