import { createContext } from 'react';
import { dumpFn } from '@lxjx/utils';
import { DNDContext, DNDRelationContext } from './types';

const defaultContext: DNDContext = {
  listeners: [],
  scrollerList: [],
  onStart: dumpFn,
  onMove: dumpFn,
  onAccept: dumpFn,
};

const context = createContext<DNDContext>(defaultContext);

context.displayName = 'DNDContext';

const relationContext = createContext<DNDRelationContext>({
  childrens: [],
});

relationContext.displayName = 'DNDRelationContext';

export { defaultContext, relationContext };

export default context;
