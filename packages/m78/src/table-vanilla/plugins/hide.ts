import { TableLoadStage, TablePlugin } from "../plugin.js";
import { TableKey } from "../types/base-type.js";
import { _TableMetaDataPlugin } from "./meta-data.js";
import { SelectManager } from "@m78/utils";

/**
 * 表格列隐藏
 *
 * 通过为隐藏项添加meta.ignore实现, ignore状态为额外维护的, 防止与默认的产生冲突
 * */
export class _TableHidePlugin extends TablePlugin {
  metaData: _TableMetaDataPlugin;

  // 检测是否隐藏
  hideChecker = new SelectManager();

  beforeInit() {
    this.metaData = this.getPlugin(_TableMetaDataPlugin);
    this.metaData.extraColumnIgnoreChecker.push(this.hideChecker);
  }

  loadStage(stage: TableLoadStage, isBefore: boolean) {
    if (stage === TableLoadStage.indexHandle && isBefore) {
      this.handle();
    }
  }

  handle() {
    this.hideChecker.setAllSelected(
      this.context.persistenceConfig.hideColumns || []
    );
  }

  /** 是否为隐藏列 */
  isHideColumn(key: TableKey) {
    return this.hideChecker.isSelected(key);
  }
}
