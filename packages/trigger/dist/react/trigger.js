import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useImperativeHandle, useMemo } from "react";
import { useFn, useSelf, useSetState } from "@m78/hooks";
import { trigger } from "../index.js";
import { dumpFn } from "@m78/utils";
/** 通过hooks便捷的绑定trigger实例 */ export function useTrigger(props) {
    var onTrigger = props.onTrigger, element = props.element, children = props.children, innerRef = props.innerRef, options = _object_without_properties(props, [
        "onTrigger",
        "element",
        "children",
        "innerRef"
    ]);
    var _useSetState = _sliced_to_array(useSetState({
        target: null
    }), 2), state = _useSetState[0], setState = _useSetState[1];
    var self = useSelf({
        registered: false
    });
    // 组装进行注册的事件选项
    var option = useMemo(function() {
        return {};
    }, []);
    Object.assign(option, options, {
        handler: onTrigger,
        target: state.target
    });
    // 暴露内部dom到ref
    useImperativeHandle(innerRef, function() {
        return state.target;
    }, [
        state.target
    ]);
    var bind = useFn(function() {
        if (!option.target || self.registered) return;
        self.registered = true;
        trigger.on(option);
    });
    var unbind = useFn(function() {
        self.registered = false;
        trigger.off(option);
    });
    // 通过ref测量element实际渲染的dom
    var refCallback = useFn(function(node) {
        if (!node) return;
        if (state.target !== node.nextSibling) {
            option.target = node.nextSibling || null;
            if (option.target) bind();
            else unbind();
            setState({
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
    function renderNode() {
        var _element = element || children;
        if (!/*#__PURE__*/ React.isValidElement(_element)) return null;
        return /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                /*#__PURE__*/ _jsx("span", {
                    style: {
                        display: "none"
                    },
                    ref: refCallback
                }, String(Math.random())),
                _element
            ]
        });
    }
    return {
        node: renderNode(),
        el: state.target || null
    };
}
/** 通过组件的形式便捷的绑定trigger实例 */ export function Trigger(props) {
    var trigger = useTrigger(props);
    return trigger.node;
}
Trigger.displayName = "Trigger";
