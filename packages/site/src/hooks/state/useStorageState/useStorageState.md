---
title: useStorageState
group:
  path: /state
  order: 3
---

# useStorageState

与`useState`用法一样，区别是会将状态缓存到 Storage 中并在下次加载时还原

## 示例

<code src="./useStorageState.demo.tsx"></code>

## useStorageSetState

[useSetState](/hooks/state/use-set-state) 版本的 useStorageState, 除了包含缓存功能，其他完全一致

<code src="./useStorageSetState.demo.tsx"></code>

> ⛔ 由于`Storage` API 的机制，基础类型之外的值无法进行存储(也不应该存储)

## API

```ts
function useStorageState<T = undefined>(
  key: string,
  initState?: StateInitState<T>,
  options?: UseStorageStateOptions
): [T, SetStateBase<T>]
```

**相关接口**

```ts
interface UseStorageStateOptions {
  /** 缓存类型 */
  type?: "local" | "session";
  /** false | 是否禁用缓存 */
  disabled?: boolean;
  /** 缓存有效时间(ms) */
  validTime?: number;
}

type StateInitState<T> = (() => T) | T;

interface SetStateBase<T> {
  (patch: T | ((prevState: T) => T)): void;
}
```

`useStorageState`上还挂载了内部使用到的`get`, `set`, `remove`静态方法, 用来操作底层的`storage`
