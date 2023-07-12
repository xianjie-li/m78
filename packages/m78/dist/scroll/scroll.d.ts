import { ScrollProps } from "./types.js";
/**
 * 下拉卡主
 * 鼠标放到滚动条位置时显示滚动条
 * 滚动条偶尔不自动隐藏, 显示逻辑优化
 * */
export declare const _Scroll: {
    (p: ScrollProps): JSX.Element;
    displayName: string;
    defaultProps: {
        direction: import("./types.js").ScrollDirection;
        scrollbar: boolean;
        scrollIndicator: boolean;
        pullDownIndicatorRotate: boolean;
        pullUpTriggerRatio: number;
    };
};
//# sourceMappingURL=scroll.d.ts.map