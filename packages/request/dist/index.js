import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
import _defaultsDeep from "lodash/defaultsDeep";
import { defaultCreateConfig } from "./default";
import { CorePlugin } from "./core-plugin";
import { isFunction, isTruthyOrZero } from "@m78/utils";
/**
 * 创建Request实例
 * <Opt> - 创建的request函数的配置参数类型
 * @param options - 配置
 * @return - Request实例
 * */ export var createRequest = function(options) {
    // 创建时配置
    var cOpt = _object_spread_props(_object_spread({}, defaultCreateConfig, options), {
        plugins: [
            CorePlugin
        ].concat(_to_consumable_array(options.plugins || []))
    });
    var baseOptions = cOpt.baseOptions;
    var request = function() {
        var _ref = _async_to_generator(function(url, optionsArg) {
            var _$options, _tmp, _tmp1, extra, ctx, _tmp2, format, plugins, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, plugin, ref, returns;
            return _ts_generator(this, function(_state) {
                _tmp = {};
                _tmp1 = {};
                _$options = _defaultsDeep((_tmp.url = url, _tmp.extraOption = {}, _tmp), optionsArg, baseOptions, (_tmp1.headers = {
                    "Content-Type": "application/json;charset=UTF-8"
                }, _tmp1));
                extra = _$options.extraOption;
                _tmp2 = {};
                ctx = _tmp2;
                format = extra.format || cOpt.format;
                plugins = cOpt.plugins.map(function(Plugin) {
                    return new Plugin(ctx, cOpt, _$options);
                });
                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    /* ======== before ======= */ for(_iterator = plugins[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        plugin = _step.value;
                        ;
                        returns = (ref = plugin.before) === null || ref === void 0 ? void 0 : ref.call(plugin);
                        if (isTruthyOrZero(returns)) {
                            return [
                                2,
                                returns
                            ];
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                return [
                    2,
                    cOpt.adapter(_$options)/* ======== pipe ======= */ .then(function(response) {
                        return plugins.reduce(function(prev, plugin) {
                            if (isFunction(plugin.pipe)) {
                                return plugin.pipe(prev);
                            }
                            return prev;
                        }, response);
                    })/* ======== success ======= */ .then(function(response) {
                        var res = response;
                        // 格式化返回
                        if (format && !extra.plain) {
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
                    })
                ];
            });
        });
        return function request(url, optionsArg) {
            return _ref.apply(this, arguments);
        };
    }();
    return request;
};
export * from "./plugin";
