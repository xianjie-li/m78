import React, { useMemo } from 'react';
import { useSpring, animated } from 'react-spring';
import { useSelf, useMountState, useIsUnmountState } from '@lxjx/hooks';
import { TransitionBaseProps } from './types';

export const _TransitionBase = (props: TransitionBaseProps) => {
  const {
    show = true,
    appear = true,
    tag = 'div',
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

  const self = useSelf({
    isFirst: true,
  });

  const [mount, unmount] = useMountState(show, props);
  const isUnmount = useIsUnmountState();

  const Animated = useMemo(() => animated[tag as 'div'], []);

  const animate = useMemo(() => {
    const f = self.isFirst;
    self.isFirst = false;

    const _t = { ...to, __progress: 1 };
    const _f = { ...from, __progress: 0 };

    // 初始显示且启用了appear
    if (appear && show && f) {
      return {
        to: _t,
        from: _f,
      };
    }

    return {
      to: show ? _t : _f,
      from: undefined,
    };
  }, [show, to, from]);

  const styles = useSpring({
    ...springProps,
    ...animate,
    onRest(...args: any) {
      if (springProps?.onRest) {
        springProps.onRest(...args);
      }
      if (!show && !isUnmount()) unmount();
    },
  });

  if (!mount) return null;

  /* 存在插值器则先走插值器 */
  const sp = interpolater ? interpolater(styles, show) : styles;

  return (
    <Animated
      {...passProps}
      ref={innerRef}
      style={{
        ...props.style,
        ...sp,
        visibility: changeVisible
          ? sp.__progress.to((p: number) => (p <= 0 ? 'hidden' : 'visible'))
          : undefined,
        // 动画大部分未出场时阻止事件，防止隐藏出现等场景错误点击
        pointerEvents: sp.__progress.to((p: number) => (p <= 0.7 ? 'none' : undefined)),
      }}
      className={props.className}
    >
      {typeof children === 'function' ? children(sp) : children}
    </Animated>
  );
};

_TransitionBase.displayName = 'TransitionBase';
