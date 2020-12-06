import { UseScrollMeta } from '@lxjx/hooks';
import { Share, TabItemProps } from './type';
export declare function useMethods(share: Share): {
    refreshItemLine: (_index: number) => void;
    refreshScrollFlag: (meta: UseScrollMeta, tabsEl: NodeListOf<HTMLDivElement>, _index: number) => void;
    hasScroll: (meta: UseScrollMeta) => boolean;
    onTabClick: (itemProps: TabItemProps, _index: number) => void;
    onScroll: (meta: UseScrollMeta) => void;
    scrollNext: () => void;
    scrollPrev: () => void;
};
