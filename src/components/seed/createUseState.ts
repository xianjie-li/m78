import { Seed } from '@m78/seed';
import { useEffect, useState } from 'react';
import { useFn } from '@lxjx/hooks';
import { UseState } from './types';

export function _createUseState(seed: Seed) {
  const defSelector = (d: any) => d;

  const _useState: UseState<any> = (selector = defSelector, equalFn) => {
    const select = useFn(() => {
      return selector(seed.get());
    });

    const [deps, setDeps] = useState(() => ({
      state: select(),
    }));

    const handle = useFn(() => {
      const selected = select();
      if (selected !== deps.state) {
        if (equalFn && equalFn(selected, deps.state)) return;
        // !!selected有可能是函数，千万别直接存useState, 需要通过对象转存
        setDeps({
          state: selected,
        });
      }
    });

    useEffect(() => seed.subscribe(handle), []);

    return deps.state;
  };

  return _useState;
}
