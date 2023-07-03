import { TablePlugin } from "../plugin.js";
import { ActionHistory } from "@m78/utils";

export class _TableHistoryPlugin extends TablePlugin {
  init() {
    this.table.history = new ActionHistory();
  }
}

export interface TableHistory {
  /** 记录数据和配置的所有变更操作 */
  history: ActionHistory;
}
