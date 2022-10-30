import { Seed, CreateSeedConfig, Share, Subscribe } from './types';
/**
 * 生成和实现subscribe() api
 * - 通知功能在setDeps内部
 * */
export declare function subscribeImpl(share: Share): Subscribe;
/**
 * 实现中间件功能
 * */
export declare function middlewareImpl(conf: CreateSeedConfig): readonly [CreateSeedConfig<any>] | readonly [CreateSeedConfig<any>, (apis: Seed) => void];
//# sourceMappingURL=common.d.ts.map