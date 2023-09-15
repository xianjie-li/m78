import React from "react";
import { TableCell } from "../../table-vanilla/index.js";
import { SetState } from "@m78/hooks";
import { FormInstance } from "../../form/index.js";
import { _useStateAct } from "../state.act.js";
import { InjectType } from "../../injector/index.js";
/** 工具栏查询按钮 */
export declare function _renderToolBarQueryBtn(stateDep: InjectType<typeof _useStateAct>): JSX.Element;
/** 工具栏重置按钮 */
export declare function _ToolBarFilterBtn(): JSX.Element;
/** 表头右侧的字段筛选按钮 */
export declare const _FilterBtn: React.MemoExoticComponent<({ cell, }: {
    cell: TableCell;
}) => JSX.Element>;
/** 工具栏公共筛选按钮 */
export declare function _ToolbarCommonFilter(): JSX.Element | null;
/** 通用筛选弹层渲染逻辑 */
export declare const _FilterBtnCommon: ({ render, isToolbar, children, }: {
    render?: ((form: FormInstance) => React.ReactNode) | undefined;
    isToolbar?: boolean | undefined;
    children: (arg: {
        state: {
            open: boolean;
            changed: boolean;
        };
        setState: SetState<{
            open: boolean;
            changed: boolean;
        }>;
        renderContent: () => JSX.Element;
    }) => React.ReactElement;
}) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null;
//# sourceMappingURL=filter-btn.d.ts.map