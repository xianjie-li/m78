import { TablePlugin } from "../plugin.js";
export declare class _TableAutoResizePlugin extends TablePlugin {
    ob: ResizeObserver;
    isFirst: boolean;
    mounted(): void;
    beforeDestroy(): void;
    handleResize: ResizeObserverCallback;
}
//# sourceMappingURL=auto-resize.d.ts.map