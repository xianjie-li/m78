import React from 'react';
import { Auth } from '@lxjx/auth';
import { isFunction } from '@lxjx/utils';
import { Deps, UseDeps } from './type';

function createDeps<D, V>(auth: Auth<D, V>, useDeps: UseDeps<D>) {
  const _Deps: Deps<D> = ({ children }) => {
    const deps = useDeps();

    if (isFunction(children)) {
      return children(deps) as React.ReactElement;
    }
    return null;
  };

  return _Deps;
}

export default createDeps;
