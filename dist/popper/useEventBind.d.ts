import { Share } from './types';
import { useMethods } from './useMethods';
/** 绑定事件，由于要支持不同的target类型，所以一律使用原生api进行绑定 */
export declare function useEventBind(share: Share, methods: ReturnType<typeof useMethods>): {
    mouseEnterHandle: () => void;
    mouseLeaveHandle: () => void;
};
