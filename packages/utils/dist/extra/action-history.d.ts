/** implement action history */
export declare class ActionHistory {
    /** 最大记录长度 */
    maxLength: number;
    /** 操作历史 */
    private history;
    /** 当前所在记录游标 */
    private cursor;
    /** 正在执行redo(action)操作 */
    private isDoing;
    /** 正在执行undo()操作 */
    private isUndoing;
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
    /** 重置历史 */
    reset(): void;
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