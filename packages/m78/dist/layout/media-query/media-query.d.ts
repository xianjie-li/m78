/// <reference types="react" />
import { MediaQueryListenerProps, MediaQueryProps } from "./types.js";
/**
 * 窗口尺寸改变时通过回调通知
 * */
export declare function _MediaQueryListener({ onChange }: MediaQueryListenerProps): null;
export declare namespace _MediaQueryListener {
    var displayName: string;
}
/**
 * 窗口尺寸改变时通过回调通知传入子项帮助渲染
 * */
export declare function _MediaQuery<Val>(conf: MediaQueryProps<Val>): import("react").ReactElement<any, any> | null;
export declare namespace _MediaQuery {
    var displayName: string;
}
//# sourceMappingURL=media-query.d.ts.map