import {
  _CustomEditItem,
  _RCTableContext,
  RCTableEditRenderArg,
} from "./types.js";
import { TableCell } from "../table-vanilla/index.js";
import { createEvent, useFn } from "@m78/hooks";
import React, { useMemo } from "react";
import ReactDom, { flushSync } from "react-dom";
import {
  TableInteractiveDone,
  TableInteractiveRenderArg,
} from "../table-vanilla/plugins/interactive-core.js";
import { delay } from "@m78/utils";

// 自定义编辑逻辑
export function _useEditRender(ctx: _RCTableContext) {
  const { state, self, props } = ctx;

  // 检测单元格是否可编辑
  const interactiveEnableChecker = useFn((cell: TableCell) => {
    if (cell.column.isFake || cell.row.isFake) return false;
    return !!cell.column.config.editRender;
  });

  // 自定义编辑渲染
  const interactiveRender = useFn(
    ({
      cell,
      value,
      done,
      node,
    }: TableInteractiveRenderArg): TableInteractiveDone => {
      const editRender = cell.column.config.editRender!;

      let time = 0;
      let val = value;

      const arg: RCTableEditRenderArg = {
        cell,
        table: state.instance,
        context: props.context || {},
        value,
        form: {} as any,
        change: (_val) => {
          val = _val;
        },
        submit: () => done(),
        cancel: () => done(false),
        delayClose: (t) => {
          time = t;
        },
      };

      const ret = editRender(arg);

      self.editMap[cell.key] = {
        cell,
        node,
        element: ret,
      };

      // 清理/状态同步
      const finish = (isSubmit: boolean) => {
        delete self.editMap[cell.key];

        if (isSubmit && val !== value) {
          state.instance.setValue(cell, val);
        }
      };

      return (isSubmit) => {
        // 延迟清理
        if (time > 0) {
          return delay(time).then(() => {
            finish(isSubmit);
          });
        }

        // 正常清理
        finish(isSubmit);
      };
    }
  );

  return {
    interactiveEnableChecker,
    interactiveRender,
  };
}

export type _UseEditRender = ReturnType<typeof _useEditRender>;

// 自定义编辑渲染, 组件部分, 用于避免频繁render影响外部作用域
export function _CustomEditRender({ ctx }: { ctx: _RCTableContext }) {
  const { self, state } = ctx;

  const [list, setList] = React.useState<_CustomEditItem[]>([]);

  // 更新渲染列表
  const update = useFn(() => {
    const ls = Object.keys(self.editMap).map((key) => {
      return self.editMap[key];
    });

    if (ctx.props.syncRender) {
      flushSync(() => {
        setList(ls);
      });
    } else {
      setList(ls);
    }
  });

  state.instance.event.interactiveChange.useEvent(update);

  return (
    <>
      {list.map((i) => {
        return ReactDom.createPortal(i.element, i.node, String(i.cell.key));
      })}
    </>
  );
}
