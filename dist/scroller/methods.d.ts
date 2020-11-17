import { UseScrollMeta } from '@lxjx/hooks';
import { SetDragPosArg, Share } from './types';
export declare function useMethods(share: Share): {
    setDragPos: ({ isVertical, dey, dex, touchTop, touchLeft, touchBottom, touchRight, }: SetDragPosArg) => void;
    scrollHandle: (meta: UseScrollMeta) => void;
    refreshScrollFlag: () => void;
    hasScroll: (type: 'x' | 'y') => boolean;
    getScrollWidth: () => void;
    pullDownHandler: ({ down }: {
        down: boolean;
    }) => true | undefined;
    getPullDownText: () => string;
    getPullUpText: () => string;
    isPullUpIng: () => boolean;
    triggerPullDown: () => void;
    triggerPullUp: (isRefresh?: boolean | undefined) => void;
    slidePrev: () => void;
    slideNext: () => void;
};
