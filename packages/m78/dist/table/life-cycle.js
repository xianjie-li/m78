import { useEffect, useImperativeHandle } from "react";
import { useDestroy } from "@m78/hooks";
import { _useMethodsAct } from "./methods.act.js";
import { _useStateAct } from "./state.act.js";
import { _usePropsEffect } from "./use-props.js";
import { _injector } from "./table.js";
export function _useLifeCycleAct() {
    var init = /** 初始化 */ function init() {
        methods.initEmptyNode();
    };
    var destroy = /** 销毁 */ function destroy() {
        state.instance.destroy();
    };
    var state = _injector.useDeps(_useStateAct).state;
    var methods = _injector.useDeps(_useMethodsAct);
    var props = _injector.useProps();
    useEffect(init, []);
    useDestroy(destroy);
    _usePropsEffect(props, methods.updateInstance);
    useImperativeHandle(props.instanceRef, function() {
        return state.instance;
    }, [
        state.instance, 
    ]);
}
