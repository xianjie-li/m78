import { Seed, SetState, Share, CoverSetState, SeedCreator } from "./types.js";
import { middlewareImpl, subscribeImpl } from "./common.js";

const create: SeedCreator = (conf = {}) => {
  const [config, patchHandle] = middlewareImpl(conf);

  const { state } = config;

  const share: Share = {
    state: { ...state! },
    listeners: [],
  };

  const setState: SetState = (patch) => {
    share.state = { ...share.state!, ...patch };
    /** 触发listener */
    share.listeners.forEach((listener) => listener(patch));
  };

  const coverSetState: CoverSetState = (patch) => {
    share.state = { ...patch };
    /** 触发listener */
    share.listeners.forEach((listener) => listener(patch));
  };

  const subscribe = subscribeImpl(share);

  const apis = {
    subscribe,
    set: setState,
    coverSet: coverSetState,
    get: () => share.state!,
  } as Seed;

  patchHandle && patchHandle(apis);

  return apis;
};

export default create;
