import { useScroll } from '@lxjx/hooks';
import { Share, TabItemProps } from './type';
declare type ScrollMeta = ReturnType<ReturnType<typeof useScroll>['get']>;
export declare function useMethods(share: Share): {
    refreshItemLine: (index: number) => void;
    refreshScrollFlag: (meta: ScrollMeta, tabsEl: NodeListOf<HTMLDivElement>, index: number) => void;
    hasScroll: (meta: ScrollMeta) => boolean;
    onTabClick: (itemProps: TabItemProps, index: number) => void;
    onScroll: (meta: ScrollMeta) => void;
    scrollNext: () => void;
    scrollPrev: () => void;
};
export {};
