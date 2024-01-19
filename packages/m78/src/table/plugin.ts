import { TablePlugin } from "../table-vanilla/plugin.js";
import { throwError } from "@m78/utils";
import { _prefix } from "../table-vanilla/common.js";
import { ReactNode } from "react";
import { TableCellWithDom } from "../table-vanilla/index.js";
import { _RCTableSelf, _RCTableState, RCTableProps } from "./types.js";
import { InjectType } from "../injector/index.js";
import { _useStateAct } from "./injector/state.act.js";
import { _injector } from "./table.js";

type InjectGetters = ReturnType<typeof _injector["useGetter"]>;

/** 扩展后的 TablePlugin, 提供了react相关的渲染api */
export class RCTablePlugin extends TablePlugin {
  constructor(...args: ConstructorParameters<typeof TablePlugin>) {
    super(...args);
  }

  /** 定制右侧toolbar按钮, 可直接更改nodes, 向其中新增或删除节点 */
  toolbarTrailingCustomer?(nodes: ReactNode[]): void;

  /** 定制左侧toolbar按钮, 可直接更改nodes, 向其中新增或删除节点 */
  toolbarLeadingCustomer?(nodes: ReactNode[]): void;

  /** 在初始化时改写或新增state的默认配置 */
  rcStateInitializer?(state: _RCTableState): void;

  /** 在初始化时改写或新增self的默认配置 */
  rcSelfInitializer?(self: _RCTableSelf): void;

  /** react侧初始化时执行 */
  rcInit?(): void;

  /** 自定义单元格渲染 */
  rcCellRender?(data: {
    /** 当前cell */
    cell: TableCellWithDom;
    /** 如果在其他定制render之后执行, 如插件/config.render/column.render, 接收经过它们处理后的element, 可以选择忽略之前的定制或对其进行合并处理后返回 */
    prevElement: ReactNode | null;
  }): ReactNode | void;

  /** 在根节点渲染额外节点 */
  rcExtraRender?(): ReactNode;

  /** Table组件的运行时, 可使用hook和injector */
  rcRuntime?(): void;

  getProps: InjectGetters["getProps"];

  getDeps: InjectGetters["getDeps"];

  /** 获取已注册的 RCTablePlugin 实例, 不存在对应类型的插件时, 抛出异常 */
  getRCPlugin<T extends TablePlugin = any>(
    pluginClass: new (...args: any[]) => T
  ): T {
    const ins = this.plugins.find((p) => {
      return p instanceof RCTablePlugin && p instanceof pluginClass;
    });

    if (!ins) {
      throwError(`No plugin of type ${pluginClass.name} was found.`, _prefix);
    }

    return ins as T;
  }
}
