import { useEffect } from 'react';
import { syncTouchStatus } from 'm78/table/functions';
import { _Context } from 'm78/table/types';

export function useEffects(ctx: _Context) {
  const { states } = ctx;

  /** 初始计算滚动阴影 */
  useEffect(() => {
    syncTouchStatus(states.state, states.setState, states.scroller.get());
  }, []);
}
