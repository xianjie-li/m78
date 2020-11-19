import { Auth } from '@lxjx/auth';
import { useEffect, useState } from 'react';
import { useFn } from '@lxjx/hooks';
import { UseDeps } from './type';

export function createUseDeps<D, V>(auth: Auth<D, V>) {
  const defSelector = (d: any) => d;

  const useDeps: UseDeps<D> = (selector = defSelector, equalFn) => {
    const select = useFn(() => {
      return selector(auth.getDeps());
    });

    const [deps, setDeps] = useState(select);

    const handle = useFn(() => {
      const selected = select();
      if (selected !== deps) {
        if (equalFn && equalFn(selected, deps)) return;
        setDeps(selected);
      }
    });

    useEffect(() => auth.subscribe(handle), []);

    return deps;
  };

  return useDeps;
}
