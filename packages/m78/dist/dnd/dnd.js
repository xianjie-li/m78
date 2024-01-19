import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { jsx as _jsx } from "react/jsx-runtime";
import React, { useContext, useMemo, useRef } from "react";
import { _useMethods } from "./use-methods.js";
import { _useLifeCycle } from "./use-life-cycle.js";
import { _defaultDNDEnableInfos, _defaultDNDStatus, _levelContext, _useGroup } from "./common.js";
import { createRandString } from "@m78/utils";
import { useSelf, useSetState } from "@m78/hooks";
import { useSpring } from "react-spring";
export function _DND(props) {
    var dragNodeRef = useRef();
    var handleRef = useRef();
    var levelContext = useContext(_levelContext);
    var group = _useGroup(props.group);
    var id = useMemo(function() {
        return createRandString(2);
    }, []);
    var mountTime = useMemo(function() {
        return Date.now();
    }, []);
    // 组件所属层
    var level = useMemo(function() {
        return levelContext.isDefault ? levelContext.level : levelContext.level + 1;
    }, [
        levelContext.level,
        levelContext.isDefault
    ]);
    var node = useMemo(function() {
        return {
            data: props.data,
            id: id
        };
    }, [
        props.data
    ]);
    var _useSetState = _sliced_to_array(useSetState({
        status: _defaultDNDStatus,
        enables: _defaultDNDEnableInfos
    }), 2), state = _useSetState[0], setState = _useSetState[1];
    var self = useSelf();
    // 反馈节点动画控制
    var _useSpring = _sliced_to_array(useSpring(function() {
        return {
            x: 0,
            y: 0,
            onChange: function onChange(result) {
                if (!self.feedbackEl) return;
                var _result_value = result.value, x = _result_value.x, y = _result_value.y;
                self.feedbackEl.style.transform = "translate3d(".concat(x, "px, ").concat(y, "px, 0)");
            }
        };
    }), 2), feedbackSpApi = _useSpring[1];
    // 共享状态
    var ctx = {
        dragNodeRef: dragNodeRef,
        handleRef: handleRef,
        group: group,
        id: id,
        node: node,
        state: state,
        setState: setState,
        props: props,
        self: self,
        level: level,
        mountTime: mountTime,
        feedbackSpApi: feedbackSpApi
    };
    var methods = _useMethods(ctx);
    _useLifeCycle(ctx, methods);
    return /*#__PURE__*/ _jsx(_levelContext.Provider, {
        value: {
            isDefault: false,
            level: level
        },
        children: props.children({
            ref: dragNodeRef,
            handleRef: handleRef,
            status: state.status,
            enables: state.enables
        })
    });
}
_DND.displayName = "DND";
