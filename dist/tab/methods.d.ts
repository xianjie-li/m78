import { Share, TabItemProps } from './type';
export declare function useMethods(share: Share): {
    refreshItemLine: (index: number) => void;
    refreshScrollFlag: (meta: import("@lxjx/hooks").UseScrollMeta, tabsEl: NodeListOf<HTMLDivElement>, index: number) => void;
    hasScroll: (meta: import("@lxjx/hooks").UseScrollMeta) => boolean;
    onTabClick: (itemProps: TabItemProps, index: number) => void;
    onScroll: (meta: import("@lxjx/hooks").UseScrollMeta) => void;
    scrollNext: () => void;
    scrollPrev: () => void;
};
