import { Auth } from '@lxjx/auth';
import { useEffect, useState } from 'react';
import { useFn } from '@lxjx/hooks';
import { ExpandAuth } from './type';

export function createUseDeps<D, V>(auth: Auth<D, V>) {
  const defSelector = (d: any) => d;

  const useDeps: ExpandAuth<D, V>['useDeps'] = <ScopeDep = D>(selector = defSelector, equalFn) => {
    const select = useFn(() => {
      return selector(auth.getDeps());
    });

    const [deps, setDeps] = useState<ScopeDep>(select);

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
