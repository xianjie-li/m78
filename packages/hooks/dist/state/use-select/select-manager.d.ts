import { CustomEvent } from "@m78/utils";
/** 可用的选中值类型 */
export declare type SelectManagerValue = string | number;
/** 创建配置 */
export interface SelectManagerOption<Item = SelectManagerValue> {
    /** 选项列表 */
    list: Item[];
    /**
     * 控制如何从list的每一项中获取到value, value具有以下限制:
     * - 作为是否选中的标识, 其必须唯一
     * - 必须是字符串或数值
     * */
    valueMapper?: string | ((i: Item) => SelectManagerValue);
}
/** 选中状态 */
export interface SelectManagerSelectedState<Item = SelectManagerValue> {
    /** 当前选中项的值, 包含strangeSelected */
    selected: SelectManagerValue[];
    /** 选中项的原始选项, 包含strangeSelected */
    originalSelected: Item[];
    /** 不存在于option.list的选中项 */
    strangeSelected: SelectManagerValue[];
    /** 选中且list中包含的选项, 相当于 selected - strangeSelected */
    realSelected: SelectManagerValue[];
}
/**
 * 用于列表的选中项管理, 内置了对于超大数据量的优化
 *
 * - 怪异选中, 如果选中了list中不存在的选项, 称为怪异选中, 可以通过 selected.strangeSelected 访问这些选项, 存在此行为时, 以下api行为需要注意:
 * partialSelected / allSelected 仅检测list中存在的权限
 * selectAll / toggleAll 仅选中list中存在的选项
 * */
export declare class SelectManager<Item = SelectManagerValue> {
    #private;
    readonly option: SelectManagerOption<Item>;
    /** 选中值变更时触发的事件 */
    changeEvent: CustomEvent<VoidFunction>;
    constructor(option: SelectManagerOption<Item>);
    /** 从list项中获取值(根据valueMapper) */
    getValueByItem(i: Item): SelectManagerValue;
    /** 值是否在list中存在 */
    isWithinList(val: SelectManagerValue): boolean;
    /** 检测值是否被选中 */
    isSelected(val: SelectManagerValue): boolean;
    /**
     * 当前选中项的信息
     *
     * 对于性能很敏感的代码, 获取state并存储相比多次调用有更好的性能
     * ```
     *  ✅
     *  const state = select.state;
     *  state.selected
     *  state.originalSelected
     *  ❌
     *  select.state.selected;
     *  select.state.originalSelected;
     * ```
     * */
    get state(): SelectManagerSelectedState<Item>;
    /** list中部分值被选中, 不计入strangeSelected */
    get partialSelected(): boolean;
    /** 当前list中的选项是否全部选中, 不计入strangeSelected */
    get allSelected(): boolean;
    /** 重新设置option.list */
    setList(list: Item[]): void;
    /** 选中传入的值 */
    select(val: SelectManagerValue): void;
    /** 取消选中传入的值 */
    unSelect(val: SelectManagerValue): void;
    /** 选择全部值 */
    selectAll(): void;
    /** 取消选中所有值 */
    unSelectAll(): void;
    /** 反选值 */
    toggle(val: SelectManagerValue): void;
    /** 反选所有值 */
    toggleAll(): void;
    /** 一次性设置所有选中的值 */
    setAllSelected(next: SelectManagerValue[]): void;
    /** 设置指定值的选中状态 */
    setSelected(val: SelectManagerValue, isSelect: boolean): void;
    /** 一次选中多个选项 */
    selectList(selectList: SelectManagerValue[]): void;
    /** 以列表的形式移除选中项 */
    unSelectList(selectList: SelectManagerValue[]): void;
}
//# sourceMappingURL=select-manager.d.ts.map