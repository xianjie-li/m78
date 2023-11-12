import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import { jsx as _jsx } from "react/jsx-runtime";
import { isObject } from "@m78/utils";
import React, { useCallback, useEffect, useMemo } from "react";
import { throwError } from "../common/index.js";
/**
 * 在开发大型组件时, Injector 能帮助你更轻松的拆解和维护组织代码
 *
 * 核心概念:
 * - actuators: 执行器是一个普通的自定义 hooks, 区别是他会返回一个对象, 这个对象称为 deps(依赖), 你可以在组件的其他位置很方便的对其进行访问.
 * - deps: 由 actuators 返回的对象被称为 deps, deps 可以通过 useDeps(Actuator) 在当前组件上下文中访问.
 * - Injector: 挂载根 actuator, 生成渲染组件.
 *
 * @param view - 渲染器, 渲染视图内容, 渲染器是一个特殊的 Actuator, 在其中使用的注入器会被视为根注入器
 * @param config - 其他额外配置
 * */ export function createInjector(view) {
    var config = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    /** 用于根据父子关系关联injector */ var ctx = /*#__PURE__*/ React.createContext({
        isDefault: true
    });
    var injector = {};
    var injectors = implInjectors(ctx);
    var Component = function() {
        var curCtx = React.useContext(ctx);
        // 每次render清理已执行状态
        curCtx.calledActuator = new Map();
        curCtx.callingActuator = new Map();
        // 清理关联项
        useEffect(function() {
            return function() {
                curCtx.store.clear();
                delete curCtx.store;
                delete curCtx.props;
            };
        }, []);
        return view(injector);
    };
    /** 根, 用于挂载 Provider, 标记当前的注入目标 */ var Injector = function(props) {
        var curCtx = useMemo(function() {
            return {
                store: new Map(),
                calledActuator: null,
                callingActuator: null,
                props: {},
                isDefault: false,
                callbacks: new Map()
            };
        }, []);
        curCtx.props = clearOrNew(curCtx.props, config.defaultProps, props);
        return /*#__PURE__*/ _jsx(ctx.Provider, {
            value: curCtx,
            children: /*#__PURE__*/ _jsx(Component, _object_spread({}, curCtx.props))
        });
    };
    if (config.displayName) {
        Component.displayName = config.displayName;
        Injector.displayName = "Injector(".concat(config.displayName, ")");
    }
    return Object.assign(injector, injectors, {
        Component: Injector
    });
}
function implInjectors(ctx) {
    /** 实现 useDeps 和 getDeps */ var implDepsApi = function(c) {
        return function() {
            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                args[_key] = arguments[_key];
            }
            var curCtx = c || React.useContext(ctx);
            if (curCtx.isDefault) {
                throwError(getRuleMsg("useDeps/useAction()"));
            }
            // 处理并获取指定索引项
            var get = function(actuator) {
                if (!c) {
                    runActuator(actuator, curCtx);
                }
                var item = curCtx.store.get(actuator);
                return item;
            };
            if (args.length === 1) {
                return get(args[0]);
            }
            return args.map(function(ac) {
                return get(ac);
            });
        };
    };
    var useProps = function() {
        var curCtx = React.useContext(ctx);
        if (curCtx.isDefault) {
            throwError(getRuleMsg("useProps()"));
        }
        return curCtx.props;
    };
    var useSettle = function(actuator, cb) {
        var curCtx = React.useContext(ctx);
        if (curCtx.isDefault) {
            throwError(getRuleMsg("useSettle()"));
        }
        var list = curCtx.callbacks.get(actuator);
        if (!list) {
            curCtx.callbacks.set(actuator, [
                cb
            ]);
        } else {
            list.push(cb);
        }
        callOrStoreCallback(actuator, curCtx);
    };
    var useProvider = function() {
        var curCtx = React.useContext(ctx);
        if (curCtx.isDefault) {
            throwError(getRuleMsg("useProvider()"));
        }
        return useCallback(function(param) {
            var children = param.children;
            return /*#__PURE__*/ _jsx(ctx.Provider, {
                value: curCtx,
                children: children
            });
        }, [
            curCtx
        ]);
    };
    var useStatic = function(cb) {
        return useMemo(cb, []);
    };
    var useGetter = function() {
        var curCtx = React.useContext(ctx);
        if (curCtx.isDefault) {
            throwError(getRuleMsg("useGetter()"));
        }
        return useMemo(function() {
            return {
                getProps: function() {
                    return curCtx.props;
                },
                getDeps: implDepsApi(curCtx)
            };
        }, [
            curCtx
        ]);
    };
    return {
        useDeps: implDepsApi(),
        useProps: useProps,
        useSettle: useSettle,
        useProvider: useProvider,
        useStatic: useStatic,
        useGetter: useGetter
    };
}
/* # # # # # # # util # # # # # # # */ // 运行单个Actuator
function runActuator(fn, curCtx) {
    var called = curCtx.calledActuator.get(fn);
    // 已执行则跳过
    if (called) return;
    var item = curCtx.store.get(fn);
    // 未执行过, 设为初始值
    if (!item) {
        item = {};
        curCtx.store.set(fn, item);
    }
    curCtx.calledActuator.set(fn, true);
    curCtx.callingActuator.set(fn, true);
    var depObj = clearOrNew(item, fn() || {});
    curCtx.callingActuator.set(fn, false);
    curCtx.store.set(fn, depObj);
    callOrStoreCallback(fn, curCtx);
}
// 若指定actuator已完成, 则立即执行回调, 否则中断等待后续执行
function callOrStoreCallback(actuator, curCtx) {
    var called = curCtx.calledActuator.get(actuator);
    var calling = curCtx.callingActuator.get(actuator);
    if (!called) return;
    if (calling) return;
    var list = curCtx.callbacks.get(actuator);
    if (!(list === null || list === void 0 ? void 0 : list.length)) return;
    var deps = curCtx.store.get(actuator);
    list.forEach(function(cb) {
        cb(deps);
    });
    list.length = 0;
}
function getRuleMsg(name) {
    return "injector: ".concat(name, " can only be used in actuators, and without async and conditional statement");
}
// 清空传入的o并返回或创建一个新的对象, 并将newObj的所有内容合并到返回对象中
function clearOrNew(o) {
    for(var _len = arguments.length, newObj = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        newObj[_key - 1] = arguments[_key];
    }
    var ob;
    if (!o) {
        ob = {};
    } else {
        for(var oKey in o){
            delete o[oKey];
        }
        ob = o;
    }
    if (newObj.length) {
        var _Object;
        (_Object = Object).assign.apply(_Object, [
            ob
        ].concat(_to_consumable_array(newObj.filter(isObject))));
    }
    return ob;
}
