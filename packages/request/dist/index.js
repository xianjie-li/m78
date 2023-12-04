import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
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
            var _$options, _tmp, _tmp1, extra, ctx, _tmp2, format, plugins, existResponse, existError, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, plugin, ref, returns, err;
            // 处理传入的异步操作, 并根据响应执行后续流程
            function handleTask(pm) {
                plugins.forEach(function(plugin) {
                    var ref;
                    (ref = plugin.start) === null || ref === void 0 ? void 0 : ref.call(plugin, pm);
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
                        var ref;
                        (ref = plugin.success) === null || ref === void 0 ? void 0 : ref.call(plugin, res, response);
                    });
                    return res;
                })/* ======== error ======= */ .catch(function(error) {
                    plugins.forEach(function(plugin) {
                        var ref;
                        (ref = plugin.error) === null || ref === void 0 ? void 0 : ref.call(plugin, error);
                    });
                    return Promise.reject(error);
                })/* ======== finish ======= */ .finally(function() {
                    plugins.forEach(function(plugin) {
                        var ref;
                        (ref = plugin.finish) === null || ref === void 0 ? void 0 : ref.call(plugin);
                    });
                });
            }
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _tmp = {};
                        _tmp1 = {};
                        _$options = _defaultsDeep((_tmp.url = url, _tmp.extraOption = {}, _tmp), optionsArg, baseOptions, (_tmp1.method = "GET", _tmp1.headers = {
                            "Content-Type": "application/json;charset=UTF-8"
                        }, _tmp1));
                        extra = _$options.extraOption;
                        _tmp2 = {};
                        ctx = _tmp2;
                        format = extra.format || cOpt.format;
                        plugins = cOpt.plugins.map(function(Plugin) {
                            return new Plugin(ctx, cOpt, _$options, store);
                        });
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
                            (ref = plugin.before) === null || ref === void 0 ? void 0 : ref.call(plugin)
                        ];
                    case 3:
                        returns = _state.sent();
                        if (returns instanceof Response) {
                            existResponse = returns;
                            return [
                                3,
                                5
                            ];
                        }
                        if (returns instanceof ResponseError) {
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
export * from "./plugin";
