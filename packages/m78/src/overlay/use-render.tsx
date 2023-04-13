import {
  Transition,
  TransitionBase,
  TransitionType,
} from "../transition/index.js";
import React from "react";
import clsx from "clsx";
import { Portal } from "../portal/index.js";
import { animated } from "react-spring";
import { _OverlayContext } from "./types.js";
import { _Methods } from "./use-methods.js";
import { _LifeCycle } from "./use-life-cycle.js";
import { isFunction } from "@m78/utils";
import { MASK_NAMESPACE } from "../common/index.js";
import { _Arrow as Arrow } from "./arrow.js";
import {
  _getArrowBasePosition,
  dragContext,
  overlayTransitionConfig,
} from "./common.js";
import { _MountTrigger as MountTrigger } from "./mount-trigger.js";

const AnimatedArrow = animated(Arrow);

export function _useRender(
  ctx: _OverlayContext,
  methods: _Methods,
  lifeCycle: _LifeCycle
) {
  const {
    props,
    state,
    arrowSp,
    open,
    containerRef,
    overlaysMask,
    trigger,
    sp,
  } = ctx;

  function renderArrow() {
    if (!methods.isArrowEnable()) return false;

    const [w, h] = props.arrowSize;
    const { rotate, ...pos } = _getArrowBasePosition(
      state.lastDirection!,
      props.arrowSize
    );

    return (
      <AnimatedArrow
        {...props.arrowProps}
        width={w}
        height={h}
        style={{
          ...props.arrowProps?.style,
          ...pos,
          transform: arrowSp.offset.to((o) => {
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
        open: open,
        type: props.transitionType!,
        className: clsx(
          "m78-overlay",
          props.className,
          state.lastDirection && `__${state.lastDirection}`
        ),
        style: props.style,
        mountOnEnter: props.mountOnEnter,
        unmountOnExit: props.unmountOnExit,
        from: transition?.from,
        to: transition?.to,
        springProps: {
          config: overlayTransitionConfig,
          ...props.springProps,
        },
        innerRef: props.innerRef,
        onTouchStart: methods.activeContent,
        onClick: methods.activeContent,
        onMouseEnter: methods.activeContent,
        onMouseLeave: methods.unActiveContent,
      },
      <dragContext.Provider
        value={{
          onDrag: methods.onDragHandle,
          getXY: methods.getDragInitXY,
          getBound: methods.getDragBound,
        }}
      >
        {isFunction(props.content)
          ? props.content(ctx.customRenderMeta)
          : props.content}
        <MountTrigger
          onMount={lifeCycle.onContentMount}
          onUnmount={lifeCycle.onContentUnmount}
        />
        {renderArrow()}
      </dragContext.Provider>
    );
  }

  function renderMask() {
    return (
      <Transition
        {...props.maskProps}
        open={open && overlaysMask.isFirst}
        type={TransitionType.fade}
        className={clsx("m78 m78-mask", props.maskProps?.className)}
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
            tabIndex={-1}
            {...props.extraProps}
            ref={containerRef}
            className={clsx(
              "m78 m78-overlay_wrap",
              props.extraProps?.className
            )}
            style={{
              ...props.extraProps?.style,
              ...sp,
              visibility: open ? "visible" : "hidden",
              zIndex: props.zIndex,
              opacity: sp.isHidden.to((hide) => (hide ? 0 : 1)),
              pointerEvents: sp.isHidden.to((hide) =>
                hide ? "none" : undefined!
              ),
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
