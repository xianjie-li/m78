import { Seed } from '@m78/seed';
import { useEffect, useState } from 'react';
import { useFn } from '@lxjx/hooks';
import { UseState } from './type';

export function createUseState<D, V>(seed: Seed<D, V>) {
  const defSelector = (d: any) => d;

  const _useState: UseState<D> = (selector = defSelector, equalFn) => {
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
