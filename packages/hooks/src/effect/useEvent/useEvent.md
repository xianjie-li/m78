---
title: useEvent
group:
  path: /effect
  order: 2
---

# useEvent

自定义事件，用于多个组件间或组件外进行通讯

## 示例

<code src="./useEvent.demo.tsx" />

## API

```ts
const { useEvent, on, off, emit } = createEvent<ListenerType>();
```

**useEvent** - 以 hook 的形式注册一个事件监听器，会在 unmount 时自动解绑事件

**emit** - 触发所有正在监听的事件

**on** - 注册一个事件监听器

**off** - 解绑指定的事件监听器
