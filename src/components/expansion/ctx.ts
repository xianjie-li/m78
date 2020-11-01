import React, { useContext } from 'react';
import { UseCheckReturns } from '@lxjx/hooks';
import { ExpansionBase } from './types';

type ExpansionCtx = ExpansionBase & { checker: UseCheckReturns<string, string> };

const context = React.createContext<ExpansionCtx>({ checker: null! });

const { Provider, Consumer } = context;

function useCtx() {
  return useContext(context);
}

export { context, Provider, Consumer, useCtx };
