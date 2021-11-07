import { useEffect } from 'react';
import { Share, TabProps } from './type';
import { useMethods } from './methods';

export function useLifeCycle(
  share: Share,
  methods: ReturnType<typeof useMethods>,
  props: TabProps,
) {
  const { val, scroller, child, setState, index } = share;

  // 更新活动线
  useEffect(() => {
    !props.noActiveLine && methods.refreshItemLine(index);
  }, [val, props.size, props.position, child.length, props.flexible]);

  // 修正滚动位置
  useEffect(() => {
    const sm = scroller.get();

    if (!scroller.ref.current) return;

    const tabs = scroller.ref.current.querySelectorAll<HTMLDivElement>('.m78-tab_tabs-item');

    methods.onScroll(sm);
    methods.refreshScrollFlag(sm, tabs, index);
  }, [val]);

  useEffect(() => {
    if ('ontouchstart' in window) {
      setState({
        hasTouch: true,
      });
    }
  }, []);
}
