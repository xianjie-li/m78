import { TablePlugin } from "../plugin.js";
import { isBoolean, isEmpty, omit } from "@m78/utils";
import { TableConfig } from "../types/config.js";
import { TableReloadLevel } from "./life.js";

/** 重置级别full的所有配置, 未在其中的所有配置默认为index级别 */
export const levelFullConfigKeys: (keyof TableConfig)[] = [
  "data",
  "columns",
  "rows",
  "cells",
];

/** 不能通过table.setConfig()变更的配置 */
const configCanNotChange = [
  "el",
  "primaryKey",
  "plugins",
  "viewEl",
  "viewContentEl",
  "eventCreator",
] as const;

type TableConfigCanNotChanges = typeof configCanNotChange[number];

export class _TableConfigPlugin
  extends TablePlugin
  implements TableConfigInstance
{
  beforeInit() {
    this.methodMapper(this.table, ["setConfig", "getConfig"]);
  }

  getConfig = (): TableConfig => {
    return this.config;
  };

  setConfig = (
    config?: Omit<Partial<TableConfig>, TableConfigCanNotChanges>,
    keepPosition?: boolean
  ): void | TableConfig => {
    if (!config) {
      return this.config;
    }

    const nConf = omit(config, configCanNotChange as any);

    if (isEmpty(nConf)) return;

    let level = TableReloadLevel.index;

    const hasLevel2Conf = Object.keys(nConf).some((key) => {
      return levelFullConfigKeys.includes(key as any);
    });

    if (hasLevel2Conf) {
      level = TableReloadLevel.full;
    }

    const changeKeys = Object.keys(nConf);
    const changeExist: any = {};

    Object.assign(this.config, nConf);

    changeKeys.forEach((k) => (changeExist[k] = true));

    this.table.event.configChange.emit(changeKeys, (k) => {
      return !!changeExist[k];
    });

    this.table.reload({
      keepPosition: isBoolean(keepPosition)
        ? keepPosition
        : level !== TableReloadLevel.full,
      level,
    });
  };
}

export interface TableConfigInstance {
  /** 获取当前配置 */
  getConfig(): TableConfig;

  /**
   * 更改配置, 可单个或批量更改配置, 配置更新后会自动reload()
   * - 可传入keepPosition保持当前滚动位置
   * - 此外, 每调用只应传入发生变更的配置项, 因为不同的配置有不同的重置级别, 某些配置只需要部分更新, 而另一些则需要完全更新
   *
   * 会完全重置表格的配置: ["data", "columns", "rows", "cells"]
   *
   * 不能更新的配置: ["el", "primaryKey", "plugins", "viewEl", "viewContentEl", "eventCreator"]
   *
   * ## example
   * ```ts
   * table.config({ rowHeight: 40, columnWidth: 150 }); // 批量更改
   * table.config({ rowHeight: 40 }); // 单个更改
   * ```
   * */
  setConfig(
    config: Omit<Partial<TableConfig>, TableConfigCanNotChanges>,
    keepPosition?: boolean
  ): void;
}
