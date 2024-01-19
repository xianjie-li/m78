import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { jsx as _jsx } from "react/jsx-runtime";
import React, { useMemo, useRef } from "react";
import { useSpring, animated } from "react-spring";
import { useSelf, useMountState, useIsUnmountState } from "@m78/hooks";
export var _TransitionBase = function(props) {
    var _props_open = props.open, open = _props_open === void 0 ? true : _props_open, _props_appear = props.appear, appear = _props_appear === void 0 ? true : _props_appear, _props_tag = props.tag, tag = _props_tag === void 0 ? "div" : _props_tag, springProps = props.springProps, innerRef = props.innerRef, // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mountOnEnter = props.mountOnEnter, // eslint-disable-next-line @typescript-eslint/no-unused-vars
    unmountOnExit = props.unmountOnExit, to = props.to, from = props.from, interpolater = props.interpolater, _props_changeVisible = props.changeVisible, changeVisible = _props_changeVisible === void 0 ? true : _props_changeVisible, children = props.children, passProps = _object_without_properties(props, [
        "open",
        "appear",
        "tag",
        "springProps",
        "innerRef",
        "mountOnEnter",
        "unmountOnExit",
        "to",
        "from",
        "interpolater",
        "changeVisible",
        "children"
    ]);
    var backRef = useRef();
    var nodeRef = innerRef || backRef;
    var self = useSelf({
        isFirst: true
    });
    var _useMountState = _sliced_to_array(useMountState(open, props), 2), mount = _useMountState[0], unmount = _useMountState[1];
    var isUnmount = useIsUnmountState();
    var Animated = useMemo(function() {
        return animated[tag];
    }, []);
    var animate = useMemo(function() {
        var f = self.isFirst;
        self.isFirst = false;
        var _t = _object_spread_props(_object_spread({}, to), {
            __progress: 1
        });
        var _f = _object_spread_props(_object_spread({}, from), {
            __progress: 0
        });
        // 初始显示且启用了appear
        if (appear && open && f) {
            return {
                to: _t,
                from: _f
            };
        }
        return {
            to: open ? _t : _f,
            from: undefined
        };
    }, [
        open,
        to,
        from
    ]);
    var styles = useSpring(_object_spread_props(_object_spread({}, springProps, animate), {
        onRest: function onRest() {
            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                args[_key] = arguments[_key];
            }
            if (springProps === null || springProps === void 0 ? void 0 : springProps.onRest) {
                var _springProps;
                (_springProps = springProps).onRest.apply(_springProps, _to_consumable_array(args));
            }
            if (!open && !isUnmount()) unmount();
        },
        // visibility必须在这里通过指令式的修改, 在jsx中通过style控制会导致children的autoFocus等失效
        onChange: function onChange(param) {
            var value = param.value;
            if (!changeVisible) return;
            if (nodeRef.current) {
                var __progress = value.__progress;
                var nextVis = __progress ? "visible" : "hidden";
                if (nextVis !== nodeRef.current.style.visibility) {
                    nodeRef.current.style.visibility = nextVis;
                }
            }
        }
    }));
    if (!mount) return null;
    /* 存在插值器则先走插值器 */ var sp = interpolater ? interpolater(styles, open) : styles;
    return /*#__PURE__*/ _jsx(Animated, _object_spread_props(_object_spread({}, passProps), {
        ref: nodeRef,
        style: _object_spread_props(_object_spread({}, props.style, sp), {
            // 动画大部分未出场时阻止事件，防止隐藏出现等场景错误点击
            pointerEvents: sp.__progress.to(function(p) {
                return p <= 0.7 ? "none" : undefined;
            })
        }),
        className: props.className,
        children: typeof children === "function" ? children(sp) : children
    }));
};
_TransitionBase.displayName = "TransitionBase";
