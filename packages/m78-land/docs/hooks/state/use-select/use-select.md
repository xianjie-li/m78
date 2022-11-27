---
title: useSelect
---

# useSelect

用于列表的选中项管理, 内置了对于超大数据量的优化

## 示例

`useSelect(option)`会根据选项创建一个`SelectManager`实例并返回, 通过实例可以便捷的进行选中管理, 如: 选中值, 取消选中, 反选, 选中多个值, 获取选中状态等

<demo demo={require("./use-select.demo.tsx")} code={require("!!raw-loader!./use-select.demo.tsx")}></demo>


## API

**概览:**

<br/>

**签名**

`const select = useSelect<Item>(option)`

`Item` - 选项类型, 默认为字符串或数字, 你也可以传入复杂的结构类型, 并通过`option.valueMapper`控制如何从这个类型中取到值

`option` - 配置, `SelectManagerOption` 类型

`select` - 一个 `SelectManager` 实例

<br/>


**关联API**

```ts
/** 可用的选中值类型 */
export type SelectManagerValue = string | number;

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
class SelectManager {
  /** 选中值变更时触发的事件 */
  changeEvent: CustomEvent<VoidFunction>;
  /** 传入的配置 */
  option: SelectManagerOption<Item>;
  /** 从list项中获取值(根据valueMapper) */
  getValueByItem(i: Item): SelectManagerValue;
  /** 值是否在list中存在 */
  isWithinList(val: SelectManagerValue): boolean;
  /** 检测值是否被选中 */
  isSelected(val: SelectManagerValue): boolean;
  /** 当前选中项的信息 */
  state(): SelectManagerSelectedMeta<Item>;
  /** list中部分值被选中, 不计入strangeSelected */
  partialSelected(): boolean;
  /** 当前list中的选项是否全部选中, 不计入strangeSelected */
  allSelected(): boolean;
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
```
