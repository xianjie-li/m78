/** implement action history */
export declare class ActionHistory {
    /** 最大记录长度 */
    maxLength: number;
    /** 操作历史 */
    private history;
    /** 当前所在记录游标 */
    private cursor;
    /** 执行一项操作并推入历史, 若后方有其他操作历史, 将全部移除 */
    redo(action: ActionHistoryItem): void;
    /** 重做一项操作 */
    redo(): void;
    /** 撤销一项操作 */
    undo(): void;
    reset(): void;
}
export interface ActionHistoryItem {
    /** 执行操作 */
    redo(): void;
    /** 重做 */
    undo(): void;
}
//# sourceMappingURL=action-history.d.ts.map