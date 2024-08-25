import { _MixinBase } from "./base.js";
import { TableDataLists } from "./types.js";
import { TableKey } from "../../types/base-type.js";
import { _MixinStatus } from "./status.js";
import { TableRow } from "../../types/items.js";
import { _MixinSchema } from "./schema.js";
export interface _MixinData extends _MixinBase, _MixinStatus, _MixinSchema {
}
export declare class _MixinData {
    getData(): Promise<TableDataLists>;
    innerGetData(cb?: (i: any, k: TableKey, status: {
        add: boolean;
        change: boolean;
        update: boolean;
    }) => Promise<void | false | 0>): Promise<TableDataLists | null>;
    /** 遍历所有数据(不包含fake/软删除数据)并返回其clone版本
     *
     * - 若cb返回false则跳过并将该条数据从返回list中过滤, 返回0时, 停止遍历, 返回已遍历的值
     * - 数据会对invalid的值进行移除处理, 可通过 handleInvalid 控制
     * */
    eachData(cb: (i: any, k: TableKey, status: {
        add: boolean;
        change: boolean;
        update: boolean;
    }) => Promise<void | false | 0>, handleInvalid?: boolean): Promise<any[]>;
    getFmtData(row: TableRow | TableKey, data: any): any;
}
//# sourceMappingURL=data.d.ts.map