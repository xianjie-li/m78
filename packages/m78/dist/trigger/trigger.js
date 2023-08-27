import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useImperativeHandle, useMemo } from "react";
import { TriggerType } from "./types.js";
import { useFn, useSetState } from "@m78/hooks";
import { createTrigger } from "./index.js";
import { dumpFn, ensureArray } from "@m78/utils";
/** 实例池 */ var instances = {};
var DEFAULT_INSTANCE_KEY = "__default__";
var allType = [
    TriggerType.click,
    TriggerType.active,
    TriggerType.drag,
    TriggerType.focus,
    TriggerType.contextMenu,
    TriggerType.move, 
];
/** 通过hooks便捷的绑定trigger实例, 未识别的props会传递到事件对象的context属性 */ export function _useTrigger(props) {
    var type = props.type, element = props.element, onTrigger = props.onTrigger, active = props.active, innerRef = props.innerRef, _instanceKey = props.instanceKey, instanceKey = _instanceKey === void 0 ? DEFAULT_INSTANCE_KEY : _instanceKey, other = _object_without_properties(props, [
        "type",
        "element",
        "onTrigger",
        "active",
        "innerRef",
        "instanceKey"
    ]);
    var ref = _sliced_to_array(useSetState({
        active: active
    }), 2), meta = ref[0], setMeta = ref[1];
    var ref1 = _sliced_to_array(useSetState({
        instance: null
    }), 2), state = ref1[0], setState = ref1[1];
    // 暴露内部dom
    useImperativeHandle(innerRef, function() {
        return meta.target;
    }, [
        meta.target, 
    ]);
    // 用于快速确认指定事件是否启用
    var typeMap = useMemo(function() {
        var ls = ensureArray(type);
        var obj = {};
        ls.forEach(function(key) {
            obj[key] = true;
        });
        return obj;
    }, [
        type
    ]);
    // 统一事件派发
    var handle = useFn(function(e) {
        if (!typeMap[e.type] || e.target !== meta) return;
        e.data = e.target;
        e.target = e.target.target;
        e.context = other;
        onTrigger === null || onTrigger === void 0 ? void 0 : onTrigger(e);
    });
    // 关联或创建trigger实例
    useEffect(function() {
        var ins = instances[instanceKey] || createTrigger({
            type: allType
        });
        ins.event.on(handle);
        instances[instanceKey] = ins;
        setState({
            instance: ins
        });
        return function() {
            ins.event.off(handle);
        };
    }, []);
    // 添加target到实例
    useEffect(function() {
        if (!meta.target || !state.instance) return;
        state.instance.add(meta);
        return function() {
            state.instance.delete(meta);
        };
    }, [
        meta.target,
        state.instance
    ]);
    // 通过ref测量element实际渲染的dom
    var refCallback = useFn(function(node) {
        if (!node) return;
        if (meta.target !== node.nextSibling) {
            setMeta({
                target: node.nextSibling
            });
        }
        // 从dom中删除测量节点
        if (node && node.parentNode) {
            var parentNode = node.parentNode;
            var back = parentNode.removeChild.bind(parentNode);
            // 直接删除节点会导致react-refresh等刷新节点时报错, 所以需要添加一些补丁代码进行处理, 减少对dom树的破坏
            // 主要是为了使兄弟级的css选择器(~ +等)能保持正常运行
            // parentNode.appendChild(n);
            parentNode.removeChild = function() {
                for(var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++){
                    arg[_key] = arguments[_key];
                }
                try {
                    back.apply(void 0, _to_consumable_array(arg));
                } catch (e) {
                    dumpFn(e);
                }
            };
            parentNode.removeChild(node);
        }
    });
    return {
        node: /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                /*#__PURE__*/ React.isValidElement(element) && /*#__PURE__*/ _jsx("span", {
                    style: {
                        display: "none"
                    },
                    ref: refCallback
                }, String(Math.random())),
                element
            ]
        }),
        el: meta.target || null
    };
}
/** 通过组件便捷的绑定trigger实例, 未识别的props会传递到事件对象的context属性 */ export function _Trigger(props) {
    var trigger = _useTrigger(_object_spread_props(_object_spread({}, props), {
        element: props.children,
        children: undefined
    }));
    return trigger.node;
}
_Trigger.displayName = "Trigger";
