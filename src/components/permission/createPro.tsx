import React from 'react';
import { createPro, PERMISSION_PRO_NAME, PermissionProRejectMeta } from '@m78/permission';
import { proFeedback, createPermissionExpandApis } from './common';
import { RCPermissionPro, RCPermissionProCreator } from './types';

export const _createPro: RCPermissionProCreator = config => {
  const pro = createPro(config);

  const apis = createPermissionExpandApis(pro.seed, pro.permission!, true);

  const Pro = (props: any) => (
    <apis.Permission
      feedback={proFeedback}
      {...props}
      keys={[PERMISSION_PRO_NAME]}
      extra={props.keys}
    >
      {props.children}
    </apis.Permission>
  );

  Pro.displayName = 'PermissionPro';

  const usePermission: RCPermissionPro['usePermission'] = keys =>
    apis.usePermission([PERMISSION_PRO_NAME], {
      extra: keys,
    }) as PermissionProRejectMeta;

  const withPermission: RCPermissionPro['withPermission'] = ({ keys, ...o }) => {
    return apis.withPermission({
      ...o,
      extra: keys,
      keys: [PERMISSION_PRO_NAME],
    } as any);
  };

  Object.assign(Pro, pro, {
    usePermission,
    withPermission,
  });

  return (Pro as any) as RCPermissionPro;
};
