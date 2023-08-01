import { Middleware } from "./types.js";
export interface CacheMiddlewareConf {
    /**
     * expire time (ms) for performance reasons, only check for expiration during initialization
     *
     * 过期时间(ms), 出于性能考虑，只会在初始化阶段检测是否过期
     * */
    expire?: number;
    /**
     * true | whether to flush the expiration time when reading the cache before expiration
     *
     * true | 在过期前读取缓存时，是否刷新过期时间
     * */
    expireRefresh?: boolean;
    /**
     * session | cache type, the key can be the same
     *
     * session | 缓存类型，不共享缓存key
     * */
    type?: "session" | "local";
    /**
     * cache all keys by default. Set this to enable caching for a specified key
     *
     * 默认缓存全部key，设置此项来开启指定key的缓存
     * */
    testKey?: (key: string) => boolean;
    /**
     * trigger when the cache expires or invalidated
     *
     * 缓存过期或失效时触发
     * */
    onExpire?: () => void;
}
export declare const defaultConf: {
    type: string;
    expireRefresh: boolean;
};
/**
 * 在state每次变更时，将其缓存，并在下次初始化时还原
 * @param key - cache key
 * @param conf
 * */
export declare function cacheMiddleware(key: string, conf?: CacheMiddlewareConf): Middleware | undefined;
//# sourceMappingURL=cacheMiddleware.d.ts.map