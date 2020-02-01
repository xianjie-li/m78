---
title: Fork
group:
    title: 工具
    path: /utils
    order: 1
---

# Fork

用于规范和简化某些需要进行条件渲染的场景

## If
根据条件渲染或卸载内部的组件

<code src="./fork-demo-if.tsx" />

## Toggle
显示或隐藏内容 

<Alert>⚠ 必须确保子只有一个子元素并且包含包裹元素（即不能为纯文本），用于挂载display: 'none'</Alert>

<code src="./fork-demo-toggle.tsx" />

## Switch
根据条件渲染或卸载内部的组件

<code src="./fork-demo-switch.tsx" />

## props
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







