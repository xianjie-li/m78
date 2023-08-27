import React from "react";
import { _RCTableContext } from "../types.js";
import { TableCell } from "../../table-vanilla/index.js";
import { SetState } from "@m78/hooks";
import { FormInstance } from "../../form/index.js";
/** 工具栏查询按钮 */
export declare function _renderToolBarQueryBtn(ctx: _RCTableContext): JSX.Element;
/** 工具栏重置按钮 */
export declare function _ToolBarFilterBtn({ ctx }: {
    ctx: _RCTableContext;
}): JSX.Element;
/** 表头右侧的字段筛选按钮 */
export declare const _FilterBtn: React.MemoExoticComponent<({ ctx, cell, }: {
    cell: TableCell;
    ctx: _RCTableContext;
}) => JSX.Element>;
/** 工具类公共筛选按钮 */
export declare function _ToolbarCommonFilter({ ctx }: {
    ctx: _RCTableContext;
}): JSX.Element;
/** 通用筛选弹层渲染逻辑 */
export declare const _FilterBtnCommon: ({ ctx, render, isToolbar, children, }: {
    ctx: _RCTableContext;
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