/**
 * `@m78/seed` 的加单包装, 提供了更易于`react`使用的`api`
 * */ export * from "./types.js";
export { cacheMiddleware, devtoolMiddleware } from "@m78/seed";
export { _CreateSeed as createSeed } from "./create-seed.js";
