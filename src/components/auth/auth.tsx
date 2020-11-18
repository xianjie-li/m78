import React from 'react';
import createApi, { CreateAuthConfig, Validators } from '@lxjx/auth';
import { AnyObject } from '@lxjx/utils';

import { createUseAuth } from './createUseAuth';
import { AuthProps, ExpandCreate } from './type';
import { createAuth } from './createAuth';
import { createUseDeps } from './createUseDeps';

const create: ExpandCreate = <
  D extends AnyObject = AnyObject,
  V extends Validators<D> = Validators<D>
>(
  config: CreateAuthConfig<D, V>,
) => {
  const auth = createApi<D, V>(config);

  const useAuth = createUseAuth<D, V>(auth);

  const Auth = createAuth<D, V>(auth, useAuth);

  const useDeps = createUseDeps<D, V>(auth);

  const withAuth = (conf: Omit<AuthProps<D, V>, 'children'>) => {
    return (Component: React.ComponentType<any>) => {
      const displayName = Component.displayName || Component.name || 'Component';

      const EnhanceComponent: React.FC<any> = props => (
        <Auth {...conf}>
          <Component {...props} />
        </Auth>
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
    useDeps,
    Deps: null!,
  };
};

export default create;
