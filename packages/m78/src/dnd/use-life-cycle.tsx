import { useDrag } from "@use-gesture/react";
import { _Context } from "./types.js";
import { _UseMethodReturns } from "./use-methods.js";
import {
  _defaultDNDEnableInfos,
  _defaultDNDStatus,
  _draggingEvent,
  _resetEvent,
  _updateEvent,
} from "./common.js";
import { useEffect } from "react";
import { useDestroy } from "@m78/hooks";
import { isTruthyOrZero } from "@m78/utils";

export function _useLifeCycle(ctx: _Context, methods: _UseMethodReturns) {
  const { state, setState, dragNodeRef, handleRef } = ctx;

  /** 绑定drag事件 */
  useDrag(methods.onDrag, {
    target: state.dragEl,
    filterTaps: true,
  });

  /** 同步dragEl */
  useEffect(() => {
    setState({
      dragEl: handleRef.current || dragNodeRef.current,
    });
  }, [dragNodeRef.current, handleRef.current]);

  /** 接收位置/尺寸同步通知 */
  _updateEvent.useEvent((useThrottle, groupId) => {
    if (groupId && groupId !== ctx.props.group) return;

    if (useThrottle) {
      methods.throttleUpdateDNDMeta();
      return;
    }

    return methods.updateDNDMeta();
  });

  /** 监听状态重置 */
  _resetEvent.useEvent((ignoreIds = [], skipEnableReset) => {
    if (ignoreIds.includes(ctx.id)) return;

    // 状态有变时进行更新
    if (!state.status.regular || (!skipEnableReset && !state.enables.enable)) {
      const st: any = {
        status: {
          ..._defaultDNDStatus,
          hasDragging: state.status.hasDragging,
        }, // hasDragging不需要重置, drag结束后会独立清理
      };

      if (!skipEnableReset) {
        st.enables = { ..._defaultDNDEnableInfos };
      }

      setState(st);
    }
  });

  /** 处理draggingListen */
  _draggingEvent.useEvent((id, dragging, groupId) => {
    if (!ctx.props.draggingListen) return;
    if (isTruthyOrZero(groupId) && groupId !== ctx.props.group) return;
    if (id === ctx.id) return;

    setState({
      status: {
        ...state.status,
        hasDragging: dragging,
      },
    });
  });

  useDestroy(() => {
    delete ctx.group.dndMap[ctx.id];
  });
}
