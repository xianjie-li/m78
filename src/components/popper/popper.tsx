import Portal from '@lxjx/fr/lib/portal';
import React, { useEffect, useMemo, useRef } from 'react';
import { useFn, useSelf, useSetState } from '@lxjx/hooks';
import { animated, config, interpolate, useSpring } from 'react-spring';
import cls from 'classnames';
import { useUpdateEffect } from 'react-use';
import _throttle from 'lodash/throttle';
import { createRandString, isDom, isNumber } from '@lxjx/utils';
import { GetBoundMetasDirectionKeys, getPopperMetas, GetPopperMetasBound } from './getPopperMetas';
import { ComponentBaseProps } from '../types/types';

/**
 * 挂子节点、挂兄弟节点(然后删除?)
 * 要求组件能够接受children并渲染且组件能够正常渲染出能接受相关事件的包裹元素
 * */

interface PopperProps extends ComponentBaseProps {
  /** 直接指定 目标元素/包含目标元素的ref对象/一个表示位置的GetPopperMetasBound对象, 优先级大于children */
  target?: HTMLElement | GetPopperMetasBound | React.MutableRefObject<HTMLElement>;
  /** 气泡方向 */
  direction?: GetBoundMetasDirectionKeys;
  /**
   * 子元素, 作为气泡的定位对象使用, 子元素包含以下限制
   * 1. 只能包含一个直接子节点
   * 2. 该节点能够接受onMouseEnter、onMouseLeave、onFocus、onClick等事件
   * */
  children?: React.ReactElement;
  /** 包裹元素，作为气泡边界的标识，并会在滚动时对气泡进行更新, 默认情况下，边界为窗口，并在window触发滚动时更新气泡 */
  wrapEl?: HTMLElement | React.MutableRefObject<any>;
  /** 12 | 气泡的偏移位置 */
  offset?: number;
}

/** 传入dom时原样返回，传入包含dom对象的ref时返回current，否则返回undefined */
function getRefDomOrDom(
  target?: HTMLElement | React.MutableRefObject<any>,
): HTMLElement | undefined {
  if (!target) return undefined;
  if (isDom(target)) return target;
  if (target && isDom(target.current)) return target.current as HTMLElement;
  return undefined;
}

