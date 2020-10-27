import { getFirstScrollParent, isDom } from '@lxjx/utils';
import { getRefDomOrDom } from 'm78/util';
import { useFn } from '@lxjx/hooks';
import { patchVisible } from './patchVisible';
import { getPopperDirection } from './getPopperDirection';
import { selectDirection } from './selectDirection';
import { isPopperBound } from './utils';
import { Share } from './types';

export function useMethods(share: Share) {
  const { props, setState, targetSelector, state, mount, popperEl, show, self, set } = share;
  const { target } = props;

  /** 获取目标元素 */
  function getTarget() {
    // dom类型的target
    const el = getRefDomOrDom(target);
    if (el) {
      setState({
        elTarget: el,
        boundTarget: undefined,
      });
      return;
    }

    // bound类型的target
    if (isPopperBound(target)) {
      setState({
        elTarget: undefined,
        boundTarget: target,
      });
      return;
    }

    // 根据标记targetSelector查到目标元素
    const queryEl = document.querySelector(`.${targetSelector}`) as HTMLElement;

    if (queryEl) {
      setState({
        elTarget: queryEl,
        boundTarget: undefined,
      });
      return;
    }

    setState({
      elTarget: undefined,
      boundTarget: undefined,
    });
  }

  /** 根据参数获取wrapEl，如果未获取到递归获取父级可滚动元素 */
  function getWrapEl() {
    const el = getRefDomOrDom(props.wrapEl);

    if (isDom(el)) {
      if (el !== state.wrapEl) {
        setState({
          wrapEl: el,
        });
      }
      return;
    }

    if (state.elTarget) {
      const fs = getFirstScrollParent(state.elTarget);
      if (fs && fs !== state.wrapEl) {
        setState({
          wrapEl: fs,
        });
      }
    }
  }

  /**
   * 刷新气泡状态，传入false跳过动画
   * */
  const refresh = useFn((animation = true) => {
    if (!state.elTarget && !state.boundTarget) return;
    if (!mount) return;

    const width = popperEl.current.offsetWidth;
    const height = popperEl.current.offsetHeight;

    // 获取所有方向气泡位置
    const directionBounds = getPopperDirection(
      {
        width,
        height,
      },
      state.elTarget! || state.boundTarget!,
      {
        offset: props.offset,
      },
    );

    // 检测各气泡位置可见性
    const directionInfo = patchVisible(directionBounds, state.wrapEl);

    // 选择一个合适的当前位置
    const selected = selectDirection({
      direction: props.direction,
      prevDirection: state.direction,
      directionInfo,
    });

    if (!selected) {
      self.allHide = true;

      set({
        opacity: 0,
        scale: 0,
        immediate: true,
      });

      return;
    }

    const [direct, directionKey] = selected;

    // 更新方向
    if (directionKey !== state.direction) {
      setState({
        direction: directionKey,
      });
    }

    function toggle(isShow = true) {
      set({
        xy: [direct.left, direct.top],
        opacity: isShow ? 1 : 0,
        scale: isShow ? 1 : 0,
        immediate: self.allHide || !animation,
        reset: false,
      });

      if (self.allHide) {
        self.allHide = false;
      }
    }

    if (show) {
      if (self.lastShow) {
        toggle();
      } else {
        set({
          xy: [direct.left, direct.top],
          opacity: 0,
          scale: 0.7,
          immediate: true,
          reset: false,
          onRest: () => toggle(),
        });
      }
    } else {
      toggle(false);
    }

    self.lastShow = show;
  });

  return {
    getTarget,
    getWrapEl,
    refresh,
  };
}
