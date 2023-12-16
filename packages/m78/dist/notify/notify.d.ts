import React from "react";
import { LoadingOption, NotifyProps, NotifyState } from "./types.js";
/**
 * 容器, 分类不同方向的notify并在对应方向渲染
 * */
export declare function _NotifyWrap({ children }: {
    children: JSX.Element[];
}): (0 | React.JSX.Element)[];
/**
 * 实现组件
 * */
export declare function notify(props: NotifyProps): React.JSX.Element;
/** 创建api */
export declare const _notify: import("@m78/render-api").RenderApiInstance<NotifyState, null>;
/** 简单的loading实现 */
export declare function _loading(content: React.ReactNode, opt?: LoadingOption): never;
export declare const _quickers: {
    quicker: import("./types.js").NotifyQuicker;
    info: import("./types.js").NotifyQuicker;
    error: import("./types.js").NotifyQuicker;
    success: import("./types.js").NotifyQuicker;
    warning: import("./types.js").NotifyQuicker;
};
//# sourceMappingURL=notify.d.ts.map