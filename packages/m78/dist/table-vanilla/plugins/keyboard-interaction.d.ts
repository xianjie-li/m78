import { TablePlugin } from "../plugin.js";
import { TableCell } from "../types/items.js";
import { EmptyFunction, KeyboardMultipleHelper } from "@m78/utils";
import { _TableInteractivePlugin } from "./interactive.js";
/** 集中处理不分键盘交互操作, 比如单元格复制/粘贴/delete等 */
export declare class _TableKeyboardInteractionPlugin extends TablePlugin {
    interactiveCore: _TableInteractivePlugin;
    multipleHelper: KeyboardMultipleHelper;
    beforeInit(): void;
    init(): void;
    mounted(): void;
    beforeDestroy(): void;
    paste(): void;
    copy(): void;
    private pasteImpl;
    private copyImpl;
    private getKeydownOptions;
    /** 粘贴 */
    private onPaste;
    /** 复制 */
    private onCopy;
    /** 删除 */
    private onDelete;
    /** 撤销 */
    private onUndo;
    /** 重做 */
    private onRedo;
    /** 各方向移动 */
    private onMove;
    /** 空格按下/放开 */
    private onSpace;
    /** 将指定字符串根据\t和\n解析为一个二维数组 */
    parse(str: string): string[][];
    /** 检测传入的str cell 和 cell 的二维数组是否行列数完全一致, 如果不一致, 返回错误文本 */
    checkAlign(strCell: string[][], cells: TableCell[][]): string;
    /** 获取首个常规单元格 */
    getFirstCell(): TableCell | undefined;
}
export interface TableKeyboardInteraction {
    /** 复制当前选中单元格到粘贴板 */
    copy: EmptyFunction;
    /** 粘贴当前粘贴板内容到选中单元格 */
    paste: EmptyFunction;
}
//# sourceMappingURL=keyboard-interaction.d.ts.map