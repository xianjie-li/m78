import React, { RefObject, useEffect, useRef } from 'react';
import { useFn, useScroll, useSetState, getRefDomOrDom } from '@lxjx/hooks';
import { checkElementVisible, getFirstScrollParent, getStyle } from '@lxjx/utils';
import _debounce from 'lodash/debounce';

import cls from 'classnames';
import { ComponentBaseProps } from '../types/types';

interface PinProps extends ComponentBaseProps {
  /** 指定目标元素，默认为第一个可滚动父元素 */
  target?: HTMLElement | RefObject<any>;
  /** 需要滚动固定的内容 (不能是文本节点、如果包含特殊定位(absolute等), 最好由外层节点控制) */
  children?: React.ReactNode;

  /** 禁用顶部固钉 */
  disableTop?: boolean;
  /** 禁用底部固钉 */
  disableBottom?: boolean;
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
  /**  影子节点的样式 */
  shadowStyle?: React.CSSProperties;
  targetTopOffset: number;
  targetBottomOffset: number;
}

/** 需要为shadowEl代理的样式key */
const proxyKeys = [
  'height',
  'width',
  'position',
  'top',
  'bottom',
  'marginTop',
  'marginBottom',
  'display',
] as const;

/**
 * 指定元素后，在元素滚动范围内生效
 * */

const Pin = ({
  target,
  offsetTop = 0,
  offsetBottom = 0,
  children,
  style,
  className,
  disableBottom,
  disableTop,
}: PinProps) => {
  const [state, setState] = useSetState<State>({
    topOver: false,
    bottomOver: false,
    shadowStyle: {},
    targetTopOffset: 0,
    targetBottomOffset: 0,
  });

  // pin根元素
  const pinEl = useRef<HTMLDivElement>(null!);
  // 固钉到元素当前位置的隐藏节点
  const shadowEl = useRef<HTMLDivElement>(null!);

  /* ########### hook ########### */
  // 刷新shadowEl的样式
  useEffect(refreshShadowState, [state.el, state.topOver, state.bottomOver]);

  // 初始化 + shadowEl位置改变时更新固定状态
  useEffect(scrollHandler, [state.shadowStyle]);

  // 获取dom并设置，初始化位置
  useEffect(() => {
    const dom = getRefDomOrDom(target);

    if (dom) {
      setState({
        el: dom,
      });
      return;
    }

    const fs = getFirstScrollParent(pinEl.current);

    /** 有滚动父节点且不为doc对象和body对象 */
    if (fs && fs !== document.documentElement && fs !== document.body) {
      setState({
        el: fs,
      });
    }
  }, [target]);
  /* ########### hook END ########### */

  // 处理目标滚动容器
  useScroll({
    el: state.el,
    throttleTime: 5,
    onScroll: scrollHandler,
  });

  /* ########### 目标容器不为window时，为window绑定一个600ms的scrollHandler，用于滚动后修正内部容器内的pin ########## */
  const debounceScrollHandler = useFn(
    () => scrollHandler(),
    fn => _debounce(fn, 600),
  );

  useScroll({
    onScroll: () => {
      if (!state.el) return;
      debounceScrollHandler();
    },
  });
  /* ########### END ########### */

  /** 滚动处理 */
  function scrollHandler() {
    if (!shadowEl.current || !pinEl.current) return;

    const isOver = state.bottomOver || state.topOver;

    const targetEl = isOver ? shadowEl.current : pinEl.current;

    const { top: topVis, bottom: bottomVis } = checkElementVisible(targetEl, {
      fullVisible: true,
      wrapEl: state.el,
      offset: {
        top: offsetTop + 1,
        bottom: offsetBottom + 1,
      },
    });

    const top = disableTop ? true : topVis;
    const bottom = disableBottom ? true : bottomVis;

    if (state.el) {
      const { top: tTop, bottom: tBottom } = state.el.getBoundingClientRect();

      const t = tTop;
      const b = window.innerHeight - tBottom;

      if (t !== state.targetTopOffset || b !== state.targetBottomOffset) {
        setState({
          targetBottomOffset: window.innerHeight - tBottom,
          targetTopOffset: tTop,
        });
      }
    }

    // 还原位置
    if (top && bottom && (state.topOver || state.bottomOver)) {
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

  /** 刷新影子节点样式 */
  function refreshShadowState() {
    // 正在固定时不要获取style
    if (state.topOver || state.bottomOver) {
      return;
    }

    const sty = getStyle(pinEl.current);

    // position为fixed时会定位失败
    if (sty.position === 'fixed') {
      return;
    }

    const styleObj: any = {};

    proxyKeys.forEach(key => (styleObj[key] = sty[key]));

    if (styleObj.position === 'fixed') {
      styleObj.position = 'relative';
    }

    setState({
      shadowStyle: styleObj,
    });
  }

  const isPin = state.bottomOver || state.topOver;

  return (
    <>
      <div
        ref={shadowEl}
        style={{
          ...state.shadowStyle,
          display: isPin ? undefined : 'none',
        }}
        className="m78-pin_shadow"
      />
      <div
        className={cls('m78-pin', className, isPin && '__isPin')}
        ref={pinEl}
        style={{
          ...style,
          position: isPin ? 'fixed' : undefined,
          top: state.topOver ? offsetTop + state.targetTopOffset : undefined,
          bottom: state.bottomOver ? offsetBottom + state.targetBottomOffset : undefined,
        }}
      >
        {children}
      </div>
    </>
  );
};

export default Pin;
