import React, { useEffect } from 'react';
import { useEffectEqual, useFn, useSelf, useSetState } from '@lxjx/hooks';
import { Auth, ValidMeta } from '@lxjx/auth';
import { useDelayDerivedToggleStatus } from '@lxjx/fr/hooks';
import Spin from '@lxjx/fr/spin';
import Button from '@lxjx/fr/button';
import Result from '@lxjx/fr/result';
import Popper from '@lxjx/fr/popper';
import { AuthProps } from './type';

export function createAuth<D, V>(auth: Auth<D, V>) {
  const AuthComponent: React.FC<AuthProps<D, V>> = props => {
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

    const [state, setState] = useSetState({
      pending: true,
      rejects: (null as unknown) as ValidMeta[] | null,
    });

    const self = useSelf({
      /** 在实际进行验证前阻止渲染 */
      flag: true,
    });

    const loading = useDelayDerivedToggleStatus(state.pending);

    const authHandler = useFn(() => {
      if (disabled) return;

      !state.pending && setState({ pending: true });

      self.flag = false;

      auth
        .auth(keys, { extra, validators })
        .then(rejects => {
          setState({
            rejects,
          });
        })
        .finally(() => {
          setState({ pending: false });
        });
    });

    useEffectEqual(authHandler, [keys, extra]);

    useEffect(() => {
      return auth.subscribe(authHandler);
    }, []);

    if (disabled) return children;

    if (self.flag) return null;

    if (loading) {
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
            className="fr-auth_popper"
            type="popper"
            trigger="click"
            icon={icon}
            content={
              <Result type="notAuth" title={firstRej.label} desc={firstRej.desc} actions={action} />
            }
          >
            {React.cloneElement(children, { onClick: undefined })}
          </Popper>
        );
      }
    }

    return children;
  };

  AuthComponent.displayName = 'FrAuth';

  return AuthComponent;
}
