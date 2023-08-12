import { OverlayProps } from "./types.js";
/**
 * overlay抽象了所有弹层类组件(modal, drawer, popper等需要的基础能力), 使实现这些组件变得非常的简单
 * */
export declare function _Overlay(p: OverlayProps): JSX.Element;
export declare namespace _Overlay {
    var displayName: string;
    var defaultProps: {
        namespace: string;
        transitionType: import("../index.js").TransitionType;
        zIndex: number;
        clickAwayClosable: boolean;
        clickAwayQueue: boolean;
        lockScroll: boolean;
        arrowSize: number[];
        offset: number;
        triggerType: import("../trigger/types.js").TriggerType;
        autoFocus: boolean;
    };
}
//# sourceMappingURL=overlay.d.ts.map