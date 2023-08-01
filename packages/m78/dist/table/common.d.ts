import { TablePluginContext } from "../table-vanilla/types/context.js";
/** 需要忽略的配置 */
export declare const _tableOmitConfig: readonly ["el", "emptyNode", "emptySize", "interactiveRender", "viewEl", "viewContentEl", "eventCreator"];
/** 不需要响应变更的配置 */
export declare const _tableOmitChangeConfig: readonly ["primaryKey", "render", "texts", "plugins", "interactive", "style", "render", "emptyNode", "wrapClassName", "wrapStyle", "syncRender", "context", "onError", "onClick", "onSelect", "onMutation", "onQuery", "autoQuery", "commonFilter", "defaultParams", "toolBarLeadingCustomer", "toolBarTrailingCustomer", "import", "export", "editSchema", "querySchema"];
/** 同tableOmitChangeConfig, 可能是基础类型, 也可能是引用类型的字段, 若是基础类型则校验, 否则跳过 */
export declare const _tableOmitChangeMixTypeConfig: readonly ["rowSelectable", "cellSelectable", "interactive"];
/** 合并处理tableOmitChangeConfig & tableOmitChangeMixTypeConfig */
export declare const _tableOmitChangeChecker: (key: string, value: any) => boolean;
/** 从table实例中获取tableContext */
export declare const _getTableCtx: (instance: any) => TablePluginContext;
//# sourceMappingURL=common.d.ts.map