import { MediaQueryConf, MediaQueryMeta, MediaQueryListenerProps, _MediaQueryBaseConf } from "./types";
/**
 * 窗口尺寸改变时通过回调通知传入子项帮助渲染
 * */
export declare function _useMediaQuery<Val = any>(conf?: MediaQueryConf<Val>): {
    meta: MediaQueryMeta | null;
    value: Val | undefined;
};
/**
 * 窗口尺寸改变时通过监听器通知
 * */
export declare function _useMediaQueryListener(onChange: MediaQueryListenerProps["onChange"], conf?: _MediaQueryBaseConf): void;
//# sourceMappingURL=hooks.d.ts.map