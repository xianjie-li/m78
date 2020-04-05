---
title: RadioBox - 单选
group:
  title: 数据录入
  path: /form
  order: 3000
---

# RadioBox 单选

基于[Check](/form/check)组件实现的上层组件，用于对一组选项中的某一项进行选择

## 示例

<code src="./demo.tsx" />

## props

**`RadioBox`**

参数用法与[Check](/form/check)基本一致

```tsx | pure
interface RadioBoxProps<Val> extends FormLike<Val> {
  /** 传递给原生组件 */
  name?: string;
  /** 禁用 */
  disabled?: boolean;
  /** 单行显示 */
  block?: boolean;
  /** 用于定制单选框样式 */
  customer?: CheckCustom;
  /** 透传至Check组件的选项 */
  options: Array<{
    label?: string;
    beforeLabel?: string;
    value: Val;
    disabled?: boolean;
  }>
}
```

**`相关接口`**

```tsx | pure
/**
 * 表单组件的统一接口
 * @interface <T> - value类型
 * */
export interface FormLike<T> {
    value?: T;
    onChange?: (value: T) => void;
    defaultValue?: T;
}
```
