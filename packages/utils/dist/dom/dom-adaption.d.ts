export interface DomAdaptionConfig {
    /** 需要自适应的dom元素 */
    el: HTMLElement;
    /** 1920 | 设计图宽度 */
    designWidth?: number;
    /** 1080 | 设计图高度 */
    designHeight?: number;
    /** 是否保证宽高比例（为false时在设计图宽高比与屏幕不同的情况下会出现变形） */
    keepRatio?: boolean;
}
/**
 *  缩放指定dom以兼容屏幕尺寸
 *  缩放比换算公式: 页面实际尺寸 / 设计图尺寸
 *  */
export declare function domAdaption(config: DomAdaptionConfig): () => void;
//# sourceMappingURL=dom-adaption.d.ts.map