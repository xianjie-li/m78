/** 高亮行/列/单元格, 并滚动至首个高亮项 */
import { TablePlugin } from "../plugin.js";
import { TableCell } from "../types/items.js";
import {
  ensureArray,
  getNamePathValue,
  isNumber,
  setNamePathValue,
} from "@m78/utils";
import { addCls, removeCls } from "../../common/index.js";
import { TableKey } from "../types/base-type.js";
import { _TableMetaDataPlugin } from "./meta-data.js";
import { raf } from "@m78/animate-tools";

/** 单元格, 行, 列高亮/自动滚动 */
export class _TableHighlightPlugin
  extends TablePlugin
  implements TableHighlight
{
  beforeInit() {
    this.methodMapper(this.table, [
      "locate",
      "highlight",
      "highlightColumn",
      "highlightRow",
    ]);
  }

  private tempDisableSubsequentTime: number | undefined;

  locate(
    cell: TableKey | TableKey[],
    tempDisableSubsequent = false
  ): TableCell {
    const list = ensureArray(cell).map((i) => this.table.getCellByStrKey(i));

    if (
      !tempDisableSubsequent &&
      this.tempDisableSubsequentTime &&
      Date.now() - this.tempDisableSubsequentTime < 120
    ) {
      return list[0];
    }

    if (tempDisableSubsequent) {
      this.tempDisableSubsequentTime = Date.now();
    } else {
      this.tempDisableSubsequentTime = undefined;
    }

    let first = list[0];

    // 自动滚动到目标时的额外距离
    const edgeOffset = 20;

    if (list.length > 1) {
      let minRowIndex: number | undefined;

      list.forEach((i) => {
        if (!isNumber(minRowIndex)) {
          minRowIndex = i.row.index;
        } else if (minRowIndex > i.row.index) {
          minRowIndex = i.row.index;
        }
      });

      if (isNumber(minRowIndex)) {
        const filter = list.filter((i) => i.row.index === minRowIndex);
        const sort = filter.sort((a, b) => a.column.index - b.column.index);

        if (sort.length) {
          first = sort[0];
        }
      }
    }

    const [x, y] = this.table.getXY();

    const column = first.column;
    const row = first.row;

    const leftContW = this.table.getWidth() - this.context.rightFixedWidth;
    const topContH = this.table.getHeight() - this.context.bottomFixedHeight;

    const left = x + this.context.leftFixedWidth;
    const right = x + leftContW;
    const top = y + this.context.topFixedHeight;
    const bottom = y + topContH;

    let xHide = false;
    let yHide = false;

    const overLeft = column.x < left;
    const overRight = column.x + first.width > right;

    const overTop = row.y < top;
    const overBottom = row.y + first.height > bottom;

    // 对应方向非固定项并且不在可见区域时, 对其标记
    if (!column.isFixed && (overLeft || overRight)) {
      xHide = true;
    }

    if (!row.isFixed && (overTop || overBottom)) {
      yHide = true;
    }

    if (xHide || yHide) {
      let xOffset = x;
      let yOffset = y;

      if (xHide) {
        if (overLeft) {
          xOffset = column.x - this.context.leftFixedWidth - edgeOffset;
        } else if (overRight) {
          xOffset = column.x - leftContW + first.width + edgeOffset;
        }
      }

      if (yHide) {
        if (overTop) {
          yOffset = row.y - this.context.topFixedHeight - edgeOffset;
        } else if (overBottom) {
          yOffset = row.y - topContH + first.height + edgeOffset;
        }
      }

      this.table.takeover(() => {
        this.table.setXY(xOffset, yOffset);
      }, false);
      this.table.renderSync();
    }

    return first;
  }

  highlight(cell: TableKey | TableKey[], autoScroll = true) {
    const list = ensureArray(cell).map((i) => this.table.getCellByStrKey(i));

    if (!list.length) return;

    if (autoScroll) {
      this.locate(cell);
    }

    list.forEach((it) => {
      const trigger = (item: TableCell) => {
        if (!item.dom) return;

        removeCls(item.dom, "m78-highlight-bg");

        raf(() => {
          if (item.dom) {
            const prevTimer = getNamePathValue(
              item.dom,
              _TableMetaDataPlugin.TIMER_KEY
            );

            if (prevTimer !== undefined) {
              clearTimeout(prevTimer);
            }

            addCls(item.dom, "m78-highlight-bg");

            const timer = setTimeout(() => {
              if (item.dom) {
                removeCls(item.dom, "m78-highlight-bg");

                setNamePathValue(
                  item.dom,
                  _TableMetaDataPlugin.TIMER_KEY,
                  null
                );
              }
            }, 2000);

            setNamePathValue(item.dom, _TableMetaDataPlugin.TIMER_KEY, timer);
          }
        });
      };

      // 单元格cell可能尚未被初始化, 延迟一段时间后再执行
      if (!it.dom) {
        setTimeout(() => {
          // item可能是cell的拷贝, 需要重新获取
          const freshCell = this.table.getCell(it.row.key, it.column.key);

          // 如果节点仍然有效并挂载
          if (freshCell.dom && freshCell.isMount) {
            trigger(freshCell);
          }
        }, 10);
        return;
      }

      trigger(it);
    });
  }

  highlightColumn(column: TableKey | TableKey[], autoScroll = true) {
    const columns = ensureArray(column).map((i) => this.table.getColumn(i));

    const headerRowKey =
      this.context.yHeaderKeys[this.context.yHeaderKeys.length - 1];

    const columnHeaderCells: TableCell[] = [];

    columns.forEach((i) => {
      const cell = this.table.getCell(headerRowKey, i.key);

      // 若是被合并项, 取合并者
      const merged = this.table.getMergedData(cell);

      if (merged) {
        columnHeaderCells.push(this.table.getCell(merged[0], merged[1]));
      } else {
        columnHeaderCells.push(cell);
      }
    });

    if (!columnHeaderCells.length) return;
    this.highlight(
      columnHeaderCells.map((i) => i.key),
      autoScroll
    );
  }

  highlightRow(row: TableKey | TableKey[], autoScroll = true) {
    const rows = ensureArray(row).map((i) => this.table.getRow(i));

    const xHeaderKey = this.context.xHeaderKey;

    const rowHeaderCells = rows.map((i) => {
      return this.table.getCell(i.key, xHeaderKey);
    });

    if (!rowHeaderCells.length) return;
    this.highlight(
      rowHeaderCells.map((i) => i.key),
      autoScroll
    );
  }
}

export interface TableHighlight {
  /**
   * 定位到指定元素, 若元素不在视口, 自动将其滚动到视口内最靠近的位置, 传入多个cell时, 会定位到最靠近左上角的cell
   *
   * 若存在多处连续调用locate, 可能会存在跳转顺序与预期不符, 可通过tempDisableSubsequent暂时禁用后续的locate调用
   *
   * 返回最终定位到的单元格
   * */
  locate(
    cell: TableKey | TableKey[],
    tempDisableSubsequent?: boolean
  ): TableCell;

  /** 高亮指定的单元格, 传入autoScroll时会在单元格不可见时自动滚动到单元格位置, 默认为true */
  highlight(cell: TableKey | TableKey[], autoScroll?: boolean): void;

  /** 高亮指定的行, 传入autoScroll时会在单元格不可见时自动滚动到单元格位置, 默认为true */
  highlightRow(row: TableKey | TableKey[], autoScroll?: boolean): void;

  /** 高亮指定的列, 传入autoScroll时会在单元格不可见时自动滚动到单元格位置, 默认为true */
  highlightColumn(column: TableKey | TableKey[], autoScroll?: boolean): void;
}
