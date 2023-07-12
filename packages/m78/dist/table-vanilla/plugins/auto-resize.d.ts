import ResizeObserver from "resize-observer-polyfill";
import { TablePlugin } from "../plugin.js";
export declare class _TableAutoResizePlugin extends TablePlugin {
    ob: ResizeObserver;
    isFirst: boolean;
    mount(): void;
    beforeDestroy(): void;
    handleResize: ResizeObserverCallback;
}
//# sourceMappingURL=auto-resize.d.ts.map