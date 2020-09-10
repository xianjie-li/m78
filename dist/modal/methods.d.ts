import { Share } from './types';
export declare function useMethods(share: Share): {
    maskShouldShow: () => boolean;
    shouldTriggerClose: () => boolean;
    calcPos: () => void;
    close: () => void;
    open: () => void;
    onTriggerNodeClick: (e: MouseEvent) => void;
};
