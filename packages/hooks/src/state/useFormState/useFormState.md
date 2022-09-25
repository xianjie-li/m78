---
title: useFormState
group:
  path: /state
  order: 3
---

# useFormState

便捷的实现统一接口的受控、非受控表单组件, 也可用于任何需要受控、非受控状态的场景(此时可以使用另一个更符合语义的别名`useControllableValue`)

## 示例

<code src="./useFormState.demo.tsx" />

## API

```ts
function useFormState<T, Ext = any>(
  /** 透传消费组件的props，该组件需要实现FormLike接口 */
  props: AnyObject,
  /** 默认值，会被value与defaultValue覆盖*/
  defaultValue: T,
  /** 其他配置 */
  config?: Config
): [
  /** 当前值 */
  T,
  /** 设置新值、额外参数，调用时会触发onChange */
  SetFormState<T, Ext>
];
```

**相关接口**

```ts
/**
 * 表单组件的统一接口
 * @type <T> - value类型
 * */
export interface FormLike<T> {
  value?: T;
  onChange?: (value: T) => void;
  defaultValue?: T;
}

/**
 * 表单组件的统一接口， 包含额外参数
 * @type <T> - value类型
 * @type <Ext> - onChange接收的额外参数的类型
 * */
export interface FormLikeWithExtra<T, Ext = any> {
  value?: T;
  onChange?: (value: T, extra: Ext) => void;
  defaultValue?: T;
}
```
