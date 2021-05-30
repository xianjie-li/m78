import React from 'react';
import { Seed } from '@m78/seed';
import { isFunction } from '@lxjx/utils';
import { State, UseState } from './types';

export function _createState(seed: Seed, useState: UseState<any>) {
  const _Deps: State<any> = ({ children }) => {
    const state = useState();

    if (isFunction(children)) {
      return children(state) as React.ReactElement;
    }
    return null;
  };

  return _Deps;
}
