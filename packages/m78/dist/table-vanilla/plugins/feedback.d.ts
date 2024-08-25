import { TablePlugin } from "../plugin.js";
import { _TableFormPlugin } from "./form/form.js";
import { TriggerListener } from "@m78/trigger";
import { TableCell } from "../types/items.js";
import { BoundSize } from "@m78/utils";
import { TableMutationEvent } from "./mutation.js";
/** 提供对某些表格元素的交互反馈, 比如单元格包含错误信息或内容超出时, 在选中后为其提供反馈 */
export declare class _TableFeedbackPlugin extends TablePlugin {
    form: InstanceType<typeof _TableFormPlugin>;
    lastEvent: TableFeedbackEvent[] | null;
    lastTime: number;
    /** mutation value change 提交延迟计时器 */
    valueChangeTimer: any;
    targetUniqueKey: string;
    initialized(): void;
    beforeDestroy(): void;
    rendered(): void;
    renderedDebounce: import("lodash").DebouncedFunc<() => void>;
    emitClose(): void;
    scroll: () => void;
    cellChange: (cells?: TableCell[]) => void;
    mutationHandle: (event: TableMutationEvent) => void;
    headerTriggerHandle: TriggerListener;
    updateHeaderTriggerTargets(): void;
    private getEventOption;
    isCellOverflow(cell: TableCell): boolean;
}
/** event.feedback的触发类型 */
export declare enum TableFeedback {
    /** 内容溢出 */
    overflow = "overflow",
    /** 错误 */
    error = "error",
    /** 禁用项 */
    disable = "disable",
    /** 常规提醒 */
    regular = "regular",
    /** 关闭 */
    close = "close"
}
export interface TableFeedbackEvent {
    /** 触发反馈的类型 */
    type: TableFeedback;
    /** 反馈的内容 */
    text: string;
    /** 触发反馈的单元格 */
    cell?: TableCell;
    /** 触发反馈的目标dom */
    dom?: HTMLElement;
    /** 触发反馈的虚拟位置 */
    bound?: BoundSize;
}
//# sourceMappingURL=feedback.d.ts.map