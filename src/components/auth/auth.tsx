import React from 'react';
import createApi, { CreateAuthConfig, Validators } from '@lxjx/auth';
import { AnyObject } from '@lxjx/utils';

import { AuthProps, ExpandCreate } from './type';
import { createAuth } from './createAuth';

const create: ExpandCreate = <
  D extends AnyObject = AnyObject,
  V extends Validators<D> = Validators<D>
>(
  config: CreateAuthConfig<D, V>,
) => {
  const auth = createApi(config);

  const Auth = createAuth(auth);

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
  };
};

export default create;
