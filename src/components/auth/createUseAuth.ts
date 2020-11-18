import { Auth } from '@lxjx/auth';
import { useEffectEqual, useFn, useSetState } from '@lxjx/hooks';
import { useEffect } from 'react';
import { useDelayDerivedToggleStatus } from 'm78/hooks';
import { ExpandAuth } from './type';

export function createUseAuth<D, V>(auth: Auth<D, V>) {
  type UseAuth = ExpandAuth<D, V>['useAuth'];

  const useAuth: UseAuth = (keys, config) => {
    const { disabled = false } = config || {};

    const [state, setState] = useSetState<ReturnType<UseAuth>>({
      pending: false,
      rejects: null,
    });

    const _pending = useDelayDerivedToggleStatus(state.pending, 100);

    const authHandler = useFn(() => {
      if (disabled) return;

      !state.pending && setState({ pending: true });

      auth.auth(keys, config!).then(rejects => {
        setState({
          rejects,
          pending: false,
        });
      });
    });

    useEffectEqual(authHandler, [keys, config?.extra]);

    useEffect(() => auth.subscribe(authHandler), []);

    return {
      ...state,
      pending: _pending,
    };
  };

  return useAuth;
}
