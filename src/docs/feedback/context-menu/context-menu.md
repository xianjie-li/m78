---
title: ContextMenu - 上下文菜单
group:
  title: 反馈
  path: /feedback
  order: 2000
---

# ContextMenu 上下文菜单

对组件展示一组上下文操作

## 示例

<code src="./demo.tsx" />

## API

继承了[overlay](/docs/feedback/overlay)除了以下`props`的用法

```ts
const omitContextMenuOverlayProps = [
  'triggerType',
  'xy',
  'alignment',
  'target',
  'childrenAsTarget',
] as const;
```

以下默认值有变更:
- mountOnEnter/unmountOnExit 默认为true
- direction 默认为OverlayDirectionEnum.rightStart
- springProps 默认去除了动画, 可以通过 immediate: false 开启
