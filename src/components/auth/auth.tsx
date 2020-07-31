import React, { useEffect } from 'react';
import create, { ValidMeta, CreateAuthConfig, Validators } from '@lxjx/auth';
import Result from '@lxjx/fr/result';
import { AnyObject } from '@lxjx/utils';
import { useSetState } from '@lxjx/hooks';
import Button from '@lxjx/fr/button';
import { AuthProps, ExpandCreate } from './type';

const create1: ExpandCreate = <
  D extends AnyObject = AnyObject,
  V extends Validators<D> = Validators<D>
>(
  config: CreateAuthConfig<D, V>,
) => {
  const auth = create(config);

  const Auth: React.FC<AuthProps<V>> = ({ children, keys, extra }) => {
    const [state, setState] = useSetState({
      pass: false,
      pending: true,
      rejects: [] as ValidMeta[],
    });

    useEffect(authHandler, []);

    useEffect(() => {
      return auth.subscribe(authHandler);
    }, []);

    function authHandler() {
      !state.pending && setState({ pending: true });

      auth
        .auth(keys, extra)
        .then(result => {
          console.log(22, result);
          setState(result);
        })
        .finally(() => {
          setState({ pending: false });
        });
    }

    if (state.pending) {
      return <span>loading...</span>;
    }

    if (!state.pass) {
      const rejInfo = state.rejects[0];

      if (!rejInfo) return;

      const action =
        rejInfo.actions &&
        rejInfo.actions.map(({ label, ...btnProps }) => {
          return (
            <Button key={label} {...btnProps}>
              {label}
            </Button>
          );
        });

      return <Result type="notAuth" title={rejInfo.label} desc={rejInfo.desc} actions={action} />;
    }

    return children;
  };

  return {
    ...auth,
    Auth,
  };
};

const { Auth: AuthT, update } = create1({
  dependency: {
    name: 'lxj',
    age: 17,
  },
  validators: {
    master(deps) {
      if (deps.name !== 'lxj') {
        return {
          label: '管理员可用',
          desc: '该操作只能由管理员进行',
          actions: [
            {
              label: '去登陆',
              color: 'red',
              onClick() {
                window.alert(1);
              },
            },
            {
              label: '去搜索',
              onClick() {
                window.alert(2);
              },
            },
            {
              label: '不处理',
              onClick() {
                window.alert(3);
              },
            },
          ],
        };
      }
    },
    adult(deps) {
      if (!deps.age || deps.age < 18) {
        return {
          label: '18+',
          desc: '只能18岁以上用户访问',
        };
      }
    },
  },
});

const Auth = () => {
  return (
    <div>
      <AuthT keys={['master']}>
        <span style={{ fontSize: 18 }}>验证成功</span>
      </AuthT>

      <button type="button" onClick={() => update({ name: 'lxj' })}>
        change user to `lxj`
      </button>
      <button type="button" onClick={() => update({ name: 'lxj1' })}>
        change user to `lxj1`
      </button>

      <button type="button" onClick={() => update({ age: 17 })}>
        change age to `17`
      </button>
      <button type="button" onClick={() => update({ age: 19 })}>
        change user to `19`
      </button>
    </div>
  );
};

export default Auth;
