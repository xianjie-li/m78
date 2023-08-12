import React from "react";
import { config } from "react-spring";
import {
  TransitionProps,
  _TransitionConfigsType,
  TransitionType,
} from "./types.js";
import { _TransitionBase as TransitionBase } from "./transition-base.js";

/* !这里的类型需要与./type.ts中的TransitionTypes同步 */
const transitionConfigs: _TransitionConfigsType = {
  fade: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { ...config.stiff, clamp: true },
    skipFade: true, // 跳过额外注入的fade动画
  },
  zoom: {
    from: { transform: "scale3d(0.5, 0.5, 0.5)" },
    to: { transform: "scale3d(1, 1, 1)" },
  },
  punch: {
    from: { transform: "scale3d(1.5, 1.5, 1.5)" },
    to: { transform: "scale3d(1, 1, 1)" },
  },
  slideLeft: {
    from: { transform: "translate3d(-100%, 0, 0)" },
    to: { transform: "translate3d(0%, 0, 0)" },
  },
  slideRight: {
    from: { transform: "translate3d(100%, 0, 0)" },
    to: { transform: "translate3d(0%, 0, 0)" },
  },
  slideTop: {
    from: { transform: "translate3d(0, -100%, 0)" },
    to: { transform: "translate3d(0%, 0%, 0)" },
  },
  slideBottom: {
    from: { transform: "translate3d(0, 100%, 0)" },
    to: { transform: "translate3d(0, 0%, 0)" },
  },
  bounce: {
    from: { transform: "scale3d(0, 0, 0)" },
    to: { transform: "scale3d(1, 1, 1)" },
    config: { ...config.wobbly },
  },
  none: {
    from: {},
    to: {},
    config: {
      skipFade: true,
    },
  },
};

export const _Transition = ({
  type,
  alpha = true,
  ...props
}: TransitionProps) => {
  let {
    from,
    to,
    // eslint-disable-next-line prefer-const
    interpolater,
    // eslint-disable-next-line prefer-const
    skipFade,
    // eslint-disable-next-line prefer-const
    config: _config,
  } = transitionConfigs[type];

  /* skipFade用于内部配置, alpha配置给用户对fade进行开关 */
  if (alpha && !skipFade) {
    from = { ...from, ...transitionConfigs.fade.from };
    to = { ...to, ...transitionConfigs.fade.to };
  }

  return (
    /* 原样传入props，config与动画配置中的进行合并 */
    <TransitionBase
      {...props}
      // config={{ ...config, ...props.config }}
      springProps={{
        config: _config,
        immediate: type === TransitionType.none,
        ...props.springProps,
      }}
      from={from}
      to={to}
      interpolater={interpolater}
    />
  );
};

_Transition.displayName = "Transition";
