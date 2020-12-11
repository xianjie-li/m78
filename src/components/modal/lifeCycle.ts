import { useLockBodyScroll } from '@lxjx/hooks';
import { useClickAway, useUpdateEffect } from 'react-use';
import { useEffect } from 'react';
import _debounce from 'lodash/debounce';
import { useMethods } from './methods';
import { Share } from './types';

export function useLifeCycle(share: Share, methods: ReturnType<typeof useMethods>) {
  const { props, modalSize } = share;

  const { onRemove, onRemoveDelay = 800 } = props;

  const [width, height] = modalSize;

  // 滚动锁定
  const lock = useLockBodyScroll(share.lockScroll && share.show);

  // 无遮罩时，通过ClickAway来触发关闭，需要延迟一定的时间，因为用户设置的Modal开关可能会与ClickAway区域重叠
  useClickAway(share.contRef, () => {
    if (!share.show) return;

    if (
      // 可点击关闭 + 无mask
      (share.clickAwayClosable && !share.mask) ||
      // 应触发点击关闭 + mask未显示
      (share.refState.shouldTriggerClose && !share.refState.maskShouldShow)
    ) {
      setTimeout(methods.close, 150);
    }
  });

  // 用于搭配renderApi使用，在隐藏时通知renderApi进行实例移除
  useUpdateEffect(() => {
    if (!share.show) {
      // if (onClose) {
      //   onClose();
      // }

      if (onRemove) {
        setTimeout(onRemove, onRemoveDelay);
      }
    }
  }, [share.show]);

  // 容器尺寸改变时，更新Modal位置
  useEffect(() => {
    methods.calcPos();
  }, [width, height]);

  // 屏幕尺寸改变时，更新Modal位置
  useEffect(() => {
    const handler = _debounce(() => {
      methods.calcPos();
    }, 500);

    window.addEventListener('resize', handler);

    return () => window.removeEventListener('resize', handler);
  }, []);
}
