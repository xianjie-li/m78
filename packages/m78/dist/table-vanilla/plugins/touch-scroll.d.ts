import { TablePlugin } from "../plugin.js";
import { PhysicalScroll, PhysicalScrollEvent } from "@m78/utils";
/** 将touch事件模拟为滚动 */
export declare class _TableTouchScrollPlugin extends TablePlugin {
    ps: PhysicalScroll;
    mounted(): void;
    beforeDestroy(): void;
    /** 事件过滤 */
    triggerFilter: (e: PhysicalScrollEvent) => true | undefined;
}
//# sourceMappingURL=touch-scroll.d.ts.map