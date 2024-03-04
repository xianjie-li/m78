import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { RCTablePlugin } from "../plugin.js";
import React, { useEffect, useState } from "react";
import { _useStateAct } from "../injector/state.act.js";
import { useFn, useSelf } from "@m78/hooks";
import { _injector } from "../table.js";
import { COMMON_NS, i18n, TABLE_NS } from "../../i18n/index.js";
import { getStorage, setStorage } from "@m78/utils";
import { throwError } from "../../common/index.js";
import { TableMutationType } from "../../table-vanilla/plugins/mutation.js";
import { _useMethodsAct } from "../injector/methods.act.js";
import { Button } from "../../button/index.js";
/**
 * 持久化配置上传/下载
 * */ export var _ConfigSyncPlugin = /*#__PURE__*/ function(RCTablePlugin) {
    "use strict";
    _inherits(_ConfigSyncPlugin, RCTablePlugin);
    var _super = _create_super(_ConfigSyncPlugin);
    function _ConfigSyncPlugin() {
        _class_call_check(this, _ConfigSyncPlugin);
        var _this;
        _this = _super.apply(this, arguments);
        /** 当前使用的持久化器 */ _define_property(_assert_this_initialized(_this), "persister", void 0);
        /** 当前使用的配置读取器 */ _define_property(_assert_this_initialized(_this), "reader", void 0);
        _define_property(_assert_this_initialized(_this), "enable", false);
        return _this;
    }
    _create_class(_ConfigSyncPlugin, [
        {
            key: "toolbarTrailingCustomer",
            value: function toolbarTrailingCustomer(nodes) {
                nodes.push(/*#__PURE__*/ _jsx(ConfigSync, {
                    plugin: this
                }));
            }
        },
        {
            // 根据配置控制初始加载状态
            key: "rcStateInitializer",
            value: function rcStateInitializer(state) {
                var props = this.getProps();
                if (props.configCacheKey) {
                    state.initializingTip = i18n.t("setting reading", {
                        ns: [
                            TABLE_NS
                        ]
                    });
                    if ((props.configPersister || props.configReader) && (!props.configPersister || !props.configReader)) {
                        throwError("props.configPersister and props.configReader must be provided at the same time");
                    }
                    this.persister = props.configPersister || storageCache;
                    this.reader = props.configReader || storageReader;
                    this.enable = true;
                } else {
                    state.initializing = false;
                    this.enable = false;
                }
            }
        },
        {
            key: "rcRuntime",
            value: function rcRuntime() {
                var props = _injector.useProps();
                var _injector_useDeps = _injector.useDeps(_useStateAct), state = _injector_useDeps.state, setState = _injector_useDeps.setState;
                var methods = _injector.useDeps(_useMethodsAct);
                var _this = this;
                var loadConfig = useFn(/*#__PURE__*/ _async_to_generator(function() {
                    var config, e, message, retryText;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                if (!props.configCacheKey) return [
                                    2
                                ];
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    3,
                                    ,
                                    4
                                ]);
                                return [
                                    4,
                                    _this.reader(props.configCacheKey, state.instance)
                                ];
                            case 2:
                                config = _state.sent();
                                setState({
                                    initializing: false,
                                    blockError: null,
                                    persistenceConfig: config
                                });
                                methods.updateCheckForm();
                                methods.updateInstance({}, true);
                                return [
                                    3,
                                    4
                                ];
                            case 3:
                                e = _state.sent();
                                console.error(e);
                                message = i18n.t("setting load failed", {
                                    ns: [
                                        TABLE_NS
                                    ]
                                });
                                retryText = i18n.t("retry", {
                                    ns: [
                                        COMMON_NS
                                    ]
                                });
                                setState({
                                    initializing: false,
                                    blockError: /*#__PURE__*/ _jsxs("span", {
                                        children: [
                                            message,
                                            ",",
                                            " ",
                                            /*#__PURE__*/ _jsx(Button, {
                                                text: true,
                                                color: "primary",
                                                className: "bold",
                                                onClick: loadConfig,
                                                children: retryText
                                            })
                                        ]
                                    })
                                });
                                return [
                                    3,
                                    4
                                ];
                            case 4:
                                return [
                                    2
                                ];
                        }
                    });
                }));
                useEffect(function() {
                    loadConfig();
                }, []);
            }
        }
    ]);
    return _ConfigSyncPlugin;
}(RCTablePlugin);
// toolbar上的配置同步提示以及同步上传逻辑
function ConfigSync(param) {
    var plugin = param.plugin;
    var state = _injector.useDeps(_useStateAct).state;
    var configCacheKey = _injector.useProps().configCacheKey;
    var self = useSelf({
        // 延迟同步计时器
        triggerTimer: null,
        // 组件已卸载
        unmounted: false
    });
    var _useState = _sliced_to_array(useState(""), 2), error = _useState[0], setError = _useState[1];
    // 执行同步操作
    var sync = useFn(/*#__PURE__*/ _async_to_generator(function() {
        var e, errText;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (!plugin.enable || !configCacheKey) return [
                        2
                    ];
                    if (error) {
                        setError("");
                    }
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        3,
                        ,
                        4
                    ]);
                    return [
                        4,
                        plugin.persister(configCacheKey, state.instance)
                    ];
                case 2:
                    _state.sent();
                    return [
                        3,
                        4
                    ];
                case 3:
                    e = _state.sent();
                    errText = i18n.t("setting upload failed", {
                        ns: [
                            TABLE_NS
                        ]
                    });
                    // 静默失败
                    !self.unmounted && setError(errText);
                    return [
                        3,
                        4
                    ];
                case 4:
                    return [
                        2
                    ];
            }
        });
    }));
    // 事件绑定/清理
    useEffect(function() {
        window.addEventListener("beforeunload", sync);
        return function() {
            clearTimeout(self.triggerTimer);
            self.unmounted = true;
            sync();
            window.removeEventListener("beforeunload", sync);
        };
    }, []);
    // 配置变更一段时间后进行提交
    state.instance.event.mutation.useEvent(function(e) {
        if (e.type === TableMutationType.config) {
            clearTimeout(self.triggerTimer);
            self.triggerTimer = setTimeout(sync, 10000);
        }
    });
    if (error) {
        return /*#__PURE__*/ _jsx("span", {
            onClick: sync,
            className: "fs-12 mr-12 color-second color-error cus-p",
            title: "error",
            children: error
        });
    }
    return /*#__PURE__*/ _jsx("span", {});
}
function storageCache(key, table) {
    return _storageCache.apply(this, arguments);
}
function _storageCache() {
    _storageCache = // 默认的持久化存储实现
    _async_to_generator(function(key, table) {
        var curConf;
        return _ts_generator(this, function(_state) {
            curConf = table.getPersistenceConfig();
            setStorage(generateKey(key), curConf);
            return [
                2
            ];
        });
    });
    return _storageCache.apply(this, arguments);
}
function storageReader(key) {
    return _storageReader.apply(this, arguments);
}
function _storageReader() {
    _storageReader = // 默认的配置读取实现
    _async_to_generator(function(key) {
        return _ts_generator(this, function(_state) {
            return [
                2,
                getStorage(generateKey(key))
            ];
        });
    });
    return _storageReader.apply(this, arguments);
}
// 根据传入的key生产添加了唯一prefix的key
function generateKey(key) {
    return "m78-table-config:".concat(key).toUpperCase();
}
