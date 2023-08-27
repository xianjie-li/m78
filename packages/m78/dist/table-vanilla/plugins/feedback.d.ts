/// <reference types="lodash" />
import { TablePlugin } from "../plugin.js";
import { _TableFormPlugin } from "./form.js";
import { TableFeedbackEvent } from "./event.js";
import { TriggerInstance, TriggerListener } from "../../trigger/index.js";
import { TableCell } from "../types/items.js";
/** 提供对某些表格元素的交互反馈, 比如单元格包含错误信息或内容超出时, 在选中后为其提供反馈 */
export declare class _TableFeedbackPlugin extends TablePlugin {
    form: _TableFormPlugin;
    lastEvent: TableFeedbackEvent[] | null;
    headerTrigger: TriggerInstance;
    initialized(): void;
    beforeDestroy(): void;
    rendered(): void;
    emitClose(): void;
    renderedDebounce: import("lodash").DebouncedFunc<() => void>;
    scroll: () => void;
    cellChange: () => void;
    headerTriggerHandle: TriggerListener;
    updateHeaderTriggerTargets(): void;
    isCellOverflow(cell: TableCell): boolean;
}
//# sourceMappingURL=feedback.d.ts.map