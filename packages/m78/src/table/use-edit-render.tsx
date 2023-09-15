import { _CustomEditItem, RCTableEditRenderArg } from "./types.js";
import { TableCell } from "../table-vanilla/index.js";
import { useFn } from "@m78/hooks";
import React from "react";
import ReactDom, { flushSync } from "react-dom";
import {
  TableInteractiveDone,
  TableInteractiveRenderArg,
} from "../table-vanilla/plugins/interactive-core.js";
import { delay } from "@m78/utils";
import { _useStateAct } from "./state.act.js";
import { _injector } from "./table.js";

// 自定义编辑逻辑
export function _useEditRender() {
  const { state, self } = _injector.useDeps(_useStateAct);
  const props = _injector.useProps();

  // 先根据schema配置生成一个enableMap, 用于检测单元格是否可编辑, 对于嵌套项, 递归生成字符串

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
      form,
    }: TableInteractiveRenderArg): TableInteractiveDone => {
      const editRender = cell.column.config.editRender!;

      let time = 0;
      let val = value;

      console.log(form.getSchema(cell.column.config.originalKey));

      const arg: RCTableEditRenderArg = {
        cell,
        table: state.instance,
        context: props.context || {},
        value,
        change: (_val) => {
          val = _val;
        },
        form,
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

// 自定义编辑渲染, 组件部分, 用于避免频繁render影响外部作用域
export function _CustomEditRender() {
  const props = _injector.useProps();
  const { self, state } = _injector.useDeps(_useStateAct);

  const [list, setList] = React.useState<_CustomEditItem[]>([]);

  // 更新渲染列表
  const update = useFn(() => {
    const ls = Object.keys(self.editMap).map((key) => {
      return self.editMap[key];
    });

    if (props.syncRender) {
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
