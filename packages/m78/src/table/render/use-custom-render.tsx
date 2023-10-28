import React, { useEffect } from "react";
import {
  _CustomRenderItem,
  _RCTableState,
  RCTableInstance,
  RCTableProps,
  RCTableRenderArg,
} from "../types.js";
import {
  TableCell,
  TableCellWithDom,
  TableRenderCtx,
} from "../../table-vanilla/index.js";
import { isTruthyOrZero } from "@m78/utils";
import { useFn } from "@m78/hooks";

import ReactDom from "react-dom";
import { _useStateAct } from "../injector/state.act.js";
import { _injector } from "../table.js";
import { RCTablePlugin } from "../plugin.js";

// 自定义渲染单元格
export function _useCustomRender() {
  const { state, self, rcPlugins } = _injector.useDeps(_useStateAct);
  const props = _injector.useProps();

  // mountChange触发时, 清理renderMap中已卸载的单元格
  useEffect(() => {
    if (!state.instance) return;

    const handle = (cell: TableCell) => {
      if (!cell.isMount) {
        delete self.renderMap[cell.key];
      }
    };

    state.instance.event.mountChange.on(handle);

    return () => {
      state.instance.event.mountChange.off(handle);
    };
  }, [state.instance]);

  // 覆盖并扩展table.config.render
  const render = useFn((cell: TableCellWithDom, _ctx: TableRenderCtx) => {
    const arg = renderCommonHandle({
      props,
      state,
      cell,
      rcPlugins,
    });

    if (isTruthyOrZero(arg.prevElement)) {
      _ctx.disableDefaultRender = true;

      self.renderMap[cell.key] = {
        cell,
        element: arg.prevElement,
      };
      return;
    }
  });

  return {
    render,
  };
}

/** 自定义render处理 插件render/config render/column render */
export function renderCommonHandle(args: {
  props: RCTableProps;
  state: _RCTableState;
  cell: TableCellWithDom;
  rcPlugins: RCTablePlugin[];
}) {
  const { props, state, cell, rcPlugins } = args;

  const arg: RCTableRenderArg = {
    cell,
    context: props.context || {},
    table: state.instance as any as RCTableInstance,
    prevElement: null,
  };

  // 处理插件render
  rcPlugins.forEach((p) => {
    const el = p.rcCellRender?.({
      cell,
      prevElement: arg.prevElement,
    });

    if (isTruthyOrZero(el)) {
      arg.prevElement = el!;
    }
  });

  // props.render
  const el = props.render?.(arg);

  if (isTruthyOrZero(el)) {
    arg.prevElement = el!;
  }

  // 处理column.render
  if (cell.column.config.render && !cell.row.isFake) {
    const el = cell.column.config.render(arg);

    if (isTruthyOrZero(el)) {
      arg.prevElement = el!;
    }
  }

  return arg;
}

export type _UseCustomRender = ReturnType<typeof _useCustomRender>;

// 自定义渲染, 组件部分, 用于避免频繁render影响外部作用域
export function _CustomRender() {
  const { state, self } = _injector.useDeps(_useStateAct);

  const [list, setList] = React.useState<_CustomRenderItem[]>([]);

  // 更新渲染列表
  const update = useFn(() => {
    const ls = Object.keys(self.renderMap).map((key) => {
      return self.renderMap[key];
    });

    setList(ls);
  });

  useEffect(() => {
    if (!state.instance) return;

    state.instance.event.rendered.on(update);

    update();

    return () => {
      state.instance.event.rendered.off(update);
    };
  }, [state.instance]);

  return (
    <>
      {list.map((i) => {
        return ReactDom.createPortal(
          i.element,
          i.cell.dom,
          i.cell.key as string
        );
      })}
    </>
  );
}
