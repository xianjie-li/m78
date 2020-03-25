---
title: Check - 选择框
group:
  title: 数据录入
  path: /form
  order: 3000
---

# Check 选择框

`Check`是作为`Radio`和`CheckBox`的底层组件存在的，通常情况下，你不会直接使用它，而是使用基于其实现的上层组件。

尽管如此，每一个`Check`也都可以作为独立的开关组件(value为boolean值的输入组件)来使用

你也可以通过提供的API来定制自己的`Switch`、`Radio`、或者是`CheckBox`组件

## 示例

<code src="./demo.tsx" />

## props

**`Input`**

```tsx | pure
a = b;
```

**`相关接口`**

```tsx | pure
/**
 * 表单组件的统一接口， 包含额外参数
 * @interface <T> - value类型
 * @interface <Ext> - onChange接收的额外参数的类型
 * */
export interface FormLikeWithExtra<T, Ext = any> {
  value?: T;
  onChange?: (value: T, extra: Ext) => void;
  defaultValue?: T;
}
```
