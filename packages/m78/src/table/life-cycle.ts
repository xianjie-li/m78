import { useEffect, useImperativeHandle } from "react";
import { useDestroy } from "@m78/hooks";
import { _useMethodsAct } from "./methods.act.js";
import { _useStateAct } from "./state.act.js";
import { _usePropsEffect } from "./use-props.js";
import { _injector } from "./table.js";

export function _useLifeCycleAct() {
  const { state } = _injector.useDeps(_useStateAct);
  const methods = _injector.useDeps(_useMethodsAct);
  const props = _injector.useProps();

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

  /** 初始化 */
  function init() {
    methods.initEmptyNode();
  }

  /** 销毁 */
  function destroy() {
    state.instance.destroy();
  }
}
