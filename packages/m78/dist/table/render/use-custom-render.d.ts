import { _RCTableState, RCTableProps, RCTableRenderArg } from "../types.js";
import { TableCellWithDom, TableRenderCtx } from "../../table-vanilla/index.js";
import { RCTablePlugin } from "../plugin.js";
export declare function _useCustomRender(): {
    render: (cell: TableCellWithDom, _ctx: TableRenderCtx) => void;
};
/** 自定义render处理 插件render/config render/column render */
export declare function renderCommonHandle(args: {
    props: RCTableProps;
    state: _RCTableState;
    cell: TableCellWithDom;
    rcPlugins: RCTablePlugin[];
}): RCTableRenderArg;
export type _UseCustomRender = ReturnType<typeof _useCustomRender>;
export declare function _CustomRender(): JSX.Element;
//# sourceMappingURL=use-custom-render.d.ts.map