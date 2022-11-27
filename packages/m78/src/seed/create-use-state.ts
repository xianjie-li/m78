import { Seed } from "@m78/seed";
import { useState } from "react";
import { useSyncExternalStore } from "use-sync-external-store/shim/index.js";
import { useFn } from "@m78/hooks";
import { UseState } from "./types.js";

export function _createUseState(seed: Seed) {
  const defSelector = (d: any) => d;

  const _useState: UseState<any> = (selector = defSelector, equalFn) => {
    const select = useFn(() => {
      return selector(seed.get());
    });

    // 用作缓存前一状态的state 通过引用直接操作
    const [deps] = useState(() => ({
      state: select(),
    }));

    const getSnapshot = useFn(() => {
      const selected = select();

      if (equalFn && equalFn(selected, deps.state)) return deps.state;

      if (selected === deps.state) return deps.state;

      deps.state = selected;

      return selected;
    });

    return useSyncExternalStore(seed.subscribe, getSnapshot, select);
  };

  return _useState;
}
