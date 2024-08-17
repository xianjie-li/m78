import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import _defaultsDeep from "lodash/defaultsDeep.js";
import { defaultCreateConfig } from "./default.js";
import { CorePlugin } from "./core-plugin.js";
import { ResponseError } from "./response-error.js";
import { isFunction, isTruthyOrZero } from "@m78/utils";
import { Response } from "./response.js";
/**
 * Create request instance
 * <Opt> - Request config type
 * @param options - create options
 * @return - request instance
 * */ export var createRequest = function(options) {
    // 创建时配置
    var cOpt = _object_spread_props(_object_spread({}, defaultCreateConfig, options), {
        plugins: [
            CorePlugin
        ].concat(_to_consumable_array(options.plugins || []))
    });
    var baseOptions = cOpt.baseOptions;
    // 存储在当前request实例中共享的内容
    var store = {};
    var request = function() {
        var _ref = _async_to_generator(function(url, optionsArg) {
            var _$options, extra, ctx, format, plugins, existResponse, existError, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, plugin, _plugin_before, returns, err;
            // 处理传入的异步操作, 并根据响应执行后续流程
            function handleTask(pm) {
                plugins.forEach(function(plugin) {
                    var _plugin_start;
                    (_plugin_start = plugin.start) === null || _plugin_start === void 0 ? void 0 : _plugin_start.call(plugin, pm);
                });
                return pm/* ======== pipe ======= */ .then(function(response) {
                    return plugins.reduce(function(prev, plugin) {
                        if (isFunction(plugin.pipe)) {
                            return plugin.pipe(prev);
                        }
                        return prev;
                    }, response);
                })/* ======== success ======= */ .then(function(response) {
                    var res = response;
                    // 格式化返回
                    if (format) {
                        res = format(response, _$options);
                    }
                    plugins.forEach(function(plugin) {
                        var _plugin_success;
                        (_plugin_success = plugin.success) === null || _plugin_success === void 0 ? void 0 : _plugin_success.call(plugin, res, response);
                    });
                    return res;
                })/* ======== error ======= */ .catch(function(error) {
                    plugins.forEach(function(plugin) {
                        var _plugin_error;
                        (_plugin_error = plugin.error) === null || _plugin_error === void 0 ? void 0 : _plugin_error.call(plugin, error);
                    });
                    return Promise.reject(error);
                })/* ======== finish ======= */ .finally(function() {
                    plugins.forEach(function(plugin) {
                        var _plugin_finish;
                        (_plugin_finish = plugin.finish) === null || _plugin_finish === void 0 ? void 0 : _plugin_finish.call(plugin);
                    });
                });
            }
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        // 请求时配置
                        _$options = _defaultsDeep({
                            url: url,
                            extraOption: {}
                        }, optionsArg, baseOptions, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json;charset=UTF-8"
                            }
                        });
                        // 额外配置
                        extra = _$options.extraOption;
                        ctx = {};
                        format = extra.format || cOpt.format;
                        plugins = cOpt.plugins.map(function(Plugin) {
                            return new Plugin(ctx, cOpt, _$options, store);
                        });
                        // 若存在已有的响应或错误, 跳过请求直接使用对应内容执行后续操作, 用于缓存/批处理等实现
                        existResponse = null;
                        existError = null;
                        _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            6,
                            7,
                            8
                        ]);
                        _iterator = plugins[Symbol.iterator]();
                        _state.label = 2;
                    case 2:
                        if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                            3,
                            5
                        ];
                        plugin = _step.value;
                        return [
                            4,
                            (_plugin_before = plugin.before) === null || _plugin_before === void 0 ? void 0 : _plugin_before.call(plugin)
                        ];
                    case 3:
                        returns = _state.sent();
                        if (_instanceof(returns, Response)) {
                            existResponse = returns;
                            return [
                                3,
                                5
                            ];
                        }
                        if (_instanceof(returns, ResponseError)) {
                            existError = returns;
                            return [
                                3,
                                5
                            ];
                        }
                        if (isTruthyOrZero(returns)) {
                            return [
                                2,
                                returns
                            ];
                        }
                        _state.label = 4;
                    case 4:
                        _iteratorNormalCompletion = true;
                        return [
                            3,
                            2
                        ];
                    case 5:
                        return [
                            3,
                            8
                        ];
                    case 6:
                        err = _state.sent();
                        _didIteratorError = true;
                        _iteratorError = err;
                        return [
                            3,
                            8
                        ];
                    case 7:
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                        return [
                            7
                        ];
                    case 8:
                        if (existResponse) return [
                            2,
                            handleTask(Promise.resolve(existResponse))
                        ];
                        if (existError) return [
                            2,
                            handleTask(Promise.reject(existError))
                        ];
                        return [
                            2,
                            handleTask(cOpt.adapter(_$options))
                        ];
                }
            });
        });
        return function request(url, optionsArg) {
            return _ref.apply(this, arguments);
        };
    }();
    return request;
};
export * from "./plugin.js";
