---
title: useUpdate
group:
  path: /effect
  order: 2
---

# useUpdate

用于手动触发组件更新

## 示例

<code src="./useUpdate.demo.tsx" />

## API

如果设置了 nextTickCall, 多次触发的 update 会在下一个事件周期统一触发

`function useUpdate(nextTickCall: boolean = false): () => void`
