import React, { useMemo, useRef } from 'react';
import Portal from 'm78/portal';
import cls from 'classnames';
import { useFormState, useSelf, useSetState } from '@lxjx/hooks';
import { createRandString, decimalPrecision } from '@lxjx/utils';
import { useSpring, animated, to } from 'react-spring';
import { getTriggerType } from 'm78/popper/utils';
import { useMeasure } from 'react-use';
import { useEventBind } from 'm78/popver/useEventBind';
import { useMountExist } from './utils';
import { Share } from './types';
import { buildInComponent } from './builtInComponent';
import { useEffects } from './useEffects';
import { useMethods } from './useMethods';

/**
 * 虚拟位置优化
 * 获取位置、纠正
 * flip
 * 小屏显示问题
 * */

export const defaultProps = {
  offset: 12,
  direction: 'top',
  type: 'tooltip',
  trigger: ['hover'],
  mountOnEnter: true,
  unmountOnExit: false,
  disabled: false,
};

const Popper = (props: Share['props']) => {
  const { children, type, trigger, mountOnEnter, unmountOnExit } = props;

  /** 显示状态 */
  const [show, setShow] = useFormState(props, false, {
    valueKey: 'show',
    defaultValueKey: 'defaultShow',
  });

  /** 控制渲染状态 */
  const [mount] = useMountExist({
    toggle: show,
    mountOnEnter,
    unmountOnExit,
    exitDelay: 600,
  });

  const [state, setState] = useSetState<Share['state']>({
    direction: props.direction,
  });

  const self = useSelf<Share['self']>({
    lastShow: show,
  });

  /** 唯一id */
  const id = useMemo(() => createRandString(1), []);

  /** 启用的事件类型 */
  const triggerType = getTriggerType(trigger);

  /** 气泡包裹元素 */
  const popperEl = useRef<HTMLDivElement>(null!);

  /** 定制组件类型 */
  const Component = props.customer || buildInComponent[type];

  /** 在未传入target时，用于标识出目标所在元素, 使用选择器是为了和props.target用法兼容, 收束差异性 */
  const targetSelector = `m78-popper_${id}`;

  /** 监听内容尺寸变更 */
  const [measureRef, { width: mWidth, height: mHeight }] = useMeasure();

  /** 动画控制 */
  const [spProps, set] = useSpring(() => ({
    xy: [0, 0],
    opacity: 0,
    scale: 0,
    config: { mass: 1, tension: 440, friction: 22 },
  }));

  const share: Share = {
    state,
    self,
    props,
    setShow,
    show,
    triggerType,
    popperEl,
    mWidth,
    mHeight,
    mount,
    setState,
    targetSelector,
    set,
  };

  /* ############ 内部方法 ############ */
  const methods = useMethods(share);

  /**
   * ############## 钩子、监听器 ##############
   * 1. 绑定滚动监听器
   * 2. 点击它处关闭
   * 3. 显示状态、mount、气泡内容改变时刷新气泡状态
   * 4. 初始化显示
   * 5. 获取wrapEl
   * 6. 获取target
   * */
  useEffects(share, methods);

  /* ############ 绑定事件 ############ */
  const handlers = useEventBind(share);

  /** 不为boundTarget类型且传入了children，作为子节点渲染并挂载选择器 */
  function renderChildren() {
    if (!children) return null;
    if (state.boundTarget) return null;

    return React.cloneElement(children, {
      className: cls(children.props.className, targetSelector),
    });
  }

  /** 气泡内容 */
  function renderPopper() {
    return (
      <Portal namespace="popper">
        <animated.div
          className={cls('m78-popper', state.direction && `__${state.direction}`, props.className)}
          /** 为气泡挂载鼠标事件，用于鼠标在target和气泡间移动时不会关闭 */
          onMouseEnter={triggerType.hover ? handlers.mouseEnterHandle : undefined}
          onMouseLeave={triggerType.hover ? handlers.mouseLeaveHandle : undefined}
          ref={popperEl}
          style={{
            ...props.style,
            transform: to([spProps.xy, spProps.scale], ([x, y]: any, sc) => {
              const scale = decimalPrecision(sc as number, 4);

              /* 使用toFixed防止chrome字体模糊 */
              return `translate3d(${decimalPrecision(x)}px, ${decimalPrecision(
                y,
              )}px, 0) scale3d(${scale}, ${scale}, ${scale})`;
            }),
            opacity: spProps.opacity.to(o => o),
            // 隐藏
            visibility: spProps.opacity.to(o => (o < 0.3 ? 'hidden' : undefined!)),
            // 关闭时防止触发事件
            pointerEvents: spProps.opacity.to(o => (o! < 0.7 ? 'none' : undefined!)),
          }}
        >
          <div ref={measureRef}>
            <Component show={show} setShow={setShow} {...props} />
            <span className={cls('m78-popper_arrow', state.direction && `__${state.direction}`)} />
          </div>
        </animated.div>
      </Portal>
    );
  }

  return (
    <>
      {renderChildren()}

      {mount && renderPopper()}
    </>
  );
};

Popper.defaultProps = defaultProps;

export default Popper;
