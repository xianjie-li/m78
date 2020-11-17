import React from 'react';
import { UseCheckReturns } from '@lxjx/hooks';
import { ExpansionBase } from './types';
declare type ExpansionCtx = ExpansionBase & {
    checker: UseCheckReturns<string, string>;
    accordion: boolean;
};
declare const context: React.Context<ExpansionCtx>;
declare const Provider: React.Provider<ExpansionCtx>, Consumer: React.Consumer<ExpansionCtx>;
declare function useCtx(): ExpansionCtx;
export { context, Provider, Consumer, useCtx };
