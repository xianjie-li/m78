import React from 'react';
import { DNDContextProps } from 'm78/dnd/types';
import DNDCtx, { defaultContext } from './context';

const DndContext: React.FC<DNDContextProps> = ({ children, ...props }) => {
  const combineValue = {
    ...defaultContext,
    ...props,
  };

  return <DNDCtx.Provider value={combineValue}>{children}</DNDCtx.Provider>;
};

export default DndContext;
