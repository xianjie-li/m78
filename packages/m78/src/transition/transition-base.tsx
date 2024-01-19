import React, { useEffect, useMemo, useRef } from "react";
import { useSpring, animated } from "react-spring";
import { useSelf, useMountState, useIsUnmountState } from "@m78/hooks";
import { TransitionBaseProps } from "./types.js";

export const _TransitionBase = (props: TransitionBaseProps) => {
  const {
    open = true,
    appear = true,
    tag = "div",
    springProps,
    innerRef,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mountOnEnter,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    unmountOnExit,
    to,
    from,
    interpolater,
    changeVisible = true,
    children,
    ...passProps
  } = props;

  const backRef = useRef<any>();

  const nodeRef = innerRef || backRef;

  const self = useSelf({
    isFirst: true,
  });

  const [mount, unmount] = useMountState(open, props);
  const isUnmount = useIsUnmountState();

  const Animated = useMemo(() => animated[tag as "div"], []);

  const animate = useMemo(() => {
    const f = self.isFirst;
    self.isFirst = false;

    const _t = { ...to, __progress: 1 };
    const _f = { ...from, __progress: 0 };

    // 初始显示且启用了appear
    if (appear && open && f) {
      return {
        to: _t,
        from: _f,
      };
    }

    return {
      to: open ? _t : _f,
      from: undefined,
    };
  }, [open, to, from]);

  const styles = useSpring({
    ...springProps,
    ...animate,
    onRest(...args: any) {
      if (springProps?.onRest) {
        springProps.onRest(...args);
      }
      if (!open && !isUnmount()) unmount();
    },
    // visibility必须在这里通过指令式的修改, 在jsx中通过style控制会导致children的autoFocus等失效
    onChange({ value }) {
      if (!changeVisible) return;

      if (nodeRef.current) {
        const __progress = value.__progress;

        const nextVis = __progress ? "visible" : "hidden";

        if (nextVis !== nodeRef.current.style.visibility) {
          nodeRef.current.style.visibility = nextVis;
        }
      }
    },
  });

  if (!mount) return null;

  /* 存在插值器则先走插值器 */
  const sp = interpolater ? interpolater(styles, open) : styles;

  return (
    <Animated
      {...passProps}
      ref={nodeRef}
      style={{
        ...props.style,
        ...sp,
        // 动画大部分未出场时阻止事件，防止隐藏出现等场景错误点击
        pointerEvents: sp.__progress.to((p: number) =>
          p <= 0.7 ? "none" : undefined
        ),
      }}
      className={props.className}
    >
      {typeof children === "function" ? children(sp) : children}
    </Animated>
  );
};

_TransitionBase.displayName = "TransitionBase";
