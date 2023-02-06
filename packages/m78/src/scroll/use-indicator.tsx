import React, { useEffect } from "react";
import { _Context } from "./types.js";
import { _UseMethodReturns } from "./use-method.js";
import { If } from "../fork/index.js";

const _useIndicator = (ctx: _Context, methods: _UseMethodReturns) => {
  const { bound, props, state } = ctx;

  /** 滚动指示器初始化&更新 */
  useEffect(() => {
    methods.refreshIndicator();
  }, [bound.width, bound.height]);

  if (!props.scrollIndicator) return;

  return (
    <>
      <If when={state.xMax && !state.touchLeft}>
        <div className="m78-scroll_indicator __start" />
      </If>
      <If when={state.xMax && !state.touchRight}>
        <div className="m78-scroll_indicator" />
      </If>
      <If when={state.yMax && !state.touchTop}>
        <div className="m78-scroll_indicator __start __is-y" />
      </If>
      <If when={state.yMax && !state.touchBottom}>
        <div className="m78-scroll_indicator __is-y" />
      </If>
    </>
  );
};

export default _useIndicator;
