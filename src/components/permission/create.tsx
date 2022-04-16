import { AnyObject } from '@lxjx/utils';
import { CreatePermissionConfig, Validators, create } from '@m78/permission';
import { createPermissionExpandApis } from './common';
import { RCPermission, RCPermissionCreate } from './types';

export const _create: RCPermissionCreate = <
  S extends AnyObject = AnyObject,
  V extends Validators<S> = Validators<S>
>(
  config: CreatePermissionConfig<S, V>,
) => {
  const permission = create<S, V>(config);

  const expandApis = createPermissionExpandApis(config.seed, permission);

  const Permission = expandApis.Permission;

  Object.assign(Permission, {
    permission,
    usePermission: expandApis.usePermission,
    withPermission: expandApis.withPermission,
  });

  return (Permission as unknown) as RCPermission<S, V>;
};
