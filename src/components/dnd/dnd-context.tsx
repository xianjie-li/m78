import React, { useEffect, useMemo } from 'react';
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

  // 定时清理scrollerList中已被卸载的节点
  useEffect(() => {
    const t = setInterval(() => {
      const newList = scrollerList.filter(item => {
        if (!item) return false;
        if (item.scrollHeight <= item.offsetHeight) {
          return false;
        }
        return true;
      });
      scrollerList.splice(0, scrollerList.length);
      scrollerList.push(...newList);
    }, 1000);

    return () => clearInterval(t);
  }, []);

  return <DNDCtx.Provider value={combineValue}>{children}</DNDCtx.Provider>;
};

export default DNDContext;
