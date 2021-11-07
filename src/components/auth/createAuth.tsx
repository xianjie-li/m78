import { AnyObject } from '@lxjx/utils';
import { CreateAuthConfig, Validators, createAuth as create } from '@m78/auth';
import { createAuthExpandApis } from './common';
import { RCAuth, RCAuthCreate } from './types';

export const _createAuth: RCAuthCreate = <
  S extends AnyObject = AnyObject,
  V extends Validators<S> = Validators<S>
>(
  config: CreateAuthConfig<S, V>,
) => {
  const auth = create<S, V>(config);

  const expandApis = createAuthExpandApis(config.seed, auth);

  const Auth = expandApis.Auth;

  Object.assign(Auth, {
    auth,
    useAuth: expandApis.useAuth,
    withAuth: expandApis.withAuth,
  });

  return (Auth as unknown) as RCAuth<S, V>;
};
