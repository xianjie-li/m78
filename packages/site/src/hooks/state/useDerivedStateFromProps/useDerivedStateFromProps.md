---
title: useDerivedStateFromProps
group:
  path: /state
  order: 3
---

# useDerivedStateFromProps

实现类似 getDerivedStateFromProps 的效果，接收 prop 并将其同步为内部状态，

💡 当 prop 改变, 对 prop 和内部 state 执行`_.isEqual`,对比结果为 `false` 时，会更新内部值 (基础类型使用 === 进行对比，性能更高，当必须使用引用类型时，尽量保持结构简单，减少对比次数)

## 示例

<code src="./useDerivedStateFromProps.demo.tsx" />

## API

```ts
/**
 *  实现类似getDerivedStateFromProps的效果，接收prop并将其同步为内部状态，
 *  当prop改变, 对prop和内部state执行_.isEqual,对比结果为false时，会更新内部值 (基础类型使用 === 进行对比，性能更高，当必须使用引用类型时，尽量保持结构简单，减少对比次数)
 *  @param prop - 需要派生为state的prop
 *  @param customizer - 可以通过此函数自定义对比方式, 如果相等返回 true，否则返回 false, 返回undefined时使用默认对比方式
 * */
function useDerivedStateFromProps<T>(
  prop: T,
  customizer?: (next: T, prev: T) => boolean
);
```
