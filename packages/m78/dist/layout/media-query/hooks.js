import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { useContext, useEffect } from "react";
import { useFn, useSetState } from "@m78/hooks";
import _debounce from "lodash/debounce.js";
import { _defaultContext, _mediaQueryCtx } from "./context.js";
import { _mediaQueryGetter, _onChangeHandle } from "./common.js";
/**
 * 窗口尺寸改变时通过回调通知传入子项帮助渲染
 * */ export function _useMediaQuery(conf) {
    var type = conf === null || conf === void 0 ? void 0 : conf.listenType;
    var isType = !type || type === "type";
    var _useSetState = _sliced_to_array(useSetState({
        meta: null,
        value: undefined
    }), 2), state = _useSetState[0], setState = _useSetState[1];
    _useMediaQueryListener(function(meta) {
        var _state_meta, _state_meta1;
        var value = undefined;
        if (conf) {
            value = _mediaQueryGetter(meta, conf, undefined, undefined, conf.reverse);
        }
        if (isType) {
            var _state_meta2;
            if (meta.type !== ((_state_meta2 = state.meta) === null || _state_meta2 === void 0 ? void 0 : _state_meta2.type)) setState({
                meta: meta,
                value: value
            });
        } else if (meta.width !== ((_state_meta = state.meta) === null || _state_meta === void 0 ? void 0 : _state_meta.width) || meta.height !== ((_state_meta1 = state.meta) === null || _state_meta1 === void 0 ? void 0 : _state_meta1.height)) {
            setState({
                meta: meta,
                value: value
            });
        }
    }, conf);
    return state;
}
/**
 * 窗口尺寸改变时通过监听器通知
 * */ export function _useMediaQueryListener(onChange, conf) {
    var mqCtx = useContext(_mediaQueryCtx);
    var oc = useFn(onChange, function(fn) {
        var debounceDelay = conf === null || conf === void 0 ? void 0 : conf.debounce;
        if (debounceDelay) {
            return _debounce(fn, debounceDelay);
        }
        return fn;
    });
    useEffect(function() {
        mqCtx.changeListeners.push(oc);
        mqCtx.meta && oc(mqCtx.meta);
        return function() {
            var ind = mqCtx.changeListeners.indexOf(oc);
            if (ind !== -1) {
                mqCtx.changeListeners.splice(ind, 1);
            }
        };
    }, []);
    // 无匹配context的情况下使用window
    useEffect(function() {
        var resizeHandle = function() {
            _defaultContext.onChange({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        // 直接通过onChange派发初始化通知，防止debounce影响
        if (mqCtx.isRoot) {
            onChange(_onChangeHandle({
                width: window.innerWidth,
                height: window.innerHeight
            }, mqCtx, true));
            window.addEventListener("resize", resizeHandle);
        }
        return function() {
            mqCtx.isRoot && window.removeEventListener("resize", resizeHandle);
        };
    }, [
        mqCtx.isRoot
    ]);
}
