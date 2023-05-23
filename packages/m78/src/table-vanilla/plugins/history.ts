import { TablePlugin } from "../plugin.js";
import { ActionHistory } from "@m78/utils";

// 改为util中的工具类, 支持添加批量操作拦截

export class _TableHistoryPlugin extends TablePlugin {
  init() {
    this.table.history = new ActionHistory();
  }
}
