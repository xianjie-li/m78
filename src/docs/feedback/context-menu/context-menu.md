---
title: ContextMenu - 上下文菜单
group:
  title: 反馈
  path: /feedback
  order: 2000
---

# ContextMenu 上下文菜单

用于对特定组件展示一组上下文操作, 该组件适用于 PC 设备

## 示例

<code src="./demo.tsx" />

## API

💡 组件依赖[`Popper`](/docs/feedback/popper)组件，部分`api`会包含该组件的类型，请自行查阅

```tsx | pure
interface ContextMenuProps extends ComponentBaseProps {
  /** 一个接收onContextMenu事件的子节点 */
  children: JSX.Element;
  /** 内容 */
  content: React.ReactNode | ((props: PopperPropsCustom) => React.ReactNode);
  /** 完全定制样式 */
  customer?(props: PopperPropsCustom): JSX.Element;
}

export interface ContextMenuItemProps extends TileProps {
  /** 添加禁用样式 */
  disabled?: boolean;
}
```
