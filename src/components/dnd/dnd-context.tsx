import React, { useEffect, useMemo } from 'react';
import { hasScroll } from '@lxjx/utils';
import { DNDContextProps } from './types';
import DNDCtx, { defaultContext } from './context';

const DNDContext: React.FC<DNDContextProps> = ({ children, ...props }) => {
  const listeners = useMemo(() => [], []);
  const scrollerList = useMemo(() => [], []);

  const combineValue = {
    ...defaultContext,
    listeners,
    scrollerList,
    ...props,
  };

  // 定时清理scrollerList中已被卸载或不可滚动的节点
  useEffect(() => {
    const t = setInterval(() => {
      const newList = scrollerList.filter(el => {
        if (!el) return false;

        const hsc = hasScroll(el);

        return !(!hsc.x && !hsc.y);
      });
      scrollerList.splice(0, scrollerList.length);
      scrollerList.push(...newList);
    }, 8000);

    return () => clearInterval(t);
  }, []);

  return <DNDCtx.Provider value={combineValue}>{children}</DNDCtx.Provider>;
};

export default DNDContext;
