import { _RCTableContext } from "./types.js";
import { TableCell } from "../table-vanilla/index.js";
import { TableInteractiveDone, TableInteractiveRenderArg } from "../table-vanilla/plugins/interactive-core.js";
export declare function _useEditRender(ctx: _RCTableContext): {
    interactiveEnableChecker: (cell: TableCell) => boolean;
    interactiveRender: ({ cell, value, done, node, }: TableInteractiveRenderArg) => TableInteractiveDone;
};
export declare type _UseEditRender = ReturnType<typeof _useEditRender>;
export declare function _CustomEditRender({ ctx }: {
    ctx: _RCTableContext;
}): JSX.Element;
//# sourceMappingURL=use-edit-render.d.ts.map