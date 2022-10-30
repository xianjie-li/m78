import { isFunction, isNumber, isObject } from "@m78/utils";
import { Middleware } from "./types";

const PREFIX = "SEED_CACHE_";

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
  testKey?: (key: string) => boolean; // 验证通过的值进行缓存
  /**
   * trigger when the cache expires or invalidated
   *
   * 缓存过期或失效时触发
   * */
  onExpire?: () => void;
}

export const defaultConf = {
  type: "session",
  expireRefresh: true,
};

type InnerConf = CacheMiddlewareConf & typeof defaultConf;

/**
 * 在state每次变更时，将其缓存，并在下次初始化时还原
 * @param key - cache key
 * @param conf
 * */
export default function cache(key: string, conf?: CacheMiddlewareConf) {
  const config = {
    ...defaultConf,
    ...conf,
  } as InnerConf;

  const { expire } = config;

  const k = `${PREFIX}${config.type}_${key}`.toUpperCase();

  const expireKey = `${k}_EXPIRE`;

  const storage = getStorageObj(config);

  if (!storage) return;

  if (config.expire) checkExpire(k, expireKey, storage, config);

  const cacheMiddleware: Middleware = (bonus) => {
    if (bonus.init) {
      const _conf = bonus.config;

      const cacheData = get(k, storage);

      if (!cacheData) return _conf;

      return { ..._conf, state: { ..._conf.state, ...cacheData } };
    }

    bonus.apis.subscribe(() => {
      set(k, bonus.apis.get(), storage, config);

      if (isNumber(expire) && expire > 0) {
        setExpire(expireKey, storage, config);
      }
    });
  };

  return cacheMiddleware;
}

function get(key: string, storage: Storage) {
  const cData = storage.getItem(key);

  if (!cData) return;

  const parseData = JSON.parse(cData);

  if (!isObject(parseData)) return;

  return parseData;
}

function set(key: string, val: any, storage: Storage, config: InnerConf) {
  if (!val) return;

  let cacheObj: any = {};

  if (isFunction(config.testKey)) {
    Object.entries(val).forEach(([k, v]) => {
      if (config.testKey!(k)) {
        cacheObj[k] = v;
      }
    });
  } else {
    cacheObj = val;
  }

  storage.setItem(key, JSON.stringify(cacheObj));
}

/** 设置缓存时间，默认只在未设置时设置，开启expireRefresh后在每一次执行时更新缓存 */
function setExpire(expireKey: string, storage: Storage, config: InnerConf) {
  const exT = storage.getItem(expireKey);

  if (exT && !config.expireRefresh) return;
  if (!config.expire) return;

  // 在第一次缓存时间
  storage.setItem(expireKey, String(Date.now() + config.expire));
}

/** 检测缓存有效性，过期时删除缓存，启用expireRefresh且未过期时刷新缓存, 否则不执行操作 */
function checkExpire(
  k: string,
  expireKey: string,
  storage: Storage,
  config: InnerConf
) {
  const exT = storage.getItem(expireKey);

  if (!exT) return;

  // 已过期
  if (Date.now() > Number(exT)) {
    config.onExpire?.();
    storage.removeItem(k);
    storage.removeItem(expireKey);
  } else if (config.expireRefresh) {
    // 未过期, 刷新缓存时间
    config.expire && setExpire(expireKey, storage, config);
  }
}

/**
 * 获取缓存方法，根据环境可能为null
 * */
function getStorageObj({ type }: InnerConf) {
  if (typeof window === "undefined") return null;

  const map = {
    session: window.sessionStorage,
    local: window.localStorage,
  };

  return map[type] || null;
}
