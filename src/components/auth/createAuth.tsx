import React, { useEffect } from 'react';
import { useSelf } from '@lxjx/hooks';
import { Auth } from '@lxjx/auth';
import Spin from 'm78/spin';
import Button from 'm78/button';
import Result from 'm78/result';
import Popper from 'm78/popper';
import { isFunction } from '@lxjx/utils';
import { ExpandAuth } from './type';

export function createAuth<D, V>(auth: Auth<D, V>, useAuth: ExpandAuth<D, V>['useAuth']) {
  const AuthComponent: ExpandAuth<D, V>['Auth'] = props => {
    const {
      children,
      keys,
      extra,
      validators,
      type = 'feedback',
      icon,
      pendingNode,
      disabled,
      feedback,
    } = props;

    const state = useAuth(keys, { extra, validators, disabled });

    const self = useSelf({
      /** 在实际进行验证前阻止渲染 */
      flag: true,
    });

    useEffect(() => {
      self.flag = false;
    }, []);

    const renderChild = () => (isFunction(children) ? children() : children) as any;

    if (disabled) return renderChild();

    if (self.flag) return null;

    if (state.pending) {
      return pendingNode || <Spin text="验证中" />;
    }

    if (state.rejects) {
      const firstRej = state.rejects[0];

      if (!firstRej || type === 'hidden') return null;

      if (feedback) {
        return feedback(firstRej, props);
      }

      const action =
        firstRej.actions &&
        firstRej.actions.map(({ label, ...btnProps }) => {
          return (
            <Button key={label} size={type === 'popper' ? 'small' : undefined} {...btnProps}>
              {label}
            </Button>
          );
        });

      if (type === 'feedback') {
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

      if (type === 'popper') {
        return (
          <Popper
            className="m78-auth_popper"
            type="popper"
            trigger="click"
            icon={icon}
            content={
              <Result type="notAuth" title={firstRej.label} desc={firstRej.desc} actions={action} />
            }
          >
            {React.cloneElement(renderChild(), { onClick: undefined })}
          </Popper>
        );
      }
    }

    return renderChild();
  };

  AuthComponent.displayName = 'FrAuth';

  return AuthComponent;
}
