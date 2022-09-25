---
title: useStorageState
group:
  path: /state
  order: 3
---

# useStorageState

与`useState`用法一样，区别是会将状态缓存到 Storage 中并在下次加载时还原

## 示例

<code src="./useStorageState.demo.tsx" />

## useStorageSetState

[useSetState](/state/use-set-state)版本的 useStorageState, 除了包含缓存功能，其他完全一致

<code src="./useStorageSetState.demo.tsx" />

> ⛔ 由于`Storage` API 的机制，基础类型之外的值无法进行存储(也不应该存储)

## API

```ts
function useStorageBase<T = undefined>(
  /** 缓存key */
  key: string,
  /** 初始状态 */
  initState?: StateInitState<T>,
  /** 其他选项 */
  options?: UseStorageStateOptions
): [
  /** 状态 */
  T,
  /** 设置状态  */
  SetStateBase<T>
];
```

**相关接口**

```ts
interface UseStorageStateOptions {
  /** 缓存类型 */
  type?: "local" | "session";
  /** false | 是否禁用缓存 */
  disabled?: boolean;
}

type StateInitState<T> = (() => T) | T;

interface SetStateBase<T> {
  (patch: T | ((prevState: T) => T)): void;
}
```
