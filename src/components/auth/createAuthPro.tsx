import React from 'react';
import { createAuthPro, AUTH_PRO_NAME } from '@m78/auth';
import { AuthProValidMeta } from '@m78/auth/proType';
import { authProFeedback, createAuthExpandApis } from './common';
import { RCAuthPro, RCAuthProCreator } from './types';

export const _createAuthPro: RCAuthProCreator = config => {
  const authPro = createAuthPro({
    lang: 'zh-CN',
    ...config,
  });

  const apis = createAuthExpandApis(config.seed, authPro.authInstance, true);

  const AuthPro = (props: any) => (
    <apis.Auth feedback={authProFeedback} {...props} keys={[AUTH_PRO_NAME]} extra={props.keys}>
      {props.children}
    </apis.Auth>
  );

  AuthPro.displayName = 'AuthPro';

  const useAuth: RCAuthPro['useAuth'] = keys =>
    apis.useAuth([AUTH_PRO_NAME], {
      extra: keys,
    }) as AuthProValidMeta[] | null;

  const withAuth: RCAuthPro['withAuth'] = ({ keys, ...o }) => {
    return apis.withAuth({
      ...o,
      extra: keys,
      keys: [AUTH_PRO_NAME],
    } as any);
  };

  Object.assign(AuthPro, authPro, {
    useAuth,
    withAuth,
  });

  return (AuthPro as any) as RCAuthPro;
};
