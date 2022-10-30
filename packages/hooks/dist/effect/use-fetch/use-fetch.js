import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
import { __GLOBAL__, dumpFn, isEmpty, isFunction, isObject } from "@m78/utils";
import _debounce from "lodash/debounce";
import _throttle from "lodash/throttle";
import React, { useEffect } from "react";
import { useEffectEqual, useFn, useSelf, useSetState, useStorageState } from "../../";
var GLOBAL = __GLOBAL__;
/** 简单的判断是否为合成事件 */ function isSyntheticEvent(arg) {
    if (!arg) return false;
    return isObject(arg) && "nativeEvent" in arg && "target" in arg && "type" in arg;
}
/**
 * 以hooks的方式来发起数据请求
 * - <Data> 响应值的类型
 * - <Payload> 参数类型
 * @param method - 获取数据的函数, 其必须返回一个Promise对象, useFetch会根据promise的状态决定请求的结果, 如果此项不为函数时不会走请求流程, 表现与options.pass相似, 可以用来实现简短的串联请求
 * @param options - 请求配置
 * */ function useFetch(method) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var getActualPayload = /** 接受可选的新payload，并根据条件返回传递给fetchHandel的参数(使用param或payload) */ function getActualPayload(newPayload) {
        // 包含param配置项，使用当前param更新
        if ("param" in options) {
            return param;
        }
        // 参数为合成事件或未传，视为更新请求，使用当前payload进行更新请求
        if (isSyntheticEvent(newPayload) || newPayload === undefined) {
            return payload;
        }
        // 包含新的payload，更新payload值并使用新的payload更新请求
        setPayload(newPayload); // 同步新的payload
        return newPayload;
    };
    var getResetState = /** 返回一个将互斥的状态还原的对象，并通过键值覆盖设置某个值 */ function getResetState(key, value) {
        var resetState = {
            loading: false,
            error: undefined,
            timeout: false
        };
        if (key) {
            resetState[key] = value;
        }
        return resetState;
    };
    var cancel = /** 取消请求 */ function cancel() {
        self.fetchID = 0; // 超时后阻止后续赋值操作
        self.timeoutTimer && GLOBAL.clearTimeout(self.timeoutTimer);
        setState({
            loading: false
        });
    };
    var self = useSelf({
        /** 请求的唯一标示，在每一次请求开始前更新，并作为请求有效性的凭据 */ fetchID: 0,
        /** 完成请求次数 */ fetchCount: 0,
        /** 超时计时器 */ timeoutTimer: 0,
        /** 保持返回对象引用不变 */ returnValues: {}
    });
    var initData = options.initData, initPayload = options.initPayload, _deps = options.deps, deps = _deps === void 0 ? [] : _deps, param = options.param, _manual = options.manual, manual = _manual === void 0 ? false : _manual, _timeout = options.timeout, timeout = _timeout === void 0 ? 10000 : _timeout, onSuccess = options.onSuccess, onError = options.onError, onFinish = options.onFinish, onTimeout = options.onTimeout, cacheKey = options.cacheKey, _stale = options.stale, stale = _stale === void 0 ? true : _stale, throttleInterval = options.throttleInterval, debounceInterval = options.debounceInterval, tmp = options.pass, aPass = tmp === void 0 ? true : tmp;
    var cacheEnable = !!cacheKey;
    var pass = aPass && isFunction(method);
    var ref = _sliced_to_array(useSetState({
        loading: !manual && pass,
        error: undefined,
        timeout: false
    }), 2), state = ref[0], setState = ref[1];
    // 防止卸载后赋值
    useEffect(function() {
        return function() {
            self.fetchID = 0; // 超时后阻止后续赋值操作
            self.timeoutTimer && GLOBAL.clearTimeout(self.timeoutTimer);
        };
    }, []);
    var ref1 = _sliced_to_array(useStorageState("".concat(cacheKey, "_FETCH_PAYLOAD"), initPayload, {
        disabled: !cacheEnable
    }), 2), payload = ref1[0], setPayload = ref1[1];
    var ref2 = _sliced_to_array(useStorageState("".concat(cacheKey, "_FETCH_DATA"), initData, {
        disabled: !cacheEnable
    }), 2), data = ref2[0], setData = ref2[1];
    var fetchHandel = useFn(function() {
        var __fetchHandel = _async_to_generator(function(args) {
            var isUpdate, cID, cTimeoutTimer, res, err;
            var _arguments = arguments;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        isUpdate = _arguments.length > 1 && _arguments[1] !== void 0 ? _arguments[1] : false;
                        if (!pass) {
                            throw new Error("the request has been ignored");
                        }
                        cID = Math.random();
                        self.fetchID = cID;
                        // 清除上一个计时器
                        self.timeoutTimer && GLOBAL.clearTimeout(self.timeoutTimer);
                        self.timeoutTimer = GLOBAL.setTimeout(function() {
                            cancel();
                            onTimeout === null || onTimeout === void 0 ? void 0 : onTimeout();
                            setState(getResetState("timeout", true));
                        }, timeout);
                        cTimeoutTimer = self.timeoutTimer;
                        // 减少更新次数
                        if (!state.loading) {
                            setState(getResetState("loading", true));
                        }
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            3,
                            4,
                            5
                        ]);
                        return [
                            4,
                            method(args)
                        ];
                    case 2:
                        res = _state.sent();
                        if (cID === self.fetchID) {
                            setData(res);
                            setState(getResetState("loading", false));
                            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(res, isUpdate);
                            return [
                                2,
                                res
                            ];
                        }
                        return [
                            3,
                            5
                        ];
                    case 3:
                        err = _state.sent();
                        if (cID === self.fetchID) {
                            setState(getResetState("error", err));
                            onError === null || onError === void 0 ? void 0 : onError(err);
                            throw err;
                        }
                        return [
                            3,
                            5
                        ];
                    case 4:
                        // 清理当前计时器
                        cTimeoutTimer && GLOBAL.clearTimeout(cTimeoutTimer);
                        if (cID === self.fetchID) {
                            onFinish === null || onFinish === void 0 ? void 0 : onFinish();
                            self.fetchCount++;
                        }
                        return [
                            7
                        ];
                    case 5:
                        return [
                            2
                        ];
                }
            });
        });
        function _fetchHandel(args) {
            return __fetchHandel.apply(this, arguments);
        }
        return _fetchHandel;
    }(), function(fn) {
        if (throttleInterval) {
            return _throttle(fn, throttleInterval);
        }
        if (debounceInterval) {
            return _debounce(fn, debounceInterval);
        }
        return fn;
    });
    /** 手动发起请求 */ var send = useFn(function(newPayload) {
        var isUpdate = isSyntheticEvent(newPayload) || newPayload === undefined;
        return fetchHandel(getActualPayload(newPayload), isUpdate);
    });
    /** 监听param改变并执行缓存更新，发起请求 */ useEffectEqual(function() {
        if (!("param" in options)) return;
        if (self.fetchCount === 0 || manual) return;
        fetchHandel(getActualPayload(), false).catch(dumpFn); // 走到这里说明参数已经改变了
    }, [
        param
    ]);
    /** 一些自动触发请求的操作 */ useEffect(function() {
        if (manual || !pass) return;
        // 初次请求时，如果有数据且禁用了stale，取消请求
        if (!stale && self.fetchCount === 0 && !isEmpty(data)) {
            setState({
                loading: false
            });
            return;
        }
        fetchHandel(getActualPayload(), self.fetchCount !== 0).catch(dumpFn);
    }, [
        pass
    ].concat(_to_consumable_array(deps)));
    return Object.assign(self.returnValues, _object_spread_props(_object_spread({}, state), {
        send: send,
        data: data,
        payload: payload,
        param: param,
        setData: setData,
        cancel: cancel
    }));
}
export { useFetch };
