---
title: Tab - 选项卡
group:
  title: 导航
  path: /Navigation
  order: 4000
---

# Tab 选项卡

用于展示一组可切换的内容区域，也可以作为单独的选项卡组件使用

## 示例

最基础的使用示例，通过`index`、`onChange`、`defaultIndex`等属性控制显示内容, `TabItem`子项来生选项

<code src="./demo.tsx" />

## 尺寸

<code src="./size.tsx" />

## 方向

<code src="./position.tsx" />

## flexible

<code src="./flexible.tsx" />

## 选项可滚动

<code src="./scrollable.tsx" />

## 自定义样式

目前支持的定制方式是为根级传入`className`, 通过 css 选择器更改内置组件的样式，并搭配`noSplitLine`、`noActiveLine`等属性调整样式。

<code src="./coustom-style.tsx" />

## props

**`Tab`**

```tsx | pure
interface TabProps extends ComponentBaseProps, FormLike<string | number> {
  /** extend(FormLike) | 当前所在选项卡的value */
  // value?: number;
  /** extend(FormLike) | value改变 */
  // onChange?: (value: string | number) => void;
  /** extend(FormLike) | 初始选项卡的value，优先级小于index */
  // defaultValue?: number;
  /** 一组TabItem */
  children?: TabItemElement[] | TabItemElement;
  /** tab的尺寸 */
  size?: SizeEnum;
  /** tab的位置 */
  position?: PositionEnum;
  /** tab项的每一项平分宽度，如果tab过多不建议开启, position为left和right时无效 */
  flexible?: boolean;
  /** 高度，position为left和right时必传, 横向切换时此配置无效 */
  height?: number | string;
  /** 无限滚动，页面内容过于复杂时不建议开启，因为需要复制页面帮助完成滚动动画 */
  loop?: boolean;
  /** 禁用 */
  disabled?: boolean;
  /** TODO: tab会在即将滚动消失时固定到顶部 */
  // affix?: boolean;
  /** 将不可见的TabItem卸载，只保留空容器(由于存在动画，当前项的前后容器总是会保持装载状态, 启用loop时会有额外规则，见注意事项) */
  invisibleUnmount?: boolean;
  /** TabItem不可见时，将其display设置为node(需要保证每项只包含一个子元素且能够设置style，注意事项与invisibleUnmount一致) */
  invisibleHidden?: boolean;

  /* ======== 样式定制 ======== */
  /** extend(ComponentBaseProps) | 包裹元素的类名 */
  // className?: string;
  /** extend(ComponentBaseProps) | 包裹元素样式 */
  // style?: React.CSSProperties;
  /** 关闭分割线 */
  noSplitLine?: boolean;
  /** 关闭活动线 */
  noActiveLine?: boolean;
}
```

**`TabItem`**

```tsx | pure
interface TabItemProps extends ComponentBaseProps {
  /** tab文本 */
  label: React.ReactNode;
  /** 表示该项的唯一值 */
  value: string | number;
  /** 禁用 */
  disabled?: boolean;
  /** 内容 */
  children?: React.ReactNode;
}
```
