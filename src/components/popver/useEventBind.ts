import { useFn } from '@lxjx/hooks';
import { useEffect } from 'react';
import { Share } from './types';

/** 绑定事件，由于要支持不同的target类型，所以一律使用原生api进行绑定 */
export function useEventBind(share: Share) {
  const { props, setShow, show, self, state, triggerType } = share;
  const { disabled } = props;

  /** 点击 */
  const clickHandle = useFn(() => {
    if (disabled) return;
    setShow(prev => !prev);
  });

  /** 鼠标移入 */
  const mouseEnterHandle = useFn(() => {
    if (disabled) return;
    clearTimeout(self.hideTimer);
    if (show) return;

    // 延迟显示
    self.showTimer = setTimeout(() => {
      setShow(true);
    }, 80); /* TODO: 添加为配置 */
  });

  /** 鼠标移出 */
  const mouseLeaveHandle = useFn(() => {
    if (disabled) return;
    clearTimeout(self.showTimer);
    if (!show) return;

    // 延迟隐藏
    self.hideTimer = setTimeout(() => {
      setShow(false);
    }, 200);
  });

  /** 获得焦点 */
  const focusHandle = useFn(() => {
    if (disabled) return;
    setShow(true);
  });

  /** 失去焦点 */
  const blurHandle = useFn(() => {
    if (disabled) return;
    setShow(false);
  });

  // target变更
  useEffect(() => {
    if (!state.elTarget && !state.boundTarget) return;

    eventBind();
  }, [state.elTarget, state.boundTarget]);

  /** 绑定事件到elTarget */
  function eventBind() {
    if (!state.elTarget) return;

    const el = state.elTarget;

    const clickEnable = triggerType.click;
    const focusEnable = triggerType.focus;
    const hoverEnable = triggerType.hover;

    if (clickEnable) {
      el.addEventListener('click', clickHandle);
    }

    if (hoverEnable) {
      el.addEventListener('mouseenter', mouseEnterHandle);
      el.addEventListener('mouseleave', mouseLeaveHandle);
    }

    if (focusEnable) {
      el.addEventListener('focus', focusHandle);
      el.addEventListener('blur', blurHandle);
    }

    return () => {
      if (clickEnable) {
        el.removeEventListener('click', clickHandle);
      }

      if (hoverEnable) {
        el.removeEventListener('mouseenter', mouseEnterHandle);
        el.removeEventListener('mouseleave', mouseLeaveHandle);
      }

      if (focusEnable) {
        el.removeEventListener('focus', focusHandle);
        el.removeEventListener('blur', blurHandle);
      }
    };
  }

  return {
    mouseEnterHandle,
    mouseLeaveHandle,
  };
}
