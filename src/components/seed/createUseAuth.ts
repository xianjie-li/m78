import { Seed } from '@m78/seed';
import { useEffectEqual, useFn } from '@lxjx/hooks';
import { useEffect, useState } from 'react';
import { UseAuth } from './type';

export function createUseAuth<S, V>(seed: Seed<S, V>) {
  const useAuth: UseAuth<S, V> = (keys, config) => {
    const { disabled = false } = config || {};

    const authHandler = useFn(() => {
      if (disabled) {
        return null;
      }

      return seed.auth(keys, config!);
    });

    const [rejects, setRejects] = useState<ReturnType<UseAuth<S, V>>>(authHandler);

    const update = useFn(() => {
      const rej = authHandler();
      if (rej !== rejects) {
        setRejects(rej);
      }
    });

    useEffectEqual(() => update(), [keys, config?.extra]);

    useEffect(() => seed.subscribe(() => update()), []);

    return rejects;
  };

  return useAuth;
}
