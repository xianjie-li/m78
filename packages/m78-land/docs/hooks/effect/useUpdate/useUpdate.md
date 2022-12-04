---
title: useUpdate
---

# useUpdate

用于手动触发组件更新

## 示例

<demo demo={require("./useUpdate.demo.tsx")} code={require("!!raw-loader!./useUpdate.demo.tsx")}></demo>

## API

如果设置了 nextTickCall, 多次触发的 update 会在下一个事件周期统一触发

`function useUpdate(nextTickCall: boolean = false): () => void`
