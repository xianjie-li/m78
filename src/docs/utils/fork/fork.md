---
title: Fork - 条件渲染
group:
  title: 工具
  path: /utils
  order: 5000
---

# Fork 条件渲染

用于规范和简化某些需要进行条件渲染的场景

## Fork

一个处理异步 UI 的组件

组件假设一个异步 UI 包含四种状态: `normal`(常态 UI) | `loading` | `timeout` | `error`

四种状态应该是互斥的，只会同时生效一种(当 UI 为更新状态时，可能会需要 loading 和旧数据一起显示, 可以通过`forceRenderChild`启用)

状态优先级分别是: `loading` > `timeout | error` > `normal`

<code src="./fork-demo.tsx" />

## If

根据条件渲染或卸载内部的组件

<code src="./fork-demo-if.tsx" />

## Toggle

显示或隐藏内容

> ⚠ 必须确保子只有一个子元素并且包含包裹元素（即不能为纯文本），用于挂载 display: 'none'

<code src="./fork-demo-toggle.tsx" />

## Switch

搭配 If 或 Toggle 使用，类似 react-router 的 Switch，只渲染内部的第一个 prop.when 为 true 的 If，当没有任何一个 If 的 when 为 true 时，匹配第一个不包含 when 的 If

<code src="./fork-demo-switch.tsx" />

## props

**`Fork`**

```tsx | pure
interface ForkProps {
  /** 是否有数据用于显示, 当为truthy值且无其他非常规状态时时，显示子元素 */
  hasData: any;
  /** 当没有任何非常规状态时，显示的内容，如果内容依赖其他数据，可以传入函数 */
  children: React.ReactNode | (() => React.ReactNode);
  /** 是否包含错误, 如果是一个对象且包含message属性，则会用其作为反馈显示 */
  error?: any;
  /** 是否超时 */
  timeout?: boolean;
  /** 是否正在请求 */
  loading?: boolean;
  /** 设置后，即使在loading中，也会强制渲染children */
  forceRenderChild?: boolean;
  /**
   * 默认loading以占位节点形式显示，传入此项会使其脱离文档流并填满父元素, 需要父元素非常规定位元素(position非static)
   * 传入此项时，即使在loading中，也会强制渲染强制渲染children
   * */
  loadingFull?: boolean;
  /** 加载提示文本 */
  loadingText?: React.ReactNode;
  /** 给loading node设置style */
  loadingStyle?: React.CSSProperties;
  /** 当包含异常时(error | timeout), 通过此方法让用户进行更新请求, 传入后会在错误和无数据时显示重新加载按钮 */
  send?: AnyFunction;
  /** '暂无数据' | 空提示文本 */
  emptyText?: React.ReactNode;
}
```

**`If`**

```tsx | pure
interface IfProps {
  /** 任何falsy\truthy值 */
  when?: any;
  /** 待切换的子元素 */
  children?: React.ReactNode;
}
```

**`Toggle`**

```tsx | pure
interface ToggleProps {
  /** 任何falsy\truthy值 */
  when?: any;
  /** 待切换的子元素 */
  children: React.ReactElement;
}
```

**`Switch`**

```tsx | pure
interface SwitchProps {
  children: React.ReactElement[];
}
```
