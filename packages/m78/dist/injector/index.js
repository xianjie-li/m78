import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import { createRandString, isObject } from "@m78/utils";
import React, { useEffect, useMemo } from "react";
import { throwError } from "../common/index.js";
// 存储所有实例的deps: key = 组件id
var depsMap = new Map();
// 存储所有实例的最新props
var propsMap = new Map();
var state = {
    /** 当前正在运行组件的depsId */ curDepsId: "",
    /** 每次render的唯一id */ renderId: "",
    /** 所有injectCallback */ callbacks: new Map()
};
/**
 * 更好和更轻松的组织和维护你的hooks和其他代码
 *
 * 核心概念:
 * - actuators: 执行器是一个普通的函数, 用于包含和关联一组逻辑或状态, 可以在其中使用 inject(Actuator)注入依赖项.
 * - deps: 由 actuators 返回的对象被称为 deps, deps 可以通过 inject(Actuator) 在不同的 actuators 之间访问.
 * - injector: 管理多个根 actuator, 生成渲染组件.
 *
 * @param view - 渲染器, 渲染视图内容, 在渲染器内注入的 Actuator 为根 Actuator
 * @param config - 其他额外配置
 * */ export function createInjector(view) {
    var config = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var Component = function(props) {
        // 获取当前组件存储map
        var cId = useMemo(function() {
            var map = null;
            var id;
            while(!map){
                id = createRandString();
                if (depsMap.has(id)) continue; // 防止key重复
                map = new Map();
            }
            depsMap.set(id, map);
            return id;
        }, []);
        var renderId = createRandString();
        var combinedProps = clearOrNew(propsMap.get(cId), config.defaultProps, props);
        // 存储props
        propsMap.set(cId, combinedProps);
        // 清理关联项
        useEffect(function() {
            return function() {
                depsMap.delete(cId);
                propsMap.delete(cId);
            };
        }, []);
        // 标记当前组件render开始
        state.curDepsId = cId;
        state.renderId = renderId;
        var el = view(combinedProps);
        // 标记当前组件render结束
        state.curDepsId = "";
        state.renderId = "";
        return el;
    };
    if (config.displayName) {
        Component.displayName = config.displayName;
    }
    return Component;
}
// 运行单个Actuator
function runActuator(fn, deps) {
    var item = deps.get(fn);
    // 已经执行过的静态项跳过
    if (item && fn.static) return;
    // 未执行过, 执行并写入
    if (!item) {
        item = {
            isPending: false,
            renderId: "",
            deps: {}
        };
        deps.set(fn, item);
    }
    // 正在执行或当前render已执行过则跳过
    if (item.isPending || item.renderId === state.renderId) return;
    item.isPending = true;
    var depObj = clearOrNew(item === null || item === void 0 ? void 0 : item.deps, fn() || {});
    item.renderId = state.renderId;
    item.isPending = false;
    item.deps = depObj;
    callOrStoreCallback(fn);
}
// 若指定actuator已完成, 则立即执行回调, 否则将其存储用于后续执行
function callOrStoreCallback(actuator) {
    var deps = depsMap.get(state.curDepsId);
    if (!deps) return;
    var item = deps.get(actuator);
    if (!item || item.isPending) return;
    var list = state.callbacks.get(actuator);
    if (!(list === null || list === void 0 ? void 0 : list.length)) return;
    list.forEach(function(cb) {
        cb(item.deps);
    });
    list.length = 0;
}
/**
 * 获取指定Actuator的deps
 *
 * ### **用法:**
 * ```js
 * // 单个
 * const deps = inject(Actuator);
 *
 * // 多个
 * const [deps1, deps2] = inject(Actuator1, Actuator2);
 * ```
 *
 * ### **限制&规则:**
 * **省心版:**
 *
 * - 总是将注入器放在 actuator 的顶部
 * - 在逆序依赖和静态执行器中, 不要使用解构语法来分解 deps, 而是直接通过 deps 引用访问状态
 *
 * **详细版:**
 *
 * - 基本: 必须在 Actuator 内调用, 不可用于条件分支/异步代码内, 同一个 Actuator 总是返回相同的对象引用, 你可以通过引用访问避免一些闭包或逆序依赖带来的问题
 * - 逆序依赖: 如果一个执行器依赖了在其后才会运行的执行器, 称为逆序依赖, 被依赖项由于尚未执行, `inject()` 仅会返回一个空的对象, 并在完成初始化后对其填充, 你不能在 Actuator 内同步的获取到依赖, 解决方式有:
 *   - 不要同步访问依赖, 而是保有 deps 引用, 如: `const state = inject(useState)`, 然后在后续的任意非同步代码中使用它.
 *   - 使用 `injectCallback(cb)` , 并在其回调中访问已经初始化的 deps
 * - 解构陷阱: 在以下情况中, 如果你通过解构语法来分解 deps, 可能会拿到陈旧的 deps 或根本拿不到, 应通过直接持有 deps 引用来进行访问:
 *   - 在静态执行器中解构 deps, 因为静态执行器只会在初次 render 时执行, 而 deps 会在后续的 render 中更新, 你通过解构拿到的永远是第一次 render 的快照
 *   - 在逆序依赖中解构 deps, 因为 deps 在后续的执行器完成后才会填充, 你通过解构获取的可能是空或者前一次的状态
 * */ export var inject = function() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    var deps = depsMap.get(state.curDepsId);
    if (!state.curDepsId || !deps) {
        throwError(getRuleMsg("inject()"));
    }
    // 处理并获取指定索引项
    var get = function(actuator) {
        var item = deps.get(actuator);
        if (!item) {
            // 不存在Actuators时自动执行
            runActuator(actuator, deps);
        } else if (!actuator.static && !item.isPending && item.renderId !== state.renderId) {
            // 非静态Actuator, 未处于运行状态, 未在当前render执行过, 则执行
            runActuator(actuator, deps);
        }
        item = deps.get(actuator);
        return item === null || item === void 0 ? void 0 : item.deps;
    };
    if (args.length === 1) {
        return get(args[0]);
    }
    return args.map(function(ac) {
        return get(ac);
    });
};
/** 获取组件props */ export var injectProps = function() {
    if (!state.curDepsId) {
        throwError(getRuleMsg("injectProps()"));
    }
    return propsMap.get(state.curDepsId) || {};
};
/** 在指定的actuator每次执行完成后立即进行回调, 可以用来解决逆序依赖的问题 */ export var injectCallback = function(actuator, cb) {
    if (!state.curDepsId) {
        throwError(getRuleMsg("injectCallback()"));
    }
    var list = state.callbacks.get(actuator);
    if (!list) {
        state.callbacks.set(actuator, [
            cb
        ]);
    } else {
        list.push(cb);
    }
    callOrStoreCallback(actuator);
};
/* # # # # # # # util # # # # # # # */ function getRuleMsg(name) {
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
