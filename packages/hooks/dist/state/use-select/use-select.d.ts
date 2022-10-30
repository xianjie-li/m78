import { SelectManager, SelectManagerOption, SelectManagerValue } from "./select-manager";
/**
 * 用于列表的选中项管理, 内置了对于超大数据量的优化(用于m78组件的tree等组件高性能管理选中/展开等)
 * - 具体api见SelectManager
 * - 注意, 由于会实时读取list并更新选中状态, option.list不能传入字面量, 否则会导致递归渲染
 * */
export declare function useSelect<Item = SelectManagerValue>(option: SelectManagerOption<Item>): SelectManager<Item>;
//# sourceMappingURL=use-select.d.ts.map