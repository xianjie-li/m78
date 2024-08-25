import React from "react";
import { MenuOption, MenuProps } from "../../../menu/index.js";
import { TupleNumber } from "@m78/utils";
export type _TableContextMenuOpenOpt = {
    /** 菜单位置 */
    xy: TupleNumber;
    /** 选择后的回调 */
    cb?: MenuProps["onConfirm"];
    /** 菜单配置 */
    menu?: MenuOption[];
};
export declare const _useContextMenuAct: () => {
    open: (opt: _TableContextMenuOpenOpt) => void;
    node: React.JSX.Element;
};
//# sourceMappingURL=use-context-menu.act.d.ts.map