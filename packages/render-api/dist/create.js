import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { jsx as _jsx } from "react/jsx-runtime";
import { createElement as _createElement } from "react";
import React, { useEffect, useMemo, useState } from "react";
import { createEvent } from "@m78/hooks";
import { createRandString, getPortalsNode, isFunction, omit } from "@m78/utils";
import ReactDom, { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
// 改动
// - 去掉延迟相关的内容
// - 初次render时使用flushSync进行同步渲染, 未设置挂载点时默认挂载点也需要使用flushSync同步渲染
//
// 概念
// react root render是同步的
// 17/18兼容性处理
// RenderApiInstance.setOption()的有效值
var updateOptionWhiteList = [
    "defaultState",
    "wrap",
    "maxInstance"
];
// RenderApiComponentProps.setState()调用中应排除的值, open/onChange应动态从changeKey获取
var setStateBlackList = [
    "onDispose",
    "onUpdate",
    "instanceRef"
];
/**
 * 接收配置并创建一个api实例
 * - S - 组件能够接收的状态, 对应实现组件的扩展props
 * - I - 组件扩展api
 * @param opt - 创建配置
 * */ function create(opt) {
    var option = _object_spread({}, opt);
    var Component = option.component, _option_namespace = option.namespace, namespace = _option_namespace === void 0 ? "RENDER__BOX" : _option_namespace, _option_openKey = option.openKey, openKey = _option_openKey === void 0 ? "open" : _option_openKey, _option_changeKey = option.changeKey, changeKey = _option_changeKey === void 0 ? "onChange" : _option_changeKey;
    /** 对组件进行强缓存, 只允许在_updateFlag变更时更新 */ var MemoComponent = /*#__PURE__*/ React.memo(Component, function(prev, next) {
        return prev._updateFlag === next._updateFlag;
    });
    /** 实例长度变更 */ var changeEvent = createEvent();
    /** 在内部共享的状态对象 */ var ctx = {
        /** 实例列表 */ list: [],
        /** target是否已渲染, 未渲染时调用render会渲染默认Target */ targetIsRender: false
    };
    function close(id) {
        var current = getItemById(id);
        if (!current) return;
        if (!current.state[openKey]) return;
        setStateByCurrent(current, _define_property({}, openKey, false));
    }
    function open(id) {
        var current = getItemById(id);
        if (!current) return;
        if (current.state[openKey]) return;
        setStateByCurrent(current, _define_property({}, openKey, true));
    }
    function dispose(id) {
        var ind = getIndexById(id);
        if (ind === -1) return;
        ctx.list.splice(ind, 1);
        changeEvent.emit();
    }
    function disposeAll() {
        ctx.list = [];
        changeEvent.emit();
    }
    /** 设置所有实例的开启或关闭状态 */ function setAllOpen(open) {
        ctx.list.forEach(function(item) {
            return setStateByCurrent(item, _define_property({}, openKey, open), false);
        });
        changeEvent.emit();
    }
    /** 设置指定id的实例状态, 不更新状态 */ function setStateById(id, nState) {
        var it = getItemById(id);
        if (!it) return;
        setStateByCurrent(it, nState);
    }
    /**
   * 根据实例信息设置其状态并更新updateFlag, autoUpdate = true时才会触发更新
   * 这是更新组件的唯一途径
   * */ function setStateByCurrent(current, nState) {
        var autoUpdate = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
        var omitKeys = _to_consumable_array(setStateBlackList).concat([
            changeKey
        ]).join(",");
        Object.assign(current.state, omit(nState, omitKeys));
        current.updateFlag += 1;
        autoUpdate && changeEvent.emit();
    }
    /** 获取指定id的实例 */ function getItemById(id) {
        return ctx.list.find(function(item) {
            return item.id === id;
        });
    }
    /** 获取指定id实例所在的索引位置 */ function getIndexById(id) {
        return ctx.list.findIndex(function(item) {
            return item.id === id;
        });
    }
    /** 创建并渲染一个实例 */ function render(state) {
        var id = createRandString();
        if (isFunction(option.omitState)) {
            state = option.omitState(state);
        }
        var instance = {};
        var _obj;
        /** 创建组件state */ var _state = _object_spread_props(_object_spread({}, option.defaultState, state), (_obj = {}, // RenderApiComponentProps
        _define_property(_obj, openKey, true), _define_property(_obj, changeKey, function(cur) {
            setStateById(id, _define_property({}, openKey, cur));
            changeEvent.emit();
        }), // below RenderApiComponentBaseProps
        _define_property(_obj, "onDispose", dispose.bind(null, id)), _define_property(_obj, "onUpdate", setStateById.bind(null, id)), _define_property(_obj, "instanceRef", function(extIns) {
            if (extIns === null) {
                // 清空占用
                for(var instanceKey in instance){
                    delete instance[instanceKey];
                }
            } else {
                Object.assign(instance, extIns);
            }
        }), _obj));
        var instanceBase = {
            close: close.bind(null, id),
            open: open.bind(null, id),
            dispose: dispose.bind(null, id),
            state: _state,
            setState: _state.onUpdate
        };
        Object.assign(instance, instanceBase);
        ctx.list.push({
            id: id,
            state: _state,
            instance: instance,
            updateFlag: 0
        });
        shakeOverInstance();
        if (!ctx.targetIsRender) {
            ctx.targetIsRender = true;
            mountDefaultTarget();
        }
        // 同步渲染, 否则在扩展了实例时不能马上获取到
        flushSync(function() {
            changeEvent.emit();
        });
        return instance;
    }
    // 将超出maxInstance的实例移除, 不会主动触发更新
    function shakeOverInstance() {
        if (option.maxInstance && ctx.list.length > option.maxInstance) {
            ctx.list.splice(0, ctx.list.length - option.maxInstance);
        }
    }
    var setOption = function(_opt) {
        var o = {};
        var keys = Object.keys(_opt);
        // 是否需要更新ui
        var needUpdate = false;
        keys.forEach(function(key) {
            if (updateOptionWhiteList.includes(key)) {
                o[key] = _opt[key];
            }
            if (key === "wrap" || key === "maxInstance") {
                needUpdate = true;
            }
        });
        Object.assign(option, o);
        if (needUpdate) {
            changeEvent.emit();
        }
    };
    function mountDefaultTarget() {
        var container = document.createElement("div");
        container.setAttribute("data-describe", "RENDER-API DEFAULT TARGET");
        document.body.appendChild(container);
        var root = createRoot(container);
        root.render(/*#__PURE__*/ _jsx(RenderTarget, {}));
    }
    /** 挂载点 */ function RenderTarget() {
        useMemo(function() {
            return ctx.targetIsRender = true;
        }, []);
        var _useState = _sliced_to_array(useState(0), 2), update = _useState[1];
        changeEvent.useEvent(function() {
            update(function(p) {
                return p + 1;
            });
        });
        useEffect(function() {
            // 在默认target渲染完成之前可能会有状态变更, 渲染完成后统一更新一次
            update(function(p) {
                return p + 1;
            });
        }, []);
        function renderList() {
            return ctx.list.map(function(param) {
                var id = param.id, instance = param.instance, state = param.state, updateFlag = param.updateFlag;
                return /*#__PURE__*/ _createElement(MemoComponent, _object_spread_props(_object_spread({}, state), {
                    key: id,
                    instance: instance,
                    _updateFlag: updateFlag
                }));
            });
        }
        var Wrap = option.wrap;
        var node = Wrap ? /*#__PURE__*/ _jsx(Wrap, {
            children: renderList()
        }) : renderList();
        return /*#__PURE__*/ ReactDom.createPortal(node, getPortalsNode(namespace, {
            className: "m78-root m78"
        }));
    }
    return {
        RenderTarget: RenderTarget,
        render: render,
        closeAll: function() {
            return setAllOpen(false);
        },
        openAll: function() {
            return setAllOpen(true);
        },
        disposeAll: disposeAll,
        getInstances: function() {
            return ctx.list.map(function(item) {
                return item.instance;
            });
        },
        events: {
            change: changeEvent
        },
        setOption: setOption,
        getOption: function() {
            return _object_spread({}, option);
        }
    };
}
export default create;
