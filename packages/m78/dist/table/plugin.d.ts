import { TablePlugin } from "../table-vanilla/plugin.js";
import { ReactNode } from "react";
import { TableCellWithDom } from "../table-vanilla/index.js";
import { _injector } from "./table.js";
type InjectGetters = ReturnType<typeof _injector["useGetter"]>;
/** 扩展后的 TablePlugin, 提供了react相关的渲染api */
export declare class RCTablePlugin extends TablePlugin {
    constructor(...args: ConstructorParameters<typeof TablePlugin>);
    /** 定制右侧toolbar按钮, 可直接更改nodes, 向其中新增或删除节点 */
    toolbarTrailingCustomer?(nodes: ReactNode[]): void;
    /** 定制左侧toolbar按钮, 可直接更改nodes, 向其中新增或删除节点 */
    toolbarLeadingCustomer?(nodes: ReactNode[]): void;
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
    getRCPlugin<T extends TablePlugin = any>(pluginClass: new (...args: any[]) => T): T;
}
export {};
//# sourceMappingURL=plugin.d.ts.map