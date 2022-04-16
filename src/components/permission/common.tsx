import { Result } from 'm78/result';
import React, { useEffect, useState } from 'react';
import { isFunction } from '@lxjx/utils';
import { Seed } from '@m78/seed';
import { Button } from 'm78/button';
import { useEffectEqual, useFn } from '@lxjx/hooks';
import { Bubble, BubbleType } from 'm78/bubble';
import { Permission, PermissionProMeta, ValidMeta } from '@m78/permission';
import {
  PermissionProProps,
  PermissionProps,
  PermissionType,
  RCPermission,
  UsePermission,
} from './types';

/** 定制Pro反馈内容 */
export const proFeedback: NonNullable<PermissionProProps['feedback']> = (
  rejects,
  { icon, children, type = PermissionType.feedback },
) => {
  const title = '没有访问权限';

  let desc: React.ReactNode = null;
  let action: React.ReactNode = null;

  if (rejects.length) {
    // 任意一项包含详细信息
    desc = (
      <div className="m78-permission-pro_desc">
        <div>
          {rejects.map(item => (
            <div key={item.module}>
              <span className="mr-8 bold">{item.label}:</span>
              <span className="color-second">
                缺少 [
                {item.missing.map((it, index) => (
                  <span
                    className="color mlr-4"
                    key={it.key}
                    title={it.desc}
                    style={{ cursor: it.desc ? 'help' : undefined }}
                  >
                    {it.label}
                    {index !== item.missing.length - 1 && ','}
                  </span>
                ))}
                ] 权限
              </span>
            </div>
          ))}
        </div>
      </div>
    );

    if (type === PermissionType.feedback || type === PermissionType.popper) {
      const actionList: NonNullable<PermissionProMeta['actions']> = [];

      // 取出所有reject信息 过滤掉同label的action
      // 权限的总数一般非常少, 所以这里多层循环不需要优化
      rejects.forEach(item => {
        item.missing.forEach(it => {
          if (!it.actions?.length) return;

          it.actions.forEach(i => {
            const c = actionList.find(cur => i.label === cur.label);

            if (!c) actionList.push(i);
          });
        });
      });

      if (actionList.length) {
        action = actionList.map(item => (
          <Button {...item} key={item.label}>
            {item.label}
          </Button>
        ));
      }
    }
  }

  if (type === PermissionType.feedback) {
    return (
      <Result type="notAuth" icon={icon} title={title} actions={action}>
        {desc}
      </Result>
    );
  }

  if (type === PermissionType.popper) {
    const renderChild = () => (isFunction(children) ? children() : children) as any;
    return (
      <Bubble
        className="m78-permission_popper"
        type={BubbleType.popper}
        icon={icon}
        content={
          <Result type="notAuth" title={title} actions={action}>
            {desc}
          </Result>
        }
      >
        {React.cloneElement(renderChild(), { onClick: undefined })}
      </Bubble>
    );
  }
};

/** 实现Permission组件 */
export function createPermissionComponent<S, V>(
  seed: Seed<S>,
  usePermission: RCPermission<S, V>['usePermission'],
) {
  const PermissionComponent = (props: PermissionProps<S, V>) => {
    const {
      children,
      keys,
      extra,
      validators,
      type = PermissionType.feedback,
      icon,
      disabled,
      feedback,
    } = props;

    const rejects = usePermission(keys, { extra, validators, disabled });

    const renderChild = () => (isFunction(children) ? children() : children) as any;

    if (disabled) return renderChild();

    if (rejects && rejects.length) {
      if (type === PermissionType.hidden) return null;

      if (feedback) {
        return feedback(rejects, props);
      }

      const firstRej = rejects[0];

      const action =
        firstRej.actions &&
        firstRej.actions.map(({ label, ...btnProps }) => {
          return (
            <Button
              key={label}
              size={type === PermissionType.popper ? 'small' : undefined}
              {...btnProps}
            >
              {label}
            </Button>
          );
        });

      if (type === PermissionType.feedback) {
        return (
          <Result
            type="notAuth"
            icon={icon}
            title={firstRej.label}
            desc={firstRej.desc}
            actions={action}
          />
        );
      }

      if (type === PermissionType.popper) {
        return (
          <Bubble
            className="m78-permission_popper"
            type={BubbleType.popper}
            icon={icon}
            content={
              <Result type="notAuth" title={firstRej.label} desc={firstRej.desc} actions={action} />
            }
          >
            {React.cloneElement(renderChild(), { onClick: undefined })}
          </Bubble>
        );
      }
    }

    return renderChild();
  };

  PermissionComponent.displayName = 'Permission';

  return PermissionComponent;
}

/** 实现usePermission */
export function createUsePermission<S, V>(
  seed: Seed<S>,
  permission: Permission<S, V>,
  isPro: boolean,
) {
  const usePermission: UsePermission<S, V> = (keys, config) => {
    const { disabled = false } = config || {};

    const handler = useFn(() => {
      if (disabled) {
        return null;
      }

      const rej = permission(keys, config!);

      if (isPro) {
        return ((rej?.length ? rej[0] : null) as unknown) as ValidMeta[];
      }

      return rej;
    });

    const [rejects, setRejects] = useState<ReturnType<UsePermission<S, V>>>(handler);

    const update = useFn(() => {
      const rej = handler();
      if (rej !== rejects) {
        setRejects(rej);
      }
    });

    useEffectEqual(update, [keys, config?.extra]);

    useEffect(() => seed.subscribe(update), []);

    return rejects;
  };

  return usePermission;
}

/** 实现所有扩展api, 针对pro的实现可以通过isPro检测并进行处理 */
export function createPermissionExpandApis(seed: Seed, permission: Permission, isPro = false) {
  const usePermission = createUsePermission(seed, permission, isPro);

  const PermissionComponent = createPermissionComponent<any, any>(seed, usePermission);

  const withPermission = (conf: Omit<PermissionProps<any, any>, 'children'>) => {
    return (Component: React.ComponentType<any>) => {
      const displayName = Component.displayName || Component.name || 'Component';

      const EnhanceComponent: React.FC<any> = props => (
        <PermissionComponent {...conf}>{() => <Component {...props} />}</PermissionComponent>
      );

      EnhanceComponent.displayName = `withPermission(${displayName})`;

      return EnhanceComponent;
    };
  };

  return {
    usePermission,
    Permission: PermissionComponent,
    withPermission,
  };
}
