import { createContext } from 'react';
import { DNDContext, DNDRelationContext } from 'm78/dnd/types';
import { dumpFn } from '@lxjx/utils';

const defaultContext: DNDContext = {
  listeners: [],
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
