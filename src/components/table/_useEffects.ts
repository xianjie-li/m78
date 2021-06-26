import { useEffect } from 'react';
import { syncTouchStatus } from './_functions';
import { _Context } from './_types';

export function useEffects(ctx: _Context) {
  const { states } = ctx;

  /** 初始计算滚动阴影 */
  useEffect(() => {
    syncTouchStatus(states.state, states.setState, states.scroller.get());
  }, []);
}
