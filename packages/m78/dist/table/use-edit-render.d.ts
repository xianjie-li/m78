import { TableCell } from "../table-vanilla/index.js";
import { TableInteractiveDone, TableInteractiveRenderArg } from "../table-vanilla/plugins/interactive-core.js";
export declare function _useEditRender(): {
    interactiveEnableChecker: (cell: TableCell) => boolean;
    interactiveRender: ({ cell, value, done, node, }: TableInteractiveRenderArg) => TableInteractiveDone;
};
export declare type _UseEditRender = ReturnType<typeof _useEditRender>;
export declare function _CustomEditRender(): JSX.Element;
//# sourceMappingURL=use-edit-render.d.ts.map