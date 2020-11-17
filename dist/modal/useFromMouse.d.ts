import { useMethods } from './methods';
import { Share } from './types';
/** ======== fromMouse实现 ======== */
export declare function useFromMouse(share: Share, methods: ReturnType<typeof useMethods>, isFromMouse: boolean): readonly [{
    x: import("@react-spring/core").SpringValue<number>;
    y: import("@react-spring/core").SpringValue<number>;
    scale: import("@react-spring/core").SpringValue<number>;
    opacity: import("@react-spring/core").SpringValue<number>;
}, boolean];
