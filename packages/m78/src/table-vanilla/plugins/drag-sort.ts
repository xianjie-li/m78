import { TablePlugin } from "../plugin.js";
import { TableColumn, TableRow } from "../types/items.js";
import { DragGesture, FullGestureState } from "@use-gesture/vanilla";
import { _TableRowColumnResize } from "./row-column-resize.js";
import { removeNode } from "../../common/index.js";
import {
  AnyFunction,
  getEventOffset,
  isNumber,
  rafCaller,
  RafFunction,
  throwError,
} from "@m78/utils";
import { createAutoScroll, AutoScroll } from "@m78/smooth-scroll";
import {
  TableColumnFixed,
  TablePointInfo,
  TablePosition,
  TableRowFixed,
} from "../types/base-type.js";
import { _TableSelectPlugin } from "./select.js";
import { _TableDisablePlugin } from "./disable.js";

/** 表格行/列排序 */
export class _TableDragSortPlugin extends TablePlugin {
  /** 拖动控制 */
  drag: DragGesture;

  lastColumns: TableColumn[] | undefined;
  lastRows: TableRow[] | undefined;

  /** 获取当前的行/列resize状态 */
  rcResize: _TableRowColumnResize;
  /** 获取当前的选区插件信息 */
  select: _TableSelectPlugin;
  /** 设置禁用样式 */
  disablePlugin: _TableDisablePlugin;

  /** 正在拖动 */
  dragging = false;

  /** 提示节点的容器 */
  wrap: HTMLDivElement;
  /** 提示区域 */
  tipAreaX: HTMLDivElement;
  tipAreaY: HTMLDivElement;
  /** 提示线 */
  tipLineX: HTMLDivElement;
  tipLineY: HTMLDivElement;

  /** 拖动到的目标行 */
  targetRow?: TableRow;
  /** 拖动到的目标列 */
  targetColumn?: TableColumn;
  /** 若为true, 表示拖动的目标之后 */
  isTargetAfter?: boolean;

  /** 边缘自动滚动控制器 */
  autoScroll: AutoScroll;

  rafCaller: RafFunction;

  /** 开始拖动的一些信息记录 */
  firstData?: {
    position: number;
    size: number;
    offset: TablePosition;
    // area的初始显示位置偏移
    diffOffset: TablePosition;
  };

  mounted() {
    this.initNodes();

    this.drag = new DragGesture(this.config.el, this.dragDispatch, {
      filterTaps: true,
      tapsThreshold: 5,
      pointer: {
        // https://github.com/pmndrs/use-gesture/issues/611
        capture: false,
      },
    });

    this.rcResize = this.getPlugin(_TableRowColumnResize);
    this.select = this.getPlugin(_TableSelectPlugin);
    this.disablePlugin = this.getPlugin(_TableDisablePlugin);

    this.rafCaller = rafCaller();

    this.autoScroll = createAutoScroll({
      el: this.context.viewEl,
      boundElement: this.config.el,
      checkOverflowAttr: false,
      baseOffset: 10,
      adjust: this.select.getAutoScrollBound(),
      onlyNotify: true,
      onScroll: (isX, offset) => {
        // 这里需要通过 takeover 手动将x/y赋值调整为同步
        this.table.takeover(() => {
          if (isX) {
            this.table.setX(this.table.getX() + offset);
          } else {
            this.table.setY(this.table.getY() + offset);
          }

          this.table.renderSync();
        });
      },
    });
  }

  reload() {
    this.updateAutoScrollBound();
  }

  beforeDestroy() {
    removeNode(this.wrap);
    this.drag.destroy();
    this.autoScroll.clear();
    this.autoScroll = null!;
  }

  triggerMoveRow(rows: TableRow[], target: TableRow, isTargetAfter?: boolean) {
    this.table.moveRow(
      rows.map((i) => i.key),
      target.key,
      isTargetAfter
    );
  }

  triggerMoveColumn(
    columns: TableColumn[],
    target: TableColumn,
    isTargetAfter?: boolean
  ) {
    this.table.moveColumn(
      columns.map((i) => i.key),
      target.key,
      isTargetAfter
    );
  }

  /** 将拖动事件派发到对应的行/列事件中 */
  private dragDispatch = (e: FullGestureState<"drag">) => {
    if (e.tap) return;

    if (!this.config.dragSortRow && !this.config.dragSortColumn) {
      e.cancel();
      return;
    }

    // 如果与resize重叠, 则进行阻断
    if (e.first && (this.rcResize.dragging || this.rcResize.activating)) {
      e.cancel();
      return;
    }

    const offset = getEventOffset(e.event as any, this.config.el);

    const contPoint = this.table.transformViewportPoint(offset);

    if (e.last) {
      if (this.lastColumns) {
        this.updateColumnNode(e, contPoint, offset);

        this.disablePlugin.setColumnDisable(
          this.lastColumns.map((column) => column.key),
          false
        );
      }

      if (this.lastRows) {
        this.updateRowNode(e, contPoint, offset);

        this.disablePlugin.setRowDisable(
          this.lastRows.map((row) => row.key),
          false
        );
      }

      if (this.lastColumns && this.targetColumn) {
        this.triggerMoveColumn(
          this.lastColumns,
          this.targetColumn,
          this.isTargetAfter
        );
      }

      if (this.lastRows && this.targetRow) {
        this.triggerMoveRow(this.lastRows, this.targetRow, this.isTargetAfter);
      }

      this.autoScroll.clear();

      this.firstData = undefined;

      this.lastColumns = undefined;
      this.lastRows = undefined;
      this.targetRow = undefined;
      this.targetColumn = undefined;
      return;
    }

    if (this.lastColumns) {
      this.updateColumnNode(e, contPoint, offset);
      return;
    }

    if (this.lastRows) {
      this.updateRowNode(e, contPoint, offset);
      return;
    }

    if (e.canceled) return;

    const items = this.table.getBoundItems(contPoint.xy);

    const first = items.cells[0];

    // 包含单元格并且该单元格是表头
    if (!first || (!first.row.isHeader && !first.column.isHeader)) {
      e.cancel();
      return;
    }

    // 跳过表头交叉区域
    if (first.row.isHeader && first.column.isHeader) {
      e.cancel();
      return;
    }

    // 禁用项
    if (this.disablePlugin.isDisabledCell(first.key)) {
      e.cancel();
      return;
    }

    if (first.column.isHeader) {
      if (this.table.isSelectedRow(first.row.key)) {
        this.lastRows = this.table
          .getSelectedRows()
          .filter((row) => !this.disablePlugin.isDisabledRow(row.key));

        this.disablePlugin.setRowDisable(this.lastRows.map((row) => row.key));
        this.memoFirstData(offset);
      }
    }

    if (first.row.isHeader) {
      this.lastColumns = items.columns.filter(
        (column) => !this.disablePlugin.isDisabledColumn(column.key)
      );
      this.disablePlugin.setColumnDisable(
        this.lastColumns.map((column) => column.key)
      );
      this.memoFirstData(offset);
    }
  };

  /** 处理列拖移 */
  private updateColumnNode(
    e: FullGestureState<"drag">,
    point: TablePointInfo,
    offset: TablePosition
  ) {
    this.updateNodeCommon(e, point, false, offset);
  }

  /** 处理行拖移 */
  private updateRowNode(
    e: FullGestureState<"drag">,
    point: TablePointInfo,
    offset: TablePosition
  ) {
    this.updateNodeCommon(e, point, true, offset);
  }

  /** 开始拖动时, 记录一些需要在拖动阶段使用的信息, 必须保证isRow对应方向的lastRows/lastColumns存在 */
  private memoFirstData(offset: TablePosition) {
    if (!this.lastRows && !this.lastColumns) {
      throwError("lastRows/lastColumns must be exist");
    }

    const isRow = !!this.lastRows;

    const lastData = isRow ? this.lastRows! : this.lastColumns!;
    const tablePos = isRow ? this.table.getY() : this.table.getX();

    // area显示
    let pos: number;
    let size = 0;

    // 最终确定位置的项是否是fixed项
    let isFixedPos = false;

    lastData.forEach((cur) => {
      let curPos = isRow ? (cur as TableRow).y : (cur as TableColumn).x;

      if (cur.isFixed) {
        curPos = cur.fixedOffset!;
      }

      const curSize = isRow
        ? (cur as TableRow).height
        : (cur as TableColumn).width;

      if (!isNumber(pos) || pos > curPos) {
        pos = curPos;
        isFixedPos = cur.isFixed;
      }

      size += curSize;
    });

    if (!isFixedPos) {
      pos = pos! - tablePos;
    }

    const notNullPos = pos!;

    this.firstData = {
      position: notNullPos,
      size,
      offset,
      diffOffset: [offset[0] - notNullPos, offset[1] - notNullPos],
    };
  }

