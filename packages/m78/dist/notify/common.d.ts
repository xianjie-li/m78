import { _Share, NotifyPositionUnion, NotifyQuicker, NotifyState } from "./types.js";
/**
 * 一个事件, 用于实现interactive, pos表示触发事件的notify类型, isIn表示是开始触发还是结束触发
 * */
export declare const _interactiveEvent: import("@m78/hooks").CustomEventWithHook<(pos: NotifyPositionUnion, isIn: boolean) => void>;
/** 初始动画值 */
export declare const _initTransition: {
    height: number;
    process: number;
    opacity: number;
    transform: string;
    config: {
        readonly tension: 210;
        readonly friction: 20;
    };
};
/**
 * 添加交互行为, 在聚焦时防止带延迟的同位置notify隐藏
 * */
export declare function _useInteractive(share: _Share): {
    start: () => void;
    stop: () => void;
};
/**
 * 根据是否开启了关闭按钮动态设置偏移和边距, 防止关闭按钮遮挡文字
 * */
export declare function _useFixPad({ props, bound }: _Share): readonly [{
    readonly title: {
        paddingRight: string;
    };
    readonly cont: {
        paddingRight: string;
    } | undefined;
}, {
    top: string;
} | undefined];
/**
 *
 * */
export declare function _useToggleController(share: _Share): boolean;
export declare function _notifyQuickerBuilder(status?: NotifyState["status"]): NotifyQuicker;
//# sourceMappingURL=common.d.ts.map