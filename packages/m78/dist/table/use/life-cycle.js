import { useEffect, useImperativeHandle } from "react";
import { useDestroy } from "@m78/hooks";
import { _useMethodsAct } from "../injector/methods.act.js";
import { _useStateAct } from "../injector/state.act.js";
import { _usePropsEffect } from "./use-props-effect.js";
import { _injector } from "../table.js";
import { _useEvent } from "./use-event.js";
export function _useLifeCycle() {
    var init = /** 初始化 */ function init() {
        methods.initEmptyNode();
    };
    var destroy = /** 销毁 */ function destroy() {
        state.instance.destroy();
    };
    var stateDeps = _injector.useDeps(_useStateAct);
    var methods = _injector.useDeps(_useMethodsAct);
    var props = _injector.useProps();
    var state = stateDeps.state, rcPlugins = stateDeps.rcPlugins;
    useEffect(init, []);
    useDestroy(destroy);
    _usePropsEffect(props, function(changedProps, needFullReload) {
        if (changedProps.schema) {
            methods.updateCheckForm();
        }
        methods.updateInstance(changedProps, needFullReload);
    });
    useImperativeHandle(props.instanceRef, function() {
        return state.instance;
    }, [
        state.instance, 
    ]);
    _useEvent();
    rcPlugins.forEach(function(p) {
        var ref;
        return (ref = p.rcRuntime) === null || ref === void 0 ? void 0 : ref.call(p);
    });
}
