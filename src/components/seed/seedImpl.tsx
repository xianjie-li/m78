import React from 'react';
import createApi, { CreateSeedConfig, Validators } from '@m78/seed';
import { AnyObject } from '@lxjx/utils';

import createState from './createState';
import { createUseAuth } from './createUseAuth';
import { AuthProps, ExpandCreate } from './type';
import { createAuth } from './createAuth';
import { createUseState } from './createUseState';

const create: ExpandCreate = <
  S extends AnyObject = AnyObject,
  V extends Validators<S> = Validators<S>
>(
  config: CreateSeedConfig<S, V>,
) => {
  const auth = createApi<S, V>(config);

  const useAuth = createUseAuth<S, V>(auth);

  const Auth = createAuth<S, V>(auth, useAuth);

  const useState = createUseState<S, V>(auth);

  const State = createState<S, V>(auth, useState);

  const withAuth = (conf: Omit<AuthProps<S, V>, 'children'>) => {
    return (Component: React.ComponentType<any>) => {
      const displayName = Component.displayName || Component.name || 'Component';

      const EnhanceComponent: React.FC<any> = props => (
        <Auth {...conf}>{() => <Component {...props} />}</Auth>
      );

      EnhanceComponent.displayName = `withAuth(${displayName})`;

      return EnhanceComponent;
    };
  };

  return {
    ...auth,
    Auth,
    withAuth,
    useAuth,
    useState,
    State,
  };
};

export default create;
