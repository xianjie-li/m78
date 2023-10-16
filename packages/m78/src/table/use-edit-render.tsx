import { _CustomEditItem, RCTableEditRenderArg } from "./types.js";
import { TableCell } from "../table-vanilla/index.js";
import { useFn } from "@m78/hooks";
import React, { cloneElement, isValidElement, ReactElement } from "react";
import ReactDom, { flushSync } from "react-dom";
import {
  TableInteractiveDone,
  TableInteractiveRenderArg,
} from "../table-vanilla/plugins/interactive-core.js";
import {
  AnyObject,
  delay,
  isBoolean,
  isFunction,
  isString,
  NamePath,
  stringifyNamePath,
} from "@m78/utils";
import { _useStateAct } from "./state.act.js";
import { _injector } from "./table.js";
import { throwError } from "../common/index.js";
import { FormAdaptorsItem } from "../form/index.js";
import { m78Config } from "../config/index.js";

// 自定义编辑逻辑
export function _useEditRender() {
  const { state, self } = _injector.useDeps(_useStateAct);
  const props = _injector.useProps();

  // 先根据schema配置生成一个enableMap, 用于检测单元格是否可编辑, 对于嵌套项, 递归生成字符串

  // 检测单元格是否可编辑
  const interactiveEnableChecker = useFn((cell: TableCell) => {
    if (cell.column.isFake || cell.row.isFake) return false;
    return checkEditable(cell.column.config.originalKey);
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
      let time = 0;
      let val = value;

      const schema = form.getSchema(cell.column.config.originalKey);

      const schemaElement = schema?.element;

      if (!schemaElement) {
        throwError(`can't find element for schema: ${cell.column.key}`);
      }

      if (isFunction(schemaElement)) {
        throwError(`element can't be function: ${cell.column.key}`);
      }

      const adaptor = getAdaptors(schemaElement);

      if (!adaptor) {
        throwError(
          `can't find adaptor for element: ${cell.column.key}, please set it in table config or global config.`
        );
      }

      if (!adaptor.tableAdaptor) {
        throwError(`can't find tableAdaptor for element: ${cell.column.key}`);
      }

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
        element: adaptor.element,
        binder: (element, pp) => {
          return cloneElement(element, pp as AnyObject);
        },
      };

      const ret = adaptor.tableAdaptor(arg);

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

  /** 从表格配置/全局配置中获取指定节点的适配器  */
  function getAdaptors(ele: ReactElement | string): FormAdaptorsItem | null {
    let item: FormAdaptorsItem | null = null;

    const globalAdaptors = m78Config.get().formAdaptors;

    const ls = [...(props.adaptors || []), ...globalAdaptors];

    if (ls.length) {
      for (let i = 0; i < ls.length; i++) {
        const adaptor = ls[i];

        if (
          isValidElement(ele) &&
          isValidElement(adaptor.element) &&
          adaptor.element.type === ele.type
        ) {
          item = adaptor;
          break;
        }

        if (isString(ele) && adaptor.name === ele) {
          item = adaptor;
          break;
        }
      }
    }

    return item;
  }

  /** 检测是否可编辑 */
  function checkEditable(name: NamePath) {
    const sName = stringifyNamePath(name);

    const cache = self.editStatusMap[sName];

    if (isBoolean(cache)) return cache;

    const sh = self.editCheckForm.getSchema(name);
    const editable = !!sh?.element;

    self.editStatusMap[sName] = editable;

    return editable;
  }

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
