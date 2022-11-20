import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import { jsx as _jsx } from "react/jsx-runtime";
import React, { useMemo } from "react";
import { useSpring, animated } from "react-spring";
import { useSelf, useMountState, useIsUnmountState } from "@m78/hooks";
export var _TransitionBase = function(props) {
    var _open = props.open, open = _open === void 0 ? true : _open, _appear = props.appear, appear = _appear === void 0 ? true : _appear, _tag = props.tag, tag = _tag === void 0 ? "div" : _tag, springProps = props.springProps, innerRef = props.innerRef, // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mountOnEnter = props.mountOnEnter, // eslint-disable-next-line @typescript-eslint/no-unused-vars
    unmountOnExit = props.unmountOnExit, to = props.to, from = props.from, interpolater = props.interpolater, _changeVisible = props.changeVisible, changeVisible = _changeVisible === void 0 ? true : _changeVisible, children = props.children, passProps = _object_without_properties(props, [
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
    var self = useSelf({
        isFirst: true
    });
    var ref = _sliced_to_array(useMountState(open, props), 2), mount = ref[0], unmount = ref[1];
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
        onRest: function() {
            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                args[_key] = arguments[_key];
            }
            if (springProps === null || springProps === void 0 ? void 0 : springProps.onRest) {
                var _springProps;
                (_springProps = springProps).onRest.apply(_springProps, _to_consumable_array(args));
            }
            if (!open && !isUnmount()) unmount();
        }
    }));
    if (!mount) return null;
    /* 存在插值器则先走插值器 */ var sp = interpolater ? interpolater(styles, open) : styles;
    return /*#__PURE__*/ _jsx(Animated, _object_spread_props(_object_spread({}, passProps), {
        ref: innerRef,
        style: _object_spread_props(_object_spread({}, props.style, sp), {
            visibility: changeVisible ? sp.__progress.to(function(p) {
                return p <= 0 ? "hidden" : "visible";
            }) : undefined,
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
