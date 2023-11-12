import { useEffect, useImperativeHandle } from "react";
import { useDestroy } from "@m78/hooks";
import { _useMethodsAct } from "../injector/methods.act.js";
import { _useStateAct } from "../injector/state.act.js";
import { _usePropsEffect } from "./use-props-effect.js";
import { _injector } from "../table.js";
import { _useEvent } from "./use-event.js";

export function _useLifeCycle() {
  const stateDeps = _injector.useDeps(_useStateAct);
  const methods = _injector.useDeps(_useMethodsAct);
  const props = _injector.useProps();

  const { state, rcPlugins } = stateDeps;

  useEffect(init, []);

  useDestroy(destroy);

  _usePropsEffect(props, (changedProps, needFullReload) => {
    if (changedProps.schema) {
      methods.updateCheckForm();
    }

    methods.updateInstance(changedProps, needFullReload);
  });

  useImperativeHandle(props.instanceRef, () => state.instance, [
    state.instance,
  ]);

  _useEvent();

  rcPlugins.forEach((p) => p.rcRuntime?.());

  /** 初始化 */
  function init() {
    methods.initEmptyNode();
  }

  /** 销毁 */
  function destroy() {
    state.instance.destroy();
  }
}
