import { useClickAway, useUpdateEffect } from 'react-use';
import { useEffect } from 'react';
import { usePrev } from '@lxjx/hooks';
import { Share } from './types';
import { useMethods } from './useMethods';

export function useEffects(share: Share, methods: ReturnType<typeof useMethods>) {
  const {
    state,
    show,
    triggerType,
    setShow,
    popperEl,
    mHeight,
    mWidth,
    props,
    mount,
    self,
  } = share;

  const { refresh } = methods;

  /** 点击气泡外位置关闭 */
  useClickAway(popperEl, ({ target: _target }) => {
    if (triggerType.click && show) {
      const { elTarget } = state;
      // 只在点击的不是目标元素时生效
      if (_target && elTarget && elTarget.contains) {
        const isTarget = elTarget.contains(_target as HTMLElement);
        if (!isTarget) {
          setShow(false);
        }
      }
    }
  });

  // 初始化显示
  useEffect(() => {
    show && refresh(false);
  }, [state.elTarget, state.boundTarget]);

  useUpdateEffect(() => {
    console.log(2, mount);
    if (mount && show) {
      self.lastShow = false; // 强制重置
      setTimeout(refresh, 1);
    }
  }, [mount]);

  // 显示状态/尺寸变更，刷新气泡
  useUpdateEffect(() => {
    console.log(1, mount);
    if (!mount) return;
    refresh();
  }, [show]);

  useUpdateEffect(() => {
    show && refresh();
  }, [mWidth, mHeight]);

  // 获取wrapEl
  useEffect(methods.getWrapEl, [state.elTarget, props.wrapEl]);

  // 获取target
  useEffect(methods.getTarget, [props.children, props.target]);
}
