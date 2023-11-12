import { RCTablePlugin } from "../../plugin.js";
import { TableCellWithDom } from "../../../table-vanilla/index.js";
import React from "react";
export declare class _FilterPlugin extends RCTablePlugin {
    toolbarLeadingCustomer(nodes: React.ReactNode[]): void;
    rcCellRender(data: {
        cell: TableCellWithDom;
        prevElement: React.ReactNode | null;
    }): React.ReactNode | void;
}
//# sourceMappingURL=filter.d.ts.map