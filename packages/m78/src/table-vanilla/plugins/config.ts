import { TablePlugin } from "../plugin.js";
import {
  TableConfig,
  TableConfigCanNotChanges,
  TableReloadLevel,
} from "../types.js";
import { isBoolean, isEmpty, omit } from "@m78/utils";
import { _configCanNotChange, _level2ConfigKeys } from "../common.js";

export class _TableConfigPlugin extends TablePlugin {
  init() {
    this.methodMapper(this.table, [["handleConfigChange", "config"]]);
  }

  handleConfigChange = (
    config?: Omit<Partial<TableConfig>, TableConfigCanNotChanges>,
    keepPosition?: boolean
  ): void | TableConfig => {
    if (!config) {
      return this.config;
    }

    const nConf = omit(config, _configCanNotChange as any);

    if (isEmpty(nConf)) return;

    let level = TableReloadLevel.base;

    const hasLevel2Conf = Object.keys(nConf).some((key) => {
      return _level2ConfigKeys.includes(key as any);
    });

    if (hasLevel2Conf) {
      level = TableReloadLevel.full;
    }

    Object.assign(this.config, nConf);

    console.log(level, hasLevel2Conf, nConf);

    this.table.reload({
      keepPosition: isBoolean(keepPosition)
        ? keepPosition
        : level !== TableReloadLevel.full,
      level,
    });
  };
}
