import React from 'react';
import { Seed } from '@m78/seed';
import { Button } from 'm78/button';
import { Result } from 'm78/result';
import { Popper } from 'm78/popper';
import { isFunction } from '@lxjx/utils';
import { AuthTypeEnum, ExpandSeed } from './type';

export function createAuth<D, V>(seed: Seed<D, V>, useAuth: ExpandSeed<D, V>['useAuth']) {
  const AuthComponent: ExpandSeed<D, V>['Auth'] = props => {
    const {
      children,
      keys,
      extra,
      validators,
      type = 'feedback',
      icon,
      disabled,
      feedback,
    } = props;

    const rejects = useAuth(keys, { extra, validators, disabled });

    const renderChild = () => (isFunction(children) ? children() : children) as any;

    if (disabled) return renderChild();

    if (rejects && rejects.length) {
      const firstRej = rejects[0];

      if (type === AuthTypeEnum.hidden) return null;

      if (feedback) {
        return feedback(firstRej, props);
      }

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

  AuthComponent.displayName = 'Auth';

  return AuthComponent;
}
