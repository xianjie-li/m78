import { getFirstScrollParent, isDom } from '@lxjx/utils';
import { getRefDomOrDom } from 'm78/util';
import { useFn } from '@lxjx/hooks';
import { patchVisible } from 'm78/popver/patchVisible';
import { getPopperDirection } from 'm78/popver/getPopperDirection';
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

    console.log('refresh');

    const width = popperEl.current.offsetWidth;
    const height = popperEl.current.offsetHeight;

    const dInfo = patchVisible(
      getPopperDirection(
        {
          width,
          height,
        },
        state.elTarget! || state.boundTarget!,
        {
          offset: props.offset,
        },
      ),
      state.wrapEl,
    );

    const direct = dInfo[state.direction];

    function toggle(isShow = true) {
      set({
        xy: [direct.left, direct.top],
        opacity: isShow ? 1 : 0,
        scale: isShow ? 1 : 0,
        immediate: !animation,
      });
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
