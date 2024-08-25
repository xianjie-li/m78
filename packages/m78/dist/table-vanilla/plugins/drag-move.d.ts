import { TablePlugin } from "../plugin.js";
import { DragScroll as PhysicalScroll } from "@m78/animate-tools";
/** 拖拽滚动相关功能支持 */
export declare class _TableDragMovePlugin extends TablePlugin implements TableDragMove {
    ps: PhysicalScroll;
    private enable;
    beforeInit(): void;
    mounted(): void;
    beforeDestroy(): void;
    isDragMoveEnable(): boolean;
    setDragMoveEnable(enable: boolean): void;
    /** 事件过滤 */
    private triggerFilter;
}
export interface TableDragMove {
    /** 拖拽移动是否启用 */
    isDragMoveEnable(): boolean;
    /** 设置拖拽移动启用状态 */
    setDragMoveEnable(enable: boolean): void;
}
//# sourceMappingURL=drag-move.d.ts.map