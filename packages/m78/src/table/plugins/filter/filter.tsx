import { RCTablePlugin } from "../../plugin.js";
import { TableCellWithDom } from "../../../table-vanilla/index.js";
import React from "react";
import {
  _FilterBtn,
  _ToolbarCommonFilterBtn,
  _ToolBarFilterBtn,
  _ToolBarQueryBtn,
} from "./filter-btn.js";
import { Divider } from "../../../layout/index.js";

export class _FilterPlugin extends RCTablePlugin {
  // 扩展左侧按钮
  toolbarLeadingCustomer(nodes: React.ReactNode[]) {
    const searchBtn = <_ToolBarQueryBtn />;

    const resetFilterBtn = <_ToolBarFilterBtn />;

    const filterBtn = <_ToolbarCommonFilterBtn />;

    nodes.unshift(searchBtn, <Divider vertical />, resetFilterBtn, filterBtn);
  }

  // 表头绘制控制, 添加过滤/排序按钮
  rcCellRender(data: {
    cell: TableCellWithDom;
    prevElement: React.ReactNode | null;
  }): React.ReactNode | void {
    const cell = data.cell;
    const column = cell.column;

    if (cell.row.isHeader && !column.isHeader) {
      return (
        <>
          <span>{cell.text}</span>
          <span className="m78-table_header-icons">
            <_FilterBtn cell={cell} />
          </span>
        </>
      );
    }
  }
}
