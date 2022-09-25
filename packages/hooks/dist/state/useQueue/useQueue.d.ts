import { AnyObject } from "@m78/utils";
declare type IDType = string | number;
interface UseQueueConfig<ItemOption> {
    /** 初始列表 */
    list?: (ItemOption & UseQueueItem)[];
    /** 默认项配置 */
    defaultItemOption?: Partial<ItemOption & UseQueueItem>;
    /** 是否默认为手动模式 */
    defaultManual?: boolean;
    /** 每次current变更时触发 */
    onChange?: (current?: ItemOption & UseQueueItem) => void;
}
interface UseQueueItem {
    /** 自动模式时，如果传入此项，会在此延迟(ms)后自动切换到下一项 */
    duration?: number;
    /** 唯一id，如果未传入会由内部自动生成一个随机id */
    id?: IDType;
}
interface UseQueueItemWidthId extends UseQueueItem {
    id: IDType;
}
declare function useQueue<Item extends AnyObject = {}>({ defaultItemOption, list, defaultManual, onChange, }?: UseQueueConfig<Item>): {
    push: (opt: (Item & UseQueueItem) | (Item & UseQueueItem)[]) => void;
    prev: () => void;
    next: () => void;
    jump: (id: IDType) => void;
    hasNext: (id?: IDType) => boolean;
    hasPrev: (id?: IDType) => boolean;
    clear: () => void;
    findIndexById: (id: IDType) => number;
    isManual: boolean;
    current: (Item & UseQueueItemWidthId) | null;
    auto: () => void;
    manual: () => void;
    list: (Item & UseQueueItemWidthId)[];
    leftList: (Item & UseQueueItemWidthId)[];
    rightList: (Item & UseQueueItemWidthId)[];
    index: number | null;
    remove: (id: IDType | IDType[]) => void;
};
export { useQueue, UseQueueConfig, UseQueueItem };
//# sourceMappingURL=useQueue.d.ts.map