const Popper: React.FC<PopperProps> = ({
  className,
  style,
  children,
  direction = 'top',
  wrapEl,
  offset = 12,
  target,
}) => {
  const popperEl = useRef<HTMLDivElement>(null!);

  const id = useMemo(() => createRandString(1), []);
  // 在未传入target时，用于标识出目标所在元素
  const targetSelector = `fr-popper_${id}`;

  const self = useSelf({
    // 优化动画
    refreshCount: 0,
    /** 气泡最近一次获取的x轴位置，用于减少更新 */
    lastX: (undefined as unknown) as number,
    /** 气泡最近一次获取的y轴位置，用于减少更新 */
    lastY: (undefined as unknown) as number,
    /** 最近一次的可见状态，用于：优化显示效果、提高性能 */
    lastVisible: true,
    /** 最后获取到的气泡宽度 */
    lastPopperW: 0,
    /** 最后获取到的气泡高度 */
    lastPopperH: 0,
    /** 目标元素 */
    target: undefined as HTMLElement | GetPopperMetasBound | undefined,
  });

  const [state, setState] = useSetState({
    /** 气泡所在方向 */
    direction: direction as GetBoundMetasDirectionKeys,
    /** 是否可见 */
    show: true,
  });

  const showBase = state.show ? 1 : 0;

  const [spProps, set] = useSpring(() => ({
    xy: [0, 0],
    opacity: showBase,
    scale: showBase,
    config: config.stiff,
  }));

  // 根据参数设置self.target的值
  useEffect(() => {
    // props.target能正常取到值
    const _target = getTarget();
    if (_target) {
      self.target = _target;
      return;
    }
    // 根据标记targetSelector查到目标元素
    const queryEl = document.querySelector(`.${targetSelector}`) as HTMLElement;
    if (queryEl) {
      self.target = queryEl;
      return;
    }
    self.target = undefined;
  }, [children, target]);

  /** 保存气泡尺寸，由于有缩放动画，直接获取dom信息会出现偏差 */
  useEffect(() => {
    if (state.show) {
      self.lastPopperW = popperEl.current.offsetWidth;
      self.lastPopperH = popperEl.current.offsetHeight;
    }
  });

  /** 更新气泡位置、状态、显示等 */
  const refresh = useFn(
    () => {
      if (!self.target) return;
      if (!isNumber(self.lastPopperW) || !isNumber(self.lastPopperH)) return;
      console.log(self.target);
      const { currentDirection, currentDirectionKey, visible } = getPopperMetas(
        { width: self.lastPopperW, height: self.lastPopperH },
        self.target,
        {
          offset,
          wrap: getRefDomOrDom(wrapEl),
          direction,
          prevDirection: state.direction,
        },
      );

      if (currentDirection && currentDirectionKey) {
        // 方向与上次不同时更新方向
        if (currentDirectionKey !== state.direction) {
          setState({
            direction: currentDirectionKey,
          });
        }

        // 前一次位置与后一次完全相等时跳过
        if (self.lastX === currentDirection.x && self.lastY === currentDirection.y) {
          return;
        }

        // 前后visible状态均为false时跳过
        if (!self.lastVisible && !visible) {
          self.refreshCount = 0; // 防止初次入场/重入场时气泡不必要的更新动画
          return;
        }

        /**
         * 跳过动画,直接设置为目标状态
         * 1. 由可见状态进入不可见状态
         * */
        // if (self.lastVisible && !visible) {
        //   self.refreshCount = 0;
        // }

        self.lastVisible = visible;
        self.lastX = currentDirection.x;
        self.lastY = currentDirection.y;

        set({
          xy: [currentDirection.x, currentDirection.y],
          opacity: visible && state.show ? 1 : 0,
          scale: visible && state.show ? 1 : 0,
          immediate: self.refreshCount === 0,
        });

        self.refreshCount++;
      }
    },
    f => _throttle(f, 100),
  );

  /** 初始化定位、默认触发气泡更新方式(wrap滚动触发) */
  useEffect(() => {
    refresh();

    const e = getRefDomOrDom(wrapEl) || window;
    e.addEventListener('scroll', refresh);

    return () => {
      e.addEventListener('scroll', refresh);
    };
  }, [wrapEl]);

  /** show变更处理 */
  useUpdateEffect(() => {
    self.lastX = 0;
    self.lastY = 0;
    self.lastVisible = true;
    refresh();
  }, [state.show]);

  /**
   * 根据props.target和children来获取作为目标的GetPopperMetasBound对象或dom元素
   *
   * */
  function getTarget() {
    // if (!target) return undefined;
    // target能正常取到dom元素
    const el = getRefDomOrDom(target as any);
    if (el) return el;
    // 是GetPopperMetasBound对象
    if (
      target &&
      'left' in target &&
      'right' in target &&
      'width' in target &&
      'height' in target
    ) {
      return target as GetPopperMetasBound;
    }
    return undefined;
  }

  function renderChildren() {
    if (target) return null;
    if (!children) return null;
    return React.cloneElement(children, {
      className: cls(children.props.className, targetSelector),
    });
  }

  return (
    <>
      {/* <span */}
      {/*  onClick={() => setState({ show: !state.show })} */}
      {/*  ref={targetEl} */}
      {/* > */}
      {/*  {renderChildren()} */}
      {/* </span> */}
      {renderChildren()}

      <Portal namespace="popper">
        <animated.div
          ref={popperEl}
          style={{
            ...style,
            transform: interpolate(
              [spProps.xy, spProps.scale] as number[],
              ([x, y]: any, sc) => `translate3d(${x}px, ${y}px, 0) scale3d(${sc}, ${sc}, ${sc})`,
            ),
            opacity: spProps.opacity.interpolate(o => o),
          }}
          className={cls('fr-popper', state.direction && `__${state.direction}`, className)}
        >
          <span className={cls('fr-popper_arrow', state.direction && `__${state.direction}`)} />
          <div className="fr-popper_content">
            <div>提示一段提示提示一段提示</div>
          </div>
        </animated.div>
      </Portal>
    </>
  );
};

export default Popper;
