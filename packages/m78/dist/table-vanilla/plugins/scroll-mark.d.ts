import { TablePlugin } from "../plugin.js";
export declare class _TableScrollMarkPlugin extends TablePlugin {
    /** 容器 */
    wrapNode: HTMLDivElement;
    tEl: HTMLDivElement;
    rEl: HTMLDivElement;
    bEl: HTMLDivElement;
    lEl: HTMLDivElement;
    mount(): void;
    beforeDestroy(): void;
    rendering(): void;
    reload(): void;
    /** 可见性更新 */
    updateVisible: () => void;
    /** 位置尺寸更新 */
    updateBound(): void;
}
//# sourceMappingURL=scroll-mark.d.ts.map