import { _CustomEditItem, RCTableEditRenderArg } from "../types.js";
import {
  TableCell,
  TableInteractiveDone,
  TableInteractiveRenderArg,
} from "../../table-vanilla/index.js";
import { useFn } from "@m78/hooks";
import React, { cloneElement, isValidElement, ReactElement } from "react";
import {
  AnyObject,
  delay,
  isBoolean,
  isFunction,
  isString,
  NamePath,
  stringifyNamePath,
} from "@m78/utils";
import { _useStateAct } from "../injector/state.act.js";
import { _injector } from "../table.js";
import { throwError } from "../../common/index.js";
import { FormAdaptorsItem, m78Config } from "../../config/index.js";
import { Overlay } from "../../overlay/index.js";
import { TransitionType } from "../../transition/index.js";
import { FormSchema } from "../../form/index.js";

// 自定义编辑逻辑
export function _useEditRender() {
  const { state, self, dataOperations } = _injector.useDeps(_useStateAct);
  const props = _injector.useProps();

  // 从表格配置/全局配置中获取指定节点的适配器
  const getAdaptors = useFn(
    (ele: ReactElement | string): FormAdaptorsItem | null => {
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
  );

  /** 检测指定name是否可编辑 */
  const checkEditable = useFn((name: NamePath) => {
    const sName = stringifyNamePath(name);

    const cache = self.editStatusMap[sName];

    if (isBoolean(cache)) return cache;

    const sh = self.editCheckForm.getSchema(name); // 改为取form插件的schema
    const editable = !!sh?.element;

    self.editStatusMap[sName] = editable;

    return editable;
  });

  /** 获取cell对应的schema */
  const getCellSchema = useFn((cell: TableCell) => {
    if (!self.vCtx) return;

    const { schemasFlat } = self.vCtx.getSchemas(cell.row);

    return schemasFlat.get(cell.column.key as string) as FormSchema | null;
  });

  /** 获取cell对应的schema.element */
  const getCellElement = useFn((cell: TableCell) => {
    return (getCellSchema(cell) as FormSchema)?.element;
  });

  // 检测单元格是否可编辑 依据: 1. 是否启用edit或是新增数据  2. 是否配置了schema.element
  const interactiveEnableChecker = useFn((cell: TableCell) => {
    if (cell.column.isFake || cell.row.isFake) return false;
    if (cell.column.isHeader || cell.row.isHeader) return false;

    if (!self.instance) {
      console.log("ignore .....");
    }

    const meta = state.vCtx.getRowMeta(cell.row.key);

    const isNew = meta.new;

    if (isNew) {
      return !!getCellElement(cell); // 新增项在包含有效schema.element时始终可编辑
    }

    if (dataOperations.edit === false) return false;

    if (isFunction(dataOperations.edit) && !dataOperations.edit(cell))
      return false;

    return !!getCellElement(cell);
  });

  // 自定义编辑渲染
  const interactiveRender = useFn(
    ({
      cell,
      value,
      done,
      node,
    }: TableInteractiveRenderArg): TableInteractiveDone => {
      let time = 0;
      let val = value;

      const schema = getCellSchema(cell);

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
        submit: () => done(),
        cancel: () => done(false),
        delayClose: (t) => {
          time = t;
        },
        element: adaptor.element,
        binder: (element, pp) => {
          return cloneElement(element, pp as AnyObject);
        },
        prevElement: null,
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

  return {
    interactiveEnableChecker,
    interactiveRender,
  };
}

// 自定义编辑渲染, 组件部分, 用于避免频繁render影响外部作用域
export function _CustomEditRender() {
  const { self, state } = _injector.useDeps(_useStateAct);

  const [list, setList] = React.useState<_CustomEditItem[]>([]);

  // 更新渲染列表
  const update = useFn(() => {
    const ls = Object.keys(self.editMap).map((key) => {
      return self.editMap[key];
    });

    setList(ls);
  });

  state.instance.event.interactiveChange.useEvent(update);

  return list.map((i) => {
    return (
      <Overlay
        content={i.element}
        key={i.cell.key}
        target={i.node}
        open
        transitionType={TransitionType.none}
        autoFocus={false}
        lockScroll={false}
        clickAwayClosable={false}
        clickAwayQueue={false}
        escapeClosable={false}
        style={{
          width: i.node.clientWidth,
          height: i.node.clientHeight,
          borderRadius: 0,
        }}
      />
    );
  });
}
