import { AnyObject } from "@m78/utils";
import {
  Seed,
  CreateSeedConfig,
  Listener,
  MiddlewareBonusInit,
  MiddlewareBonusPatch,
  Share,
  Subscribe,
} from "./types";

/**
 * 生成和实现subscribe() api
 * - 通知功能在setDeps内部
 * */
export function subscribeImpl(share: Share): Subscribe {
  return (listener: Listener) => {
    share.listeners.push(listener);

    return () => {
      const ind = share.listeners.indexOf(listener);
      if (ind === -1) return;
      share.listeners.splice(ind, 1);
    };
  };
}

/**
 * 实现中间件功能
 * */
export function middlewareImpl(conf: CreateSeedConfig) {
  const { middleware } = conf;

  if (!middleware?.length) return [conf] as const;

  const allMid = [...middleware];

  const ctx: AnyObject = {};

  const initBonus: MiddlewareBonusInit = {
    ctx,
    config: conf,
    init: true,
  };

  allMid.forEach((mid) => {
    if (mid) {
      const nextConf = mid(initBonus);
      if (nextConf === undefined)
        throw Error(
          "seed: do you forget to return to the config during the middleware initialization phase?"
        );
      initBonus.config = nextConf;
    }
  });

  const patchHandler = (apis: Seed) => {
    const patchBonus: MiddlewareBonusPatch = {
      init: false,
      apis,
      ctx,
      monkey: (name, cb) => {
        const next = apis[name];
        if (!next) return;
        apis[name] = cb(next);
      },
    };

    allMid.reverse(); /* patch函数是由内到外执行的，需要反转顺序 */

    allMid.forEach((mid) => mid && mid(patchBonus));
  };

  return [initBonus.config, patchHandler] as const;
}
