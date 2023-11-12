---
title: useRefState
---

# useRefState

将一组`state`或`prop`值 ref 化，以便在组件任意位置安全使用

## 示例

<Demo demo={require("./use-ref-state.demo.tsx")} code={require("!!raw-loader!./use-ref-state.demo.tsx")}></Demo>

## API

```ts
UseRefize<T extends AnyObject>(refState: T): T
```
