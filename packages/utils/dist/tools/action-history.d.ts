import { EmptyFunction } from "../types.js";
/** implement action history */
export declare class ActionHistory {
    /** 最大记录长度 */
    maxLength: number;
    /** 操作历史 */
    private history;
    /** 当前所在记录游标, -1表示初始状态 */
    private cursor;
    /** 正在执行redo(action)操作 */
    private isDoing;
    /** 正在执行undo()操作 */
    private isUndoing;
    /** batch操作期间缓冲的所有action */
    private batchActionList;
    /** 为true期间不计入历史记录 */
    private ignoreFlag;
    /**
     * 执行一项操作并推入历史, 若后方有其他操作历史, 将全部移除.
     *
     * 在redo(action)执行期间内执行的redo(action)会被当前action合并为单个
     * */
    redo(action: ActionHistoryItem): void;
    /** 重做一项操作 */
    redo(): void;
    /**
     * 撤销一项操作
     *
     * 在undo()执行期间内执行的redo(action)会被合并undo操作并且不计入历史
     * */
    undo(): void;
    /**
     * 批量执行, 在action内执行的所有redo(action)操作都会被合并为单个
     * */
    batch(action: EmptyFunction): void;
    /**
     * 使action期间的所有redo(action)操作不计入历史, 需要自行保证这些被忽略的操作不会影响历史还原或重做
     * */
    ignore(action: EmptyFunction): void;
    /** 重置历史 */
    reset(): void;
    /** 获取下一条记录 */
    getNext(): ActionHistoryItem | null;
    /** 获取前一条记录 */
    getPrev(): ActionHistoryItem | null;
}
export interface ActionHistoryItem {
    /** 操作名, 可用于提供更友好的提示, 比如撤销编辑, 重做编辑等 */
    title?: string;
    /** 执行操作 */
    redo(): void;
    /** 重做 */
    undo(): void;
}
//# sourceMappingURL=action-history.d.ts.map