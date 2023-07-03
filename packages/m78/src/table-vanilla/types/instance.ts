import { TableConfig, TableConfigCanNotChanges } from "./config.js";
import { TableSelect } from "../plugins/select.js";
import { TableEvent } from "../plugins/event.js";
import { TableHistory } from "../plugins/history.js";
import { TableGetter } from "../plugins/getter.js";
import { TableLife } from "../plugins/life.js";
import { TableMutation } from "../plugins/mutation.js";
import { TableHighlight } from "../plugins/highlight.js";
import { TableSortColumn } from "../plugins/sort-column.js";
import { TableViewPort } from "../plugins/viewport.js";
import { TableDisable } from "../plugins/disable.js";

/** table实例 */
export interface TableInstance
  extends TableGetter,
    TableSelect,
    TableDisable,
    TableLife,
    TableEvent,
    TableHistory,
    TableMutation,
    TableHighlight,
    TableSortColumn,
    TableViewPort {
  /** processing为true时, 后续的mutation操作会被阻止 */
  processing(): boolean;

  /** 设置processing */
  processing(processing: boolean): void;

  /* # # # # # # # 配置管理 # # # # # # # */
  /** 获取配置 */
  config(): TableConfig;

  /**
   * 更改配置, 可单个或批量传入, 配置更新后会自动reload(), 另外, 像 el, primaryKey, plugins 这类的配置项不允许更新
   * - 可传入keepPosition保持当前滚动位置
   * - 此外, 每调用只应传入发生变更的配置项, 因为不同的配置有不同的重置级别, 某些配置只需要部分更新, 而另一些则需要完全更新
   *
   * ## example
   * ```ts
   * table.config({ rowHeight: 40, columnWidth: 150 }); // 批量更改
   * table.config({ rowHeight: 40 }); // 单个更改
   * ```
   * */
  config(
    config: Omit<Partial<TableConfig>, TableConfigCanNotChanges>,
    keepPosition?: boolean
  ): void;
}
