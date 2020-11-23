---
title: Expansion - 折叠面板
group:
  title: 展示组件
  path: /view
  order: 4000
---

# Expansion 折叠面板

折叠复杂区域以保持页面整洁

## 示例

<code src="./demo.tsx" />

## 手风琴

只会同时打开一个

<code src="./accordion.tsx" />

## 嵌套

<code src="./Nest.tsx" />

## 单独使用 Pane

ExpansionPane 支持单独使用

<code src="./pane.tsx" />

## 定制

<code src="./custom.tsx" />

## 性能

<code src="./performance.tsx" />

## props

**`通用配置`**

```tsx | pure
interface ExpansionBase extends MountExistBase {
  /** 禁用 */
  disabled?: boolean;

  /* ########### 性能选项 ########### */
  /** true | 是否开启展开/收起动画 */
  transition?: boolean;
  /** true | extend | 如果为true，在第一次启用时才真正挂载内容 */
  // mountOnEnter?: boolean;
  /** false | extend | 是否在关闭时卸载内容 */
  // unmountOnExit?: boolean;

  /* ########### 样式定制 ########### */
  /** 去除所有非必要样式 */
  noStyle?: boolean;
  /** 自定义展开标识图标 */
  expandIcon?: ((open: boolean) => React.ReactNode) | React.ReactNode;
  /** left | 展开图标的位置 */
  expandIconPosition?: ExpandIconPosition | 'left' | 'bottom' | 'right';
}
```

**`Expansion`**

```tsx | pure
interface ExpansionProps extends ExpansionBase, ComponentBaseProps {
  /** 所有展开项的name数组(受控) */
  opens?: string[];
  /** 默认的展开项name数组(不受控) */
  defaultOpens?: string[];
  /** 展开项改变时触发 */
  onChange?: (nextOpens: string[]) => void;
  /** 开启手风琴效果，所有Pane同时只会有一个被打开 */
  accordion?: boolean;
  /** 渲染在内部的元素，内部所有带name的ExpansionPane会受此组件控制 */
  children?: React.ReactNode;

  /** extend | 包裹元素的类名 */
  // className?: string;
  /** extend | 包裹元素样式 */
  // style?: React.CSSProperties;
}
```

**`ExpansionPane`**

```tsx | pure
interface ExpansionPaneProps extends ExpansionBase, ComponentBaseProps {
  /** 该Pane的标识，只有传入此项才会被父级Expansion识别, 不传时作为独立组件使用 */
  name?: string;
  /** 是否展开(受控) */
  open?: boolean;
  /** 默认是否展开 */
  defaultOpen?: boolean;
  /** 展开状态改变 */
  onChange?: (open: boolean) => void;
  /** 顶部内容 */
  header?: React.ReactNode;
  /** 面板内容 */
  children?: React.ReactNode;
  /** 顶部操作区内容 */
  actions?: React.ReactNode;

  /** 完全替换掉整个顶部内容 */
  headerNode?: React.ReactElement | null;
  /** extend | 包裹元素的类名 */
  // className?: string;
  /** extend | 包裹元素样式 */
  // style?: React.CSSProperties;
}
```
