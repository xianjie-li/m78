import React, { RefObject, useEffect, useRef } from 'react';
import { getDocScrollOffset, getRefDomOrDom } from 'm78/util';
import { useScroll, useSetState } from '@lxjx/hooks';
import { checkElementVisible } from '@lxjx/utils';
import Portal from 'm78/portal';
import { ComponentBaseProps } from '../types/types';

/**
 * 才用常规占位节点来获取状态
 * 代理常见的y轴布局属性
 * */

interface PinProps extends ComponentBaseProps {
  /** 指定目标元素，默认为window */
  target?: HTMLElement | RefObject<any>;
  /** 需要滚动固定的内容 */
  children?: React.ReactNode;

  /** 0 | 距离顶部此距离时触发 */
  offsetTop?: number;
  /** 0 | 距离顶部此距离时触发 */
  offsetBottom?: number;
}

interface State {
  // 目标滚动元素
  el?: HTMLElement;
  // 顶部超出
  topOver: boolean;
  // 底部超出
  bottomOver: boolean;
  // 影子节点的y轴位置
  shadowY?: number;
  // 影子节点的高度
  shadowH?: number;
}

/**
 * 指定元素后，在元素滚动范围内生效
 * */

const Pin = ({ target, offsetTop = 0, offsetBottom = 0 }: PinProps) => {
  const [state, setState] = useSetState<State>({
    topOver: false,
    bottomOver: false,
  });

  // pin根元素
  const pinEl = useRef<HTMLDivElement>(null!);
  // 固钉到元素当前位置的隐藏节点
  const shadowEl = useRef<HTMLDivElement>(null!);

  // 初始化shadowEl位置
  useEffect(refreshShadowEl, [state.el]);

  // 初始化 + shadowEl位置改变时更新
  useEffect(scrollHandler, [state.shadowY, state.shadowY]);

  useEffect(() => {
    // setInterval(scrollHandler, 500);
  });

  // 获取dom并设置，初始化位置
  useEffect(() => {
    const dom = getRefDomOrDom(target);

    if (dom) {
      setState({
        el: dom,
      });
    }
  }, [target]);

  useScroll({
    el: state.el,
    throttleTime: 10,
    onScroll: scrollHandler,
  });

  /** 滚动处理 */
  function scrollHandler() {
    if (!shadowEl.current || !state.shadowY || !state.shadowH) return;

    const { top, bottom, ...vvv } = checkElementVisible(shadowEl.current, {
      fullVisible: true,
      wrapEl: state.el,
      offset: {
        top: offsetTop + 1,
        bottom: offsetBottom + 1,
      },
    });

    console.log(top, bottom, vvv, state.el);

    // 还原位置
    if (top && bottom && (state.topOver || state.bottomOver)) {
      // 更新shadowEl位置
      refreshShadowEl();

      setState({
        topOver: false,
        bottomOver: false,
      });
      return;
    }

    // 设置固钉
    if (!top && !state.topOver) {
      setState({
        topOver: true,
        bottomOver: false,
      });
    } else if (!bottom && !state.bottomOver) {
      setState({
        topOver: false,
        bottomOver: true,
      });
    }
  }

  /** 刷新影子节点位置 */
  function refreshShadowEl() {
    const { y } = getDocScrollOffset();

    const { y: oY, height } = pinEl.current.getBoundingClientRect();

    const shadowY = state.el ? pinEl.current.offsetTop : y + oY;

    console.log(shadowY);

    if (shadowY === state.shadowY && height === state.shadowH) return;

    const bound = state.el?.getBoundingClientRect();

    setState({
      shadowY,
      shadowH: height,
    });
  }

  return (
    <>
      <div
        className="m78-pin"
        ref={pinEl}
        style={{
          position: state.topOver || state.bottomOver ? 'fixed' : undefined,
          top: state.topOver ? offsetTop : undefined,
          bottom: state.bottomOver ? offsetBottom : undefined,
        }}
      >
        <button id="eeBtn" style={{ position: 'relative', zIndex: 5000 }}>
          这是一个按钮
        </button>
        <button id="eeBtn2" style={{ position: 'relative', zIndex: 5000 }}>
          这是一个按钮
        </button>
      </div>
      {/* <Portal> */}
      <div
        ref={shadowEl}
        style={{ top: state.shadowY, height: state.shadowH }}
        className="m78-pin_shadow"
      />
      {/* </Portal> */}
    </>
  );
};

export default Pin;