  /** 通用的拖动更新逻辑 */
  private updateNodeCommon(
    e: FullGestureState<"drag">,
    point: TablePointInfo,
    isRow: boolean,
    offset: TablePosition
  ) {
    const _lastData = isRow ? this.lastRows : this.lastColumns;

    const areaKey = isRow ? "tipAreaX" : "tipAreaY";
    const lineKey = isRow ? "tipLineX" : "tipLineY";
    const translateKey = isRow ? "translateY" : "translateX";
    const areaSizeKey = isRow ? "height" : "width";

    // 是否超过容器拖动方向的起始侧
    const isOverContainer = isRow ? offset[0] < 0 : offset[1] < 0;

    const clear = () => {
      this.targetRow = undefined;
      this.targetColumn = undefined;
    };

    if (e.last || !_lastData) {
      this.dragging = false;
      this.rcResize.trigger.enable = true;

      this.autoScroll.trigger(e.xy, e.last, {
        left: isRow,
        right: isRow,
        top: !isRow,
        bottom: !isRow,
      });

      this.rafCaller(() => {
        this[areaKey].style.visibility = "hidden";
        this[areaKey].style.transform = `${translateKey}(0)`;
        this[areaKey].style[areaSizeKey] = "0px";

        this[lineKey].style.visibility = "hidden";
        this[lineKey].style.transform = `${translateKey}(0)`;

        clear();
      });
      return;
    }

    // 禁用_TableRowColumnResize,  处理快速拖动显示hover
    this.rcResize.trigger.enable = false;
    this.dragging = true;

    const lastData = [..._lastData];

    // line显示
    const items = this.table.getBoundItems(point.xy);

    const firstRow = items.rows[0];
    const firstColumn = items.columns[0];

    const first = isRow ? firstRow : firstColumn;

    const disabled = !!first?.isFixed;

    this.autoScroll.trigger(e.xy, e.last, {
      left: disabled || isRow,
      right: disabled || isRow,
      top: disabled || !isRow,
      bottom: disabled || !isRow,
    });

    this.rafCaller(() => {
      let updateLine: AnyFunction | undefined;

      const isValid =
        first &&
        !isOverContainer &&
        !first.isHeader &&
        !this.autoScroll.scrolling;

      if (isValid) {
        // 是否可见
        const isVisible = isRow
          ? this.table.isRowVisible(first.key, false)
          : this.table.isColumnVisible(first.key, false);

        // 是否是移动项本身
        const isSelf = lastData.some((cur) => cur.key === first.key);

        // 选中项的前后项不触发
        const beforeIndex = lastData[0].index - 1;
        const afterIndex = lastData[lastData.length - 1].index + 1;

        const viewPoint = this.table.transformContentPoint([
          isRow ? 0 : firstColumn.x,
          isRow ? firstRow.y : 0,
        ]);

        const isEndFixed =
          first.config.fixed === TableRowFixed.bottom ||
          first.config.fixed === TableColumnFixed.right;

        // 提示线条的修正位置, 使其能更贴合单元格边框, 右侧固定项由于边框会偏左1px
        const adjustOffset = isEndFixed ? 1 : 2;

        const firstPos = isRow ? firstRow.y : firstColumn.x;
        const firstSize = isRow ? firstRow.height : firstColumn.width;

        const viewPointPos = isRow ? viewPoint.y : viewPoint.x;
        const pointPos = isRow ? point.y : point.x;

        const split = firstPos + firstSize / 2;
        const start = viewPointPos - adjustOffset;
        const end = start + firstSize;

        const isStart = pointPos < split;

        const isBeforeIgnore = !isStart && beforeIndex === first.index;
        const isAfterIgnore = isStart && afterIndex === first.index;

        // 可见 & 不是当前拖动项 & 不是当前拖动项前后的忽略项
        if (isVisible && !isSelf && !(isBeforeIgnore || isAfterIgnore)) {
          updateLine = () => {
            this[lineKey].style.visibility = "visible";
            this[lineKey].style.transform = `${translateKey}(${
              isStart ? start : end
            }px)`;
          };

          clear();

          if (isRow) {
            this.targetRow = firstRow;
          } else {
            this.targetColumn = firstColumn;
          }

          this.isTargetAfter = !isStart;
        } else {
          updateLine = () => {
            this[lineKey].style.visibility = "hidden";
            clear();
          };
        }
      } else {
        updateLine = () => {
          this[lineKey].style.visibility = "hidden";
          clear();
        };
      }

      // 移动阶段起始数据时必定存在的
      const firstData = this.firstData!;

      const _offset = isRow
        ? offset[1] - firstData.diffOffset[1]
        : offset[0] - firstData.diffOffset[0];

      this[areaKey].style.visibility = "visible";
      this[areaKey].style.transform = `${translateKey}(${_offset}px)`;
      this[areaKey].style[areaSizeKey] = `${firstData.size}px`;

      if (updateLine) updateLine();
    });
  }

  /** 初始化dom节点 */
  private initNodes() {
    this.wrap = document.createElement("div");
    this.wrap.className = "m78-table_drag-feedback";

    this.tipAreaX = document.createElement("div");
    this.tipAreaY = document.createElement("div");
    this.tipLineX = document.createElement("div");
    this.tipLineY = document.createElement("div");

    this.tipAreaX.className = "m78-table_drag-area-x";
    this.tipAreaY.className = "m78-table_drag-area-y";
    this.tipLineX.className = "m78-table_drag-line-x";
    this.tipLineY.className = "m78-table_drag-line-y";

    this.wrap.appendChild(this.tipAreaX);
    this.wrap.appendChild(this.tipAreaY);
    this.wrap.appendChild(this.tipLineX);
    this.wrap.appendChild(this.tipLineY);

    this.config.el.appendChild(this.wrap);
  }

  /** 更新自动滚动判定点 */
  private updateAutoScrollBound = () => {
    this.autoScroll.updateConfig({
      adjust: this.select.getAutoScrollBound(),
    });
  };
}

export interface TableDragSortConfig {
  /** 是否允许拖拽排序行 */
  dragSortRow?: boolean;
  /** 是否允许拖拽排序列 */
  dragSortColumn?: boolean;
}
