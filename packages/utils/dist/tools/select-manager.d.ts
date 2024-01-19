import { CustomEvent } from "../lang.js";
/** 创建配置 */
export interface SelectManagerOption<Item = any, Opt = any> {
    /** 选项列表 */
    list: Opt[];
    /**
     * 控制如何从list的每一项中获取到value, value具有以下限制:
     * - 作为是否选中的标识, 其必须唯一
     * - 必须是字符串或数值
     * */
    valueMapper?: string | ((i: Opt) => Item);
}
/** 选中状态 */
export interface SelectManagerSelectedState<Item = any, Opt = any> {
    /** 当前选中项, 包含strangeSelected */
    selected: Item[];
    /** 选中项的原始选项, 包含strangeSelected */
    originalSelected: Opt[];
    /** 不存在于option.list的选中项 */
    strangeSelected: Item[];
    /** 不包含strangeSelected的选中项 */
    realSelected: Item[];
}
/**
 * 用于列表的选中项管理, 内置了对于超大数据量的优化
 *
 * - 怪异选中, 如果选中了list中不存在的选项, 称为怪异选中, 可以通过 selected.strangeSelected 访问这些选项, 存在此行为时, 以下api行为需要注意:
 * partialSelected / allSelected 仅检测list中存在的项
 * selectAll / toggleAll 仅选中list中存在的选项
 * */
export declare class SelectManager<Item = any, Opt = any> {
    #private;
    /** 选中值变更时触发的事件 */
    changeEvent: CustomEvent<VoidFunction>;
    readonly option: SelectManagerOption<Item>;
    constructor(option?: SelectManagerOption<Item>);
    /** 从list项中获取值(根据valueMapper) */
    getValueByItem(i: any): Item;
    /** 值是否在list中存在 */
    isWithinList(val: Item): boolean;
    /** 检测值是否被选中 */
    isSelected(val: Item): boolean;
    /** 当前选中项的信息 */
    getState(): SelectManagerSelectedState<Item, Opt>;
    /** list中部分值被选中, 不计入strangeSelected */
    get partialSelected(): boolean;
    /** 当前list中的选项是否全部选中, 不计入strangeSelected */
    get allSelected(): boolean;
    /** 重新设置option.list */
    setList(list: Opt[]): void;
    /** 选中传入的值 */
    select(val: Item): void;
    /** 取消选中传入的值 */
    unSelect(val: Item): void;
    /** 选择全部值 */
    selectAll(): void;
    /** 取消选中所有值 */
    unSelectAll(): void;
    /** 反选值 */
    toggle(val: Item): void;
    /** 反选所有值 */
    toggleAll(): void;
    /** 一次性设置所有选中的值 */
    setAllSelected(next: Item[]): void;
    /** 设置指定值的选中状态 */
    setSelected(val: Item, isSelect: boolean): void;
    /** 一次选中多个选项 */
    selectList(selectList: Item[]): void;
    /** 以列表的形式移除选中项 */
    unSelectList(selectList: Item[]): void;
    /** 是否选中了值 */
    hasSelected(): boolean;
}
//# sourceMappingURL=select-manager.d.ts.map