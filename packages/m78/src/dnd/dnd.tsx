import React, { useContext, useMemo, useRef } from "react";
import { _Context, DNDNode, DNDProps } from "./types.js";
import { _useMethods } from "./use-methods.js";
import { _useLifeCycle } from "./use-life-cycle.js";
import {
  _defaultDNDEnableInfos,
  _defaultDNDStatus,
  _levelContext,
  _useGroup,
} from "./common.js";
import { createRandString } from "@m78/utils";
import { useSelf, useSetState } from "@m78/hooks";
import { useSpring } from "react-spring";

export function _DND<Data = any>(props: DNDProps<Data>) {
  const dragNodeRef = useRef<HTMLElement>();
  const handleRef = useRef<HTMLElement>();

  const levelContext = useContext(_levelContext);

  const group = _useGroup(props.group);

  const id = useMemo(() => createRandString(2), []);

  const mountTime = useMemo(() => Date.now(), []);

  // 组件所属层
  const level = useMemo(() => {
    return levelContext.isDefault ? levelContext.level : levelContext.level + 1;
  }, [levelContext.level, levelContext.isDefault]);

  const node = useMemo<DNDNode>(
    () => ({
      data: props.data,
      id,
    }),
    [props.data]
  );

  const [state, setState] = useSetState<_Context["state"]>({
    status: _defaultDNDStatus,
    enables: _defaultDNDEnableInfos,
  });

  const self = useSelf<_Context["self"]>();

  // 反馈节点动画控制
  const [, feedbackSpApi] = useSpring(() => ({
    x: 0,
    y: 0,
    onChange(result) {
      if (!self.feedbackEl) return;

      const { x, y } = result.value;

      self.feedbackEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    },
  }));

  // 共享状态
  const ctx = {
    dragNodeRef,
    handleRef,
    group,
    id,
    node,
    state,
    setState,
    props,
    self,
    level,
    mountTime,
    feedbackSpApi,
  };

  const methods = _useMethods(ctx);

  _useLifeCycle(ctx, methods);

  return (
    <_levelContext.Provider
      value={{
        isDefault: false,
        level,
      }}
    >
      {props.children({
        ref: dragNodeRef,
        handleRef,
        status: state.status,
        enables: state.enables,
      })}
    </_levelContext.Provider>
  );
}

_DND.displayName = "DND";
