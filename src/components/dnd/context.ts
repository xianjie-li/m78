import { createContext } from 'react';
import { dumpFn } from '@lxjx/utils';
import { DNDContextValue, DNDRelationContext } from './types';

const defaultContext: DNDContextValue = {
  listeners: [],
  scrollerList: [],
  onStart: dumpFn,
  onMove: dumpFn,
  onAccept: dumpFn,
};

const context = createContext<DNDContextValue>(defaultContext);

context.displayName = 'DNDContext';

const relationContext = createContext<DNDRelationContext>({
  childrens: [],
});

relationContext.displayName = 'DNDRelationContext';

export { defaultContext, relationContext };

export default context;
