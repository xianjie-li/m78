import { useMethods } from './methods';
import { Share } from './types';
/** ======== fromMouse实现 ======== */
export declare function useFromMouse(share: Share, methods: ReturnType<typeof useMethods>, isFromMouse: boolean): (boolean | import("react-spring").AnimatedValue<Pick<{
    x: number;
    y: number;
    scale: string | number | undefined;
    opacity: string | number | undefined;
}, "x" | "y" | "opacity" | "scale">>)[];
