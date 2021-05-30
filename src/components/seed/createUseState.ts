import { Seed } from '@m78/seed';
import { useEffect, useState } from 'react';
import { useFn } from '@lxjx/hooks';
import { UseState } from './types';

export function _createUseState(seed: Seed) {
  const defSelector = (d: any) => d;

  const _useState: UseState<any> = (selector = defSelector, equalFn) => {
    const select = useFn(() => {
      return selector(seed.getState());
    });

    const [deps, setDeps] = useState(select);

    const handle = useFn(() => {
      const selected = select();
      if (selected !== deps) {
        if (equalFn && equalFn(selected, deps)) return;
        setDeps(selected);
      }
    });

    useEffect(() => seed.subscribe(handle), []);

    return deps;
  };

  return _useState;
}
