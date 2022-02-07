---
title: Bubble - 气泡框
group:
  title: 反馈
  path: /feedback
  order: 2000
---

# Bubble 气泡框

[m78/overlay](/docs/feedback/overlay#bubble)的上层组件, 进行了一些易用性封装, 更多气泡特性请查阅其文档.

## 类型

内置了三种显示方式:
- tooltip 简单的文本提示
- popper 展示一段复杂内容
- confirm 进行快捷询问

<code src="./demo.tsx" />

## 实现单例气泡

通过实例对象或动态传入props可以轻松的实现单例气泡, 适用于虚拟列表等需要大量渲染`bubble`的场景

<code src="./singleton.tsx" />

## API

继承了[overlay](/docs/feedback/overlay)除了以下`props`的所有用法

```ts
const omitBubbleOverlayProps = ['xy', 'alignment'] as const;
```

组件扩展的用法

```ts
interface BubbleProps {
  /** BubbleTypeEnum.tooltip | 气泡类型 */
  type?: BubbleType;
  /** 标题, 仅在popper模式下生效 */
  title?: React.ReactNode;

  /* ###### confirm 特有配置 ###### */
  /** '确认' | 类型为confirm时，确认按钮的文字 */
  confirmText?: React.ReactNode;
  /** '取消' | 类型为confirm时，取消按钮的文字 */
  cancelText?: React.ReactNode;
  /** type为confirm时, 此选项用于设置图标 */
  icon?: React.ReactNode;

  /** 点击确认的回调 */
  onConfirm?(): void;
}
```

可用类型

```ts
enum BubbleTypeEnum {
  tooltip = 'tooltip',
  popper = 'popper',
  confirm = 'confirm',
}
```

以下默认值有变更:
- mountOnEnter/unmountOnExit
  - type为tooltip/confirm时, 均为true
  - 其他情况使用overlay的默认配置: mountOnEnter: true,  unmountOnExit: false
- type为tooltip时, triggerType为active, 否则为click
- 其他部分`overlay`的默认值也有变更
```ts
const defaultProps = {
  childrenAsTarget: true,
  zIndex: Z_INDEX_MESSAGE,
  namespace: 'BUBBLE',
  lockScroll: false,
  direction: OverlayDirectionEnum.top,
  arrow: true,
  triggerType: 'active',
}
```
