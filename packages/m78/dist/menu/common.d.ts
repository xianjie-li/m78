import { _FlatMap, MenuOption } from "./types.js";
import { DataSourceItemCustom, ValueType } from "../common/index.js";
/** 获取树列表及其所有子项的value */
export declare function _getOptionAllValues(options: MenuOption[], cus?: DataSourceItemCustom): ValueType[];
/**
 * 铺平选项并生成易于查询的结构
 * */
export declare function _flatOptions(options: MenuOption[], cus?: DataSourceItemCustom): _FlatMap;
//# sourceMappingURL=common.d.ts.map