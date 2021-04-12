import React from 'react';
import { Seed } from '@m78/seed';
import { isFunction } from '@lxjx/utils';
import { State, UseState } from './type';

function createState<D, V>(seed: Seed<D, V>, useState: UseState<D>) {
  const _Deps: State<D> = ({ children }) => {
    const state = useState();

    if (isFunction(children)) {
      return children(state) as React.ReactElement;
    }
    return null;
  };

  return _Deps;
}

export default createState;
