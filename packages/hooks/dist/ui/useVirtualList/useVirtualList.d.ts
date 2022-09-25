import { RefObject } from "react";
export interface VirtualListOption<Item> {
    /** 需要进行虚拟滚动的列表 */
    list: Item[];
    /** 每项的尺寸 */
    size: number | ((item: Item, index: number) => number);
    /** 1 | 滚动区域两侧预渲染的节点数 */
    overscan?: number;
    /**
     * 项的唯一key, 建议始终明确的指定key, 除非:
     * - 列表永远不会排序或更改
     * - 不需要使用keepAlive等高级特性
     * */
    key?: (item: Item, index: number) => string;
    /** 返回true的项将始终被渲染 */
    keepAlive?: (item: Item, index: number) => boolean;
    /** 一个可选配置，默认情况下，高度从containerTarget获取，如果containerTarget没有实际高度或需要实现"最大高度"效果时，使用此配置 */
    height?: number;
    /** 是否禁用, 禁用时list为[]且不监听任何事件 */
    disabled?: boolean;
    /** 预留空间, 需要插入其他节点到列表上/下方时传入此项，值为插入内容的总高度 */
    space?: number;
    /** 当有一个已存在的ref或html时，用来代替returns.containerRef获取滚动容器 */
    containerTarget?: HTMLElement | RefObject<HTMLElement>;
    /** 当有一个已存在的ref或html时，用来代替用来代替returns.wrapRef获取包裹容器 */
    wrapRef?: HTMLElement | RefObject<HTMLElement>;
}
export declare type VirtualList<Item> = {
    /** 该项索引 */
    index: number;
    /** 该项的key, 如果未配置key(), 则等于index */
    key: string;
    /** 该项的数据 */
    data: Item;
    /** 应该应位于的位置 */
    position: number;
    /** 改项的尺寸 */
    size: number;
}[];
interface State<Item> {
    /** 虚拟列表 */
    list: VirtualList<Item>;
    /** 是否处于滚动状态中 */
    scrolling: boolean;
}
export interface VirtualListRenderProps<Item> {
    children: (state: State<Item>) => JSX.Element | any;
}
export declare function useVirtualList<Item = any>(option: VirtualListOption<Item>): {
    containerRef: RefObject<any>;
    wrapRef: import("react").MutableRefObject<any>;
    Render: ({ children }: VirtualListRenderProps<Item>) => any;
};
export {};
//# sourceMappingURL=useVirtualList.d.ts.map