import { _RCTableContext } from "./types.js";
import { TableCellWithDom, TableRenderCtx } from "../table-vanilla/index.js";
export declare function _useCustomRender(ctx: _RCTableContext): {
    render: (cell: TableCellWithDom, _ctx: TableRenderCtx) => void;
};
export declare type _UseCustomRender = ReturnType<typeof _useCustomRender>;
export declare function _CustomRender({ ctx }: {
    ctx: _RCTableContext;
}): JSX.Element;
//# sourceMappingURL=use-custom-render.d.ts.map