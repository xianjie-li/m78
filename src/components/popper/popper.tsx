import Portal from '@lxjx/fr/lib/portal';
import React, { useEffect, useMemo, useRef } from 'react';
import { useFn, useFormState, useSelf, useSetState } from '@lxjx/hooks';
import { animated, interpolate, useSpring } from 'react-spring';
import cls from 'classnames';
import { useMeasure, useUpdateEffect } from 'react-use';
import _throttle from 'lodash/throttle';
import { createRandString, isNumber } from '@lxjx/utils';
import { getRefDomOrDom, isPopperMetasBound, getTriggerType } from './utils';
import { GetBoundMetasDirectionKeys, getPopperMetas, GetPopperMetasBound } from './getPopperMetas';
import { PopperProps } from './types';
import { buildInComponent } from './builtInComponent';

const Popper: React.FC<PopperProps> = props => {
  const {
    className,
    style,
    children,
    direction = 'top',
    wrapEl,
    offset = 12,
    target,
    trigger = ['hover'],
    mountOnEnter = true,
    unmountOnExit = false,
    disabled = false,
    type = 'tooltip',
  } = props;

  const popperEl = useRef<HTMLDivElement>(null!);

  const Component = buildInComponent[type];

  const id = useMemo(() => createRandString(1), []);
  /** 在未传入target时，用于标识出目标所在元素 */
  const targetSelector = `fr-popper_${id}`;
  /** 获取启用的事件类型 */
  const triggerType = getTriggerType(trigger);

  const [show, setShow] = useFormState(props, false, {
    valueKey: 'show',
    defaultValueKey: 'defaultShow',
  });

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
    /** 目标元素, 通过props.target或children获取 */
    target: undefined as HTMLElement | GetPopperMetasBound | undefined,
    /** 实现延迟隐藏 */
    hideTimer: (undefined as unknown) as number,
    /** 实现延迟渲染 */
    showTimer: (undefined as unknown) as number,
    /** 防止show变更effect和尺寸变更effect重复更新 */
    refreshing: false,
  });

  const [state, setState] = useSetState({
    /** 气泡所在方向 */
    direction: direction as GetBoundMetasDirectionKeys,
    /** 箭头位置 */
    arrowX: 0,
    /** content是否渲染，用于实现mountOnEnter、unmountOnExit */
    contentShow: !mountOnEnter || show,
  });

  // 用于监听尺寸变化并更新气泡位置
  const [ref, { width: mWidth, height: mHeight }] = useMeasure();

  const showBase = show ? 1 : 0;

  const [spProps, set] = useSpring(() => ({
    xy: [0, 0],
    opacity: showBase,
    scale: showBase,
    config: { mass: 1, tension: 340, friction: 22 },
  }));

  /** 根据参数设置self.target的值 */
  useEffect(() => {
    setTarget();
  }, [children, target]);

  /** 保存气泡尺寸，由于有缩放动画，直接获取dom信息会出现偏差 */
  useEffect(() => {
    // if (show) {
    if (!popperEl.current) return;
    self.lastPopperW = popperEl.current.offsetWidth;
    self.lastPopperH = popperEl.current.offsetHeight;
    // }
  });

  const clickHandle = useFn(() => {
    if (disabled) return;
    setShow(prev => !prev);
  });

  const mouseEnterHandle = useFn(() => {
    if (disabled) return;
    clearTimeout(self.hideTimer);
    if (show) return;
    self.showTimer = setTimeout(
      () => {
        setShow(true);
      },
      type === 'tooltip' ? 0 : 80,
    ) as any;
  });

  const mouseLeaveHandle = useFn(() => {
    if (disabled) return;
    clearTimeout(self.showTimer);
    if (!show) return;
    self.hideTimer = setTimeout(() => {
      setShow(false);
    }, 300) as any;
  });

  const focusHandle = useFn(() => {
    if (disabled) return;
    setShow(true);
  });

  const blurHandle = useFn(() => {
    if (disabled) return;
    setShow(false);
  });

  /** 绑定事件 */
  useEffect(() => {
    if (!self.target) return;
    if (isPopperMetasBound(self.target)) return;

    const el = self.target as HTMLElement;
    if (!('addEventListener' in el)) return;

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
  }, [self.target]);

  /**
   * 更新气泡位置、状态、显示等
   * @param fix - 仅对位置进行更新
   * @param skipTransition - 跳过动画
   * @param forceShow - 强制显示, 不管是否可见、show是否为true
   * */
  const refresh = useFn(
    (fix?: boolean, skipTransition?: boolean, forceShow?: boolean) => {
      if (!self.target) return;
      if (!isNumber(self.lastPopperW) || !isNumber(self.lastPopperH)) return;

      if (show && popperEl.current) {
        self.lastPopperW = popperEl.current.offsetWidth;
        self.lastPopperH = popperEl.current.offsetHeight;
      }

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

        if (currentDirection.arrowX !== state.arrowX) {
          setState({
            arrowX: currentDirection.arrowX,
          });
        }

        // 前一次位置与后一次完全相等时跳过
        if (self.lastX === currentDirection.x && self.lastY === currentDirection.y) {
          return;
        }

        // 前后visible状态均为false时跳过
        if (!fix && !self.lastVisible && !visible) {
          self.refreshCount = 0; // 防止初次入场/重入场时气泡不必要的更新动画
          return;
        }

        /**
         * 跳过动画,直接设置为目标状态
         * 1. 由可见状态进入不可见状态
         * */
        if (
          (!fix && self.lastVisible && !visible) ||
          (!self.lastVisible && visible) ||
          skipTransition
        ) {
          self.refreshCount = 0;
        }

        self.lastVisible = visible;
        self.lastX = currentDirection.x;
        self.lastY = currentDirection.y;

        let styleShow = visible && show ? 1 : 0;

        if (forceShow) {
          styleShow = 1;
          self.refreshCount = 0;
        }

        set({
          xy: [currentDirection.x, currentDirection.y],
          opacity: fix ? 0 : styleShow,
          scale: fix ? 0 : styleShow,
          immediate: fix || self.refreshCount === 0,
          // @ts-ignore
          onRest() {
            // 实现unmountOnExit
            if (!fix && !show && state.contentShow && unmountOnExit) {
              setState({
                contentShow: false,
              });
            }
          },
        });

        !fix && self.refreshCount++;
      }
    },
    f => _throttle(f, 100),
  );

  const scrollHandle = useFn(() => {
    refresh();
  });

  /** 初始化定位、默认触发气泡更新方式(wrap滚动触发) */
  useEffect(() => {
    refresh();

    const e = getRefDomOrDom(wrapEl) || window;
    e.addEventListener('scroll', scrollHandle);

    return () => {
      e.addEventListener('scroll', scrollHandle);
    };
  }, [wrapEl]);

  /** show变更处理 */
  useUpdateEffect(() => {
    self.refreshing = true;

    // 实现 mountOnEnter
    if (show && !state.contentShow) {
      setState({
        contentShow: true,
      });
    }

    setTimeout(() => {
      // 为true时需要先更新位置，然后刷新动画, 否则会导致入场动画异常
      show && refresh(true);

      self.lastX = 0;
      self.lastY = 0;
      self.lastVisible = true;

      refresh();

      self.refreshing = false;
    });
  }, [show]);

  // 位置变化时更新位置
  useUpdateEffect(() => {
    if (self.refreshing) return;
    show && refresh();
  }, [mWidth, mHeight]);

  /** 根据props.target获取作为目标的GetPopperMetasBound对象或dom元素 */
  function getTarget() {
    // target能正常取到dom元素
    const el = getRefDomOrDom(target as any);
    if (el) return el;
    // 是GetPopperMetasBound对象
    const bound = isPopperMetasBound(target);
    if (bound) return bound;

    return undefined;
  }

  /** 根据各种环境参数设置self.target的值, 传入参数时直接以参数作为值 */
  function setTarget(currentTarget?: HTMLElement) {
    if (currentTarget) {
      self.target = currentTarget;
      return;
    }

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
  }

  /**
   * children的渲染方式
   * 1. target存在时，不渲染，取target的值
   * 2. children不存在时，不渲染
   * 3. 否则，为其添加一个用于选择器的类名后渲染
   * */
  function renderChildren() {
    if (target) return null;
    if (!children) return null;
    return React.cloneElement(children, {
      className: cls(children.props.className, targetSelector),
    });
  }

  return (
    <>
      {renderChildren()}

      {state.contentShow && (
        <Portal namespace="popper">
          <animated.div
            ref={popperEl}
            style={{
              ...style,
              transform: interpolate(
                [spProps.xy, spProps.scale] as number[],
                ([x, y]: any, sc) =>
                  /* 使用toFixed防止chrome字体模糊 */
                  `translate3d(${x.toFixed(0)}px, ${y.toFixed(
                    0,
                  )}px, 0) scale3d(${sc}, ${sc}, ${sc})`,
              ),
              opacity: spProps.opacity.interpolate(o => o),
            }}
            className={cls('fr-popper', state.direction && `__${state.direction}`, className)}
            onMouseEnter={triggerType.hover ? mouseEnterHandle : undefined}
            onMouseLeave={triggerType.hover ? mouseLeaveHandle : undefined}
          >
            <div ref={ref}>
              <Component show={show} setShow={setShow} {...props} />
              <span
                className={cls('fr-popper_arrow', state.direction && `__${state.direction}`)}
                style={{ left: state.arrowX || undefined }}
              />
            </div>
          </animated.div>
        </Portal>
      )}
    </>
  );
};

export default Popper;
