---
title: CheckBox - 多选
group:
  title: 数据录入
  path: /form
---

# CheckBox 多选

基于[Check](/form/check)组件实现的上层组件，用于对一组选项中的一项或多项进行选择

## 示例

<code src="./demo.tsx" />

## props

**`props`**

参数用法与[Check](/form/check)基本一致

```ts
interface Item<Val> {
  label?: string;
  beforeLabel?: string;
  value: Val;
  disabled?: boolean;
}

export interface CheckBoxProps<Val> extends FormLike<Val[]> {
  /** 传递给原生组件 */
  name?: string;
  /** 禁用 */
  disabled?: boolean;
  /** 单行显示 */
  block?: boolean;
  /** 用于定制选框样式 */
  customer?: CheckCustom;
  /** 透传至Check组件的选项 */
  options: Array<Item<Val>>;
}
```

**`ref`**

```ts
interface UseCheckReturns<T, OPTION> {
  /** 部分值被选中 */
  partialChecked: boolean;
  /** 是否全部选中 */
  allChecked: boolean;
  /** 没有任何值被选中 */
  noneChecked: boolean;
  /** 被选中值, 存在collector时所有check项都会先走collector */
  checked: T[];
  /** 被选中的原始值，不走collector，未传collector时与check表现一致 */
  originalChecked: OPTION[];
  /** 检测值是否被选中 */
  isChecked: (val: T) => boolean;
  /** 检测值是否被禁用 */
  isDisabled: (val: T) => boolean;
  /** 选中传入的值 */
  check: (val: T) => void;
  /** 取消选中传入的值 */
  unCheck: (val: T) => void;
  /** 选择全部值 */
  checkAll: () => void;
  /** 取消选中所有值 */
  unCheckAll: () => void;
  /** 反选, 返回反选后的值 */
  toggle: (val: T) => boolean | undefined;
  /** 反选所有值 */
  toggleAll: () => void;
  /** 一次性设置所有选中的值, 不影响禁用项 */
  setChecked: (nextChecked: T[]) => void;
  /** 指定值并设置其选中状态 */
  setCheckBy: (val: T, isChecked: boolean) => void;
}
```
