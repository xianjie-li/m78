import { createContext } from 'react';
import { DNDContext } from 'm78/dnd/types';
import { dumpFn } from '@lxjx/utils';

const defaultContext: DNDContext = {
  listeners: [],
  onStart: dumpFn,
  onMove: dumpFn,
  onAccept: dumpFn,
};

const context = createContext<DNDContext>(defaultContext);

context.displayName = 'DND-context';

export { defaultContext };

export default context;
