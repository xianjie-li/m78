---
title: useSetState
group:
  path: /state
  order: 3
---

# useSetState

提供与类组件 setState 类似的 API

## 示例

<code src="./useSetState.demo.tsx" />

## API

`const [state, setState] = useSetState(initState)`

**state** - `{}` | state 对象，每次 rerender 都返回的是同一个对象引用，可以借此来解决使用 hooks 时常见的闭包问题

**setState** - 更改 state 的唯一方式

```ts
interface SetState<T> {
  (patch: Partial<T> | ((prevState: T) => Partial<T>)): void;
}
```

**initState** - 初始 state

```ts
type SetStateInitState<T> = (() => T) | T;
```
