---
title: useUnmountState
group:
  path: /state
  order: 3
---

# useFormState

获取组件是否已卸载的状态, 用于防止组件在卸载后执行操作

## 示例

```ts
const isUnmount = useIsUnmountState();

isUnmount(); // isUnmount是一个函数, 便于随时获取到最新状态
```
