import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import { useDrag } from "@use-gesture/react";
import { _defaultDNDEnableInfos, _defaultDNDStatus, _draggingEvent, _resetEvent, _updateEvent } from "./common.js";
import { useEffect } from "react";
import { useDestroy } from "@m78/hooks";
import { isTruthyOrZero } from "@m78/utils";
export function _useLifeCycle(ctx, methods) {
    var state = ctx.state, setState = ctx.setState, dragNodeRef = ctx.dragNodeRef, handleRef = ctx.handleRef;
    /** 绑定drag事件 */ useDrag(methods.onDrag, {
        target: state.dragEl,
        filterTaps: true
    });
    /** 同步dragEl */ useEffect(function() {
        setState({
            dragEl: handleRef.current || dragNodeRef.current
        });
    }, [
        dragNodeRef.current,
        handleRef.current
    ]);
    /** 接收位置/尺寸同步通知 */ _updateEvent.useEvent(function(useThrottle, groupId) {
        if (groupId && groupId !== ctx.props.group) return;
        if (useThrottle) {
            methods.throttleUpdateDNDMeta();
            return;
        }
        return methods.updateDNDMeta();
    });
    /** 监听状态重置 */ _resetEvent.useEvent(function() {
        var ignoreIds = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], skipEnableReset = arguments.length > 1 ? arguments[1] : void 0;
        if (ignoreIds.includes(ctx.id)) return;
        // 状态有变时进行更新
        if (!state.status.regular || !skipEnableReset && !state.enables.enable) {
            var st = {
                status: _object_spread_props(_object_spread({}, _defaultDNDStatus), {
                    hasDragging: state.status.hasDragging
                })
            };
            if (!skipEnableReset) {
                st.enables = _object_spread({}, _defaultDNDEnableInfos);
            }
            setState(st);
        }
    });
    /** 处理draggingListen */ _draggingEvent.useEvent(function(id, dragging, groupId) {
        if (!ctx.props.draggingListen) return;
        if (isTruthyOrZero(groupId) && groupId !== ctx.props.group) return;
        if (id === ctx.id) return;
        setState({
            status: _object_spread_props(_object_spread({}, state.status), {
                hasDragging: dragging
            })
        });
    });
    useDestroy(function() {
        delete ctx.group.dndMap[ctx.id];
    });
}
