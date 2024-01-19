import { useEffect, useImperativeHandle } from "react";
import { useDestroy } from "@m78/hooks";
import { _useMethodsAct } from "../injector/methods.act.js";
import { _useStateAct } from "../injector/state.act.js";
import { _usePropsEffect } from "./use-props-effect.js";
import { _injector } from "../table.js";
import { _useEvent } from "./use-event.js";
export function _useLifeCycle() {
    var stateDeps = _injector.useDeps(_useStateAct);
    var methods = _injector.useDeps(_useMethodsAct);
    var props = _injector.useProps();
    var state = stateDeps.state, rcPlugins = stateDeps.rcPlugins;
    useEffect(init, []);
    useDestroy(destroy);
    _usePropsEffect(props, function(changedProps, needFullReload) {
        if (state.initializing || state.blockError) return;
        if (changedProps.schema) {
            methods.updateCheckForm();
        }
        methods.updateInstance(changedProps, needFullReload);
    });
    useImperativeHandle(props.instanceRef, function() {
        return state.instance;
    }, [
        state.instance
    ]);
    _useEvent();
    rcPlugins.forEach(function(p) {
        var _p_rcRuntime;
        return (_p_rcRuntime = p.rcRuntime) === null || _p_rcRuntime === void 0 ? void 0 : _p_rcRuntime.call(p);
    });
    /** 初始化 */ function init() {
        methods.initEmptyNode();
    }
    /** 销毁 */ function destroy() {
        if (!state.instance) return;
        state.instance.destroy();
        rcPlugins.forEach(function(p) {
            var _p_rcInit;
            return (_p_rcInit = p.rcInit) === null || _p_rcInit === void 0 ? void 0 : _p_rcInit.call(p);
        });
    }
}
