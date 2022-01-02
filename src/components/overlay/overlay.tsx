/**
 * notes:
 * - 位置更新均使用对外暴露的update系列方法
 * - 更新依赖lastXY, lastAlignment, lastTarget, 在执行update前需要主动更新对应值, updateXX系列方法会自动更新这些值, 无序设置
 * - 代码中的简单命名约定 t: 目标节点(即定位目标), c: 内容节点(即overlay容器)
 * */

import React, { useRef } from 'react';
import { useFormState, useMeasure, useSelf, useSetState } from '@lxjx/hooks';
import { Portal } from 'm78/portal';
import { Transition, TransitionBase } from 'm78/transition';
import { animated, useSpring } from 'react-spring';
import clsx from 'clsx';
import { useTrigger } from 'm78/hooks';
import { _useMethods as useMethods } from './useMethods';
import { _useLifeCycle as useLifeCycle } from './useLifeCycle';
import { _MountTrigger as MountTrigger } from './mountTrigger';
import { _Arrow as Arrow } from './arrow';
import { _Context, _MergeDefaultProps, OverlayProps } from './types';
import {
  defaultProps,
  getArrowBasePosition,
  onTrigger,
  transitionConfig,
  useOverlaysClickAway,
  useOverlaysMask,
} from './common';

const AnimatedArrow = animated(Arrow);

/**
 * overlay抽象了所有弹层类组件(modal, drawer, popper等需要的基础能力), 使实现这些组件变得非常的简单
 * */
export function _Overlay(p: OverlayProps) {
  const props = p as _MergeDefaultProps;

  const [show, setShow] = useFormState(props, false, {
    valueKey: 'show',
    defaultValueKey: 'defaultShow',
  });

  /** 容器节点ref */
  const containerRef = useRef<HTMLDivElement>(null!);

  /** 组件状态 */
  const [state, setState] = useSetState<_Context['state']>({
    lastDirection: props.direction,
    scrollParents: [],
  });

  /** 实例对象 */
  const self = useSelf<_Context['self']>({
    lastXY: props.xy,
    lastAlignment: props.alignment,
    lastTarget: props.target,
    activeContent: false,
  });

  /** 内容定位动画 */
  const [sp, spApi] = useSpring(() => {
    return {
      to: {
        x: 0,
        y: 0,
        isHidden: false,
      },
      config: transitionConfig,
    };
  });

  /** arrow定位动画 */
  const [arrowSp, arrowSpApi] = useSpring(() => {
    return {
      to: {
        offset: 30,
      },
    };
  });

  /** 所有启用了mask的overlay */
  const overlaysMask = useOverlaysMask({
    enable: show && props.mask,
  });

  /** 所有启用了clickAwayClosable的overlay */
  const overlaysClickAway = useOverlaysClickAway({
    enable: show && props.clickAwayClosable,
  });

  /** 触发器 */
  const trigger = useTrigger({
    element: props.children,
    type: props.triggerType,
    onTrigger: e => onTrigger(e, setShow, self),
  });

  /** 尺寸变更时修复位置 */
  const [measure] = useMeasure(containerRef, 200);

  const ctx: _Context = {
    show,
    setShow,
    state,
    setState,
    self,
    props,
    containerRef,
    sp,
    spApi,
    arrowSp,
    arrowSpApi,
    trigger,
    overlaysClickAway,
    measure,
  };

  const methods = useMethods(ctx);

  const hooks = useLifeCycle(ctx, methods);

  function renderArrow() {
    if (!methods.isArrowEnable()) return false;

    const [w, h] = props.arrowSize;
    const { rotate, ...pos } = getArrowBasePosition(state.lastDirection!, props.arrowSize);

    return (
      <AnimatedArrow
        {...props.arrowProps}
        width={w}
        height={h}
        style={{
          ...props.arrowProps?.style,
          ...pos,
          transform: arrowSp.offset.to(o => {
            return `rotate(${rotate}deg) translate3d(${o}px, 0, 0)`;
          }),
        }}
      />
    );
  }

  function renderContent() {
    const transition = props.transition;

    const TransitionComponent = transition ? TransitionBase : Transition;

    return React.createElement(
      TransitionComponent as any,
      {
        show,
        type: props.transitionType!,
        className: clsx(
          'm78-overlay',
          state.lastDirection && `__${state.lastDirection}`,
          props.className,
        ),
        mountOnEnter: props.mountOnEnter,
        unmountOnExit: props.unmountOnExit,
        from: transition?.from,
        to: transition?.to,
        springProps: {
          config: transitionConfig,
          ...props.springProps,
        },
        style: props.style,
        innerRef: props.innerRef,
        onTouchStart: methods.activeContent,
        onClick: methods.activeContent,
        onMouseEnter: methods.activeContent,
        onMouseLeave: methods.unActiveContent,
      },
      <>
        {props.content}
        <MountTrigger onMount={hooks.onContentMount} onUnmount={hooks.onContentUnmount} />
        {renderArrow()}
      </>,
    );
  }

  function renderMask() {
    return (
      <Transition
        {...props.maskProps}
        show={show && overlaysMask.isFirst}
        type="fade"
        className={clsx('m78 m78-mask', props.maskProps?.className)}
        mountOnEnter
        unmountOnExit
      />
    );
  }

  return (
    <>
      <Portal namespace={props.namespace}>
        {renderMask()}
        <animated.div
          ref={containerRef}
          className="m78 m78-overlay_wrap"
          style={{
            ...sp,
            visibility: show ? 'visible' : 'hidden',
            zIndex: props.zIndex,
            opacity: sp.isHidden.to(hide => (hide ? 0 : 1)),
            pointerEvents: sp.isHidden.to(hide => (hide ? 'none' : undefined!)),
          }}
        >
          {renderContent()}
        </animated.div>
      </Portal>
      {trigger.node}
    </>
  );
}

_Overlay.defaultProps = defaultProps;
