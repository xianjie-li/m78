---
title: Drawer - 抽屉
group:
  title: 反馈
  path: /feedback
  order: 2000
---

# Drawer 抽屉

一个用于在指定方向显示无阻断内容的便捷容器, 它是`overlay`的易用性封装.

## 示例

<code src="./demo.tsx" />

## API

继承了[overlay](/docs/feedback/overlay)除了以下`props`的所有用法

```ts
export const omitDrawerOverlayProps = [
  'xy',
  'alignment',
  'target',
  'childrenAsTarget',
  'offset',
  'direction',
  'arrow',
  'arrowSize',
  'arrowProps',
  'transitionType',
] as const;
```

组件扩展的用法

```ts
interface DrawerProps {
  /** 'bottom' | 出现位置 */
  position?: Position;
  /** 头部内容, 头部区域会固定在最顶部 */
  header?: React.ReactNode;
}
```

通过api使用时, 以下[overlay](/docs/feedback/overlay) props也不可用, api用法通过[renderApi](/docs/ecology/render-api)实现, 详细用法请查阅其文档
```ts
export const omitApiProps = [
  'defaultShow',
  'show',
  'onChange',
  'children',
  'childrenAsTarget',
  'triggerType',
  'onUpdate',
  'onDispose',
  'innerRef',
  'instanceRef',
] as const;
```
