import React, { useImperativeHandle, useRef } from "react";
import {
  _RCTableContext,
  _RCTableSelf,
  _RCTableState,
  RCTableProps,
} from "./types.js";
import { _usePropsEffect } from "./use-props.js";
import clsx from "clsx";
import { Scroll } from "../scroll/index.js";
import { useSelf, useSetState } from "@m78/hooks";
import { _useMethods } from "./methods.js";
import { _useLife } from "./life.js";
import ReactDom from "react-dom";
import { Result } from "../result/index.js";
import { IconDrafts } from "@m78/icons/icon-drafts.js";
import { Size } from "../common/index.js";
import { _CustomRender, _useCustomRender } from "./use-custom-render.js";
import { _useEvent } from "./use-event.js";
import { _Toolbar } from "./toolbar/toolbar.js";
import { _CustomEditRender, _useEditRender } from "./use-edit-render.js";
import { _Feedback } from "./feedback.js";

// - render改写, column改写,
// 编辑集成  editSchema  editRender
// - 剔除部分配置 interactive等
// - dom接口转为reactElement接口, empty
// - 实例api改写, event
// - 事件代理到onXXX
// - 在表头右侧渲染额外节点
// 筛选 包含筛选条件时显示为蓝色
// 排序 支持单列/多列
// toolbar

export function _Table(props: RCTableProps) {
  /** 实例容器 */
  const ref = useRef<HTMLDivElement>(null!);
  /** 滚动容器 */
  const scrollRef = useRef<HTMLDivElement>(null!);
  /** 滚动内容 */
  const scrollContRef = useRef<HTMLDivElement>(null!);

  const self = useSelf<_RCTableSelf>({
    renderMap: {},
    editMap: {},
  });

  const [state, setState] = useSetState<_RCTableState>({
    selectedRows: [],
    rowCount: 0,
    instance: null as any,
  });

  const ctx = {
    props,
    self,
    state,
    setState,
    ref,
    scrollRef,
    scrollContRef,
  } as _RCTableContext;

  ctx.editRender = _useEditRender(ctx);
  ctx.customRender = _useCustomRender(ctx);

  const methods = _useMethods(ctx);

  _useLife(ctx, methods);

  _usePropsEffect(props, methods.updateInstance);

  _useEvent(ctx);

  useImperativeHandle(props.instanceRef, () => state.instance, [
    state.instance,
  ]);

  return (
    <div
      className={clsx("m78-table_wrap", props.wrapClassName)}
      style={props.wrapStyle}
    >
      {state.instance && (
        <>
          <_Toolbar ctx={ctx} />

          {state.emptyNode &&
            ReactDom.createPortal(
              props.emptyNode || (
                <Result
                  size={Size.small}
                  icon={<IconDrafts className="color-disabled" />}
                  title="No data" // TODO: i18
                />
              ),
              state.emptyNode
            )}

          <_CustomRender ctx={ctx} />
          <_CustomEditRender ctx={ctx} />
          <_Feedback ctx={ctx} />
        </>
      )}

      <div
        style={props.style}
        className={clsx("m78-table", props.className)}
        ref={ref}
      >
        <Scroll
          className="m78-table_view m78-table_expand-size"
          direction="xy"
          disabledScroll
          innerWrapRef={scrollRef}
          miniBar
          scrollIndicator={false}
        >
          <div ref={scrollContRef} />
        </Scroll>
      </div>
    </div>
  );
}

_Table.displayName = "Table";
