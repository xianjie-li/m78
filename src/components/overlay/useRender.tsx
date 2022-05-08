import { Transition, TransitionBase } from 'm78/transition';
import React from 'react';
import clsx from 'clsx';
import { Portal } from 'm78/portal';
import { animated } from 'react-spring';
import { _Context } from 'm78/overlay/types';
import { _Methods } from 'm78/overlay/useMethods';
import { _LifeCycle } from 'm78/overlay/useLifeCycle';
import { isFunction } from '@lxjx/utils';
import { _Arrow as Arrow } from './arrow';
import { getArrowBasePosition, transitionConfig } from './common';
import { _MountTrigger as MountTrigger } from './mountTrigger';
import { MASK_NAMESPACE } from 'm78/common';

const AnimatedArrow = animated(Arrow);

export function _useRender(ctx: _Context, methods: _Methods, lifeCycle: _LifeCycle) {
  const { props, state, arrowSp, show, setShow, containerRef, overlaysMask, trigger, sp } = ctx;

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
        {isFunction(props.content)
          ? props.content({
              props,
              show,
              setShow,
            })
          : props.content}
        <MountTrigger onMount={lifeCycle.onContentMount} onUnmount={lifeCycle.onContentUnmount} />
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

  function render() {
    return (
      <>
        <Portal namespace={props.namespace}>
          <Portal namespace={MASK_NAMESPACE}>{renderMask()}</Portal>
          <animated.div
            ref={containerRef}
            className="m78 m78-overlay_wrap"
            tabIndex={-1}
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

  return render();
}
