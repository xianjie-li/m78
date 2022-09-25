---
title: useRefize
group:
  path: /state
  order: 3
---

# useRefize

将一组`state`或`prop`值 ref 化，以便在组件任意位置安全使用

## 示例

<code src="./useRefize.demo.tsx" />

## API

```ts
UseRefize<T extends AnyObject>(refState: T): T
```
