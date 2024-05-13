import { TablePlugin } from "../plugin.js";
import { ActionHistory } from "@m78/utils";

export class _TableHistoryPlugin extends TablePlugin {
  init() {
    this.table.history = new ActionHistory();

    this.table.history.enable = this.config.history!;

    this.table.event.configChange.on(this.configChangeHandle);
  }

  beforeDestroy(): void {
    this.table.event.configChange.off(this.configChangeHandle);
  }

  configChangeHandle(changeKeys: string[], isChange: (key: string) => boolean) {
    if (isChange("history")) {
      this.table.history.enable = this.config.history!;
    }
  }
}

export interface TableHistory {
  /** 记录数据和配置的所有变更操作 */
  history: ActionHistory;
}

export interface TableHistoryConfig {
  /** true | 启用历史记录 */
  history?: boolean;
}
