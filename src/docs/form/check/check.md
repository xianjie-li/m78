---
title: Check - 选框
group:
  title: 数据录入
  path: /form
  order: 3000
---

# Check 输入框

最基础、最重要的输入单元

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
