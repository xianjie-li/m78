import _throttle from 'lodash/throttle';
import { useFn } from '@lxjx/hooks';
import { useEffect } from 'react';
import { Share } from './types';
import { useMethods } from './useMethods';

/** 绑定事件，由于要支持不同的target类型，所以一律使用原生api进行绑定 */
export function useEventBind(share: Share, methods: ReturnType<typeof useMethods>) {
  const { props, setShow, show, self, state, triggerType } = share;
  const { disabled } = props;

  /** 点击 */
  const clickHandle = useFn(() => {
    if (disabled) return;
    setShow(prev => !prev);
  });

  /** 副键点击 */
  const subClickHandle = useFn((e: MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    setShow(prev => !prev);
    return false;
  });

  /** 鼠标移入 */
  const mouseEnterHandle = useFn(() => {
    if (disabled) return;
    clearTimeout(self.hideTimer);
    if (show) return;

    // 延迟显示
    self.showTimer = setTimeout(() => {
      setShow(true);
    }, 80);
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

  /** 滚动 */
  const scrollHandle = useFn(
    () => {
      show && methods.refresh();
    },
    fn => _throttle(fn, 60, { trailing: true, leading: false }),
  );

  // target变更， 绑定基础事件
  useEffect(() => {
    if (!state.elTarget && !state.boundTarget) return;

    return eventBind();
  }, [state.elTarget, state.boundTarget]);

  // 绑定滚动事件
  useEffect(() => {
    if (!state.wrapEl) return;

    const el = state.wrapEl;

    // 如果是根元素，将事件绑定到window，如果不是根元素，需要其本身和窗口都包含事件
    const isDoc = el === document.documentElement || el === document.body;

    window.addEventListener('scroll', scrollHandle);

    if (!isDoc) {
      el.addEventListener('scroll', scrollHandle);
    }

    return () => {
      window.removeEventListener('scroll', scrollHandle);

      if (!isDoc) {
        el.removeEventListener('scroll', scrollHandle);
      }
    };
  }, [state.wrapEl]);

  /** 绑定事件到elTarget */
  function eventBind() {
    if (!state.elTarget) return;

    const el = state.elTarget;

    const clickEnable = triggerType.click;
    const focusEnable = triggerType.focus;
    const hoverEnable = triggerType.hover;
    const subClick = triggerType.subClick;

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

    if (subClick) {
      el.addEventListener('contextmenu', subClickHandle);
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

      if (subClick) {
        el.removeEventListener('contextmenu', subClickHandle);
      }
    };
  }

  return {
    mouseEnterHandle,
    mouseLeaveHandle,
  };
}
