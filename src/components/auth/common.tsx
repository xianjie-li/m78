import { Result } from 'm78/result';
import React, { useEffect, useState } from 'react';
import { isFunction } from '@lxjx/utils';
import { Seed } from '@m78/seed';
import { Button } from 'm78/button';
import { Auth, ValidMeta } from '@m78/auth';
import { useEffectEqual, useFn } from '@lxjx/hooks';
import { Bubble, BubbleTypeEnum } from 'm78/bubble';
import { AuthProProps, AuthProps, AuthTypeEnum, RCAuth, UseAuth } from './types';

/** 定制AuthPro反馈内容 */
export const authProFeedback: NonNullable<AuthProProps['feedback']> = (
  rejects,
  { icon, children, type = AuthTypeEnum.feedback },
) => {
  const title = '没有访问权限';

  let desc: React.ReactNode = null;

  if (rejects.length) {
    // 任意一项包含详细信息
    const hasSomeValid = rejects.some(item => item.missing.length);

    if (hasSomeValid) {
      desc = (
        <div className="m78-auth-pro_desc">
          <div>
            {rejects.map(item => (
              <div key={item.name}>
                <span className="mr-8">{item.name}:</span>
                缺少[
                <span className="color mlr-4">{item.missing.join(', ')}</span>
                ]权限
              </div>
            ))}
          </div>
        </div>
      );
    }
  }

  if (type === AuthTypeEnum.feedback) {
    return (
      <Result type="notAuth" icon={icon} title={title}>
        {desc}
      </Result>
    );
  }

  if (type === AuthTypeEnum.popper) {
    const renderChild = () => (isFunction(children) ? children() : children) as any;
    return (
      <Bubble
        className="m78-auth_popper"
        type={BubbleTypeEnum.popper}
        icon={icon}
        content={
          <Result type="notAuth" title={title}>
            {desc}
          </Result>
        }
      >
        {React.cloneElement(renderChild(), { onClick: undefined })}
      </Bubble>
    );
  }
};

/** 实现Auth组件 */
export function createAuthComponent<S, V>(seed: Seed<S>, useAuth: RCAuth<S, V>['useAuth']) {
  const AuthComponent = (props: AuthProps<S, V>) => {
    const {
      children,
      keys,
      extra,
      validators,
      type = AuthTypeEnum.feedback,
      icon,
      disabled,
      feedback,
    } = props;

    const rejects = useAuth(keys, { extra, validators, disabled });

    const renderChild = () => (isFunction(children) ? children() : children) as any;

    if (disabled) return renderChild();

    if (rejects && rejects.length) {
      if (type === AuthTypeEnum.hidden) return null;

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
              size={type === AuthTypeEnum.popper ? 'small' : undefined}
              {...btnProps}
            >
              {label}
            </Button>
          );
        });

      if (type === AuthTypeEnum.feedback) {
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

      if (type === AuthTypeEnum.popper) {
        return (
          <Bubble
            className="m78-auth_popper"
            type={BubbleTypeEnum.popper}
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

  AuthComponent.displayName = 'Auth';

  return AuthComponent;
}

/** 实现useAuth */
export function createUseAuth<S, V>(seed: Seed<S>, auth: Auth<S, V>, isPro: boolean) {
  const useAuth: UseAuth<S, V> = (keys, config) => {
    const { disabled = false } = config || {};

    const authHandler = useFn(() => {
      if (disabled) {
        return null;
      }

      const rej = auth(keys, config!);

      if (isPro) {
        return ((rej?.length ? rej[0] : null) as unknown) as ValidMeta[];
      }

      return rej;
    });

    const [rejects, setRejects] = useState<ReturnType<UseAuth<S, V>>>(authHandler);

    const update = useFn(() => {
      const rej = authHandler();
      if (rej !== rejects) {
        setRejects(rej);
      }
    });

    useEffectEqual(update, [keys, config?.extra]);

    useEffect(() => seed.subscribe(update), []);

    return rejects;
  };

  return useAuth;
}

/** 实现所有扩展api, 针对pro的实现可以通过isPro检测并进行处理 */
export function createAuthExpandApis(seed: Seed, auth: Auth, isPro = false) {
  const useAuth = createUseAuth(seed, auth, isPro);

  const AuthComponent = createAuthComponent<any, any>(seed, useAuth);

  AuthComponent.displayName = 'Auth';

  const withAuth = (conf: Omit<AuthProps<any, any>, 'children'>) => {
    return (Component: React.ComponentType<any>) => {
      const displayName = Component.displayName || Component.name || 'Component';

      const EnhanceComponent: React.FC<any> = props => (
        <AuthComponent {...conf}>{() => <Component {...props} />}</AuthComponent>
      );

      EnhanceComponent.displayName = `withAuth(${displayName})`;

      return EnhanceComponent;
    };
  };

  return {
    useAuth,
    Auth: AuthComponent,
    withAuth,
  };
}
