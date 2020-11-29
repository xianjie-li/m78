import React, { useMemo } from 'react';
import { DNDContextProps } from 'm78/dnd/types';
import DNDCtx, { defaultContext } from './context';

const DNDContext: React.FC<DNDContextProps> = ({ children, ...props }) => {
  const listeners = useMemo(() => [], []);

  const combineValue = {
    ...defaultContext,
    listeners,
    ...props,
  };

  return <DNDCtx.Provider value={combineValue}>{children}</DNDCtx.Provider>;
};

export default DNDContext;
