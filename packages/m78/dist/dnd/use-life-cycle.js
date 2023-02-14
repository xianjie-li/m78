import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import { useDrag } from "@use-gesture/react";
import { _defaultDNDEnableInfos, _defaultDNDStatus, _resetEvent, _updateEvent } from "./common.js";
import { useEffect } from "react";
import { useDestroy } from "@m78/hooks";
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
            var state1 = {
                status: _object_spread({}, _defaultDNDStatus)
            };
            if (!skipEnableReset) {
                state1.enables = _object_spread({}, _defaultDNDEnableInfos);
            }
            setState(state1);
        }
    });
    useDestroy(function() {
        delete ctx.group.dndMap[ctx.id];
    });
}
