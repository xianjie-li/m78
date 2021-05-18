---
title: Layout - 布局
group:
  title: 展示组件
  path: /base
  order: 1000
---

# Layout 布局

声明式的布局能提供很大的方便，但是传统的 12 列或 24 列网格局限性又太大，不适用于定制化很高的前端页面。

所以，提供类似 Flutter 的 flex base 布局组件，以及部分功能性布局组件, 用于完成行、列、对齐、网格等常见的布局场景。

## Flexible

基于 flex 的一组布局组件

<code src="./flexDemo.tsx" />

## 工具类

内置了很多常用的工具类, 请查收 [util-class.scss](https://github.com/Iixianjie/sass-stater/blob/master/base/util-class.scss)

## Tile

一个非常常用的布局组件，包含左侧、右侧、内容区、描述区四个位置，可用于很多常见的布局场景

<code src="./tileDemo.tsx" />

## Grid

网格布局

<code src="./gridDemo.tsx" />

## AspectRatio

一个永远保持固定宽高比的盒子

<code src="./aspectRatioDemo.tsx" />

## Divider

易于使用的分割线组件

<code src="./dividerDemo.tsx" />

## Spacer

在元素之间填充空白

<code src="./spacerDemo.tsx" />

## Center

将子组件居中放置

<code src="./centerDemo.tsx" />

## API

**`Column/Row`**

```tsx | pure
interface FlexWrapProps extends ComponentBasePropsWithAny {
  /** 'start' | 主轴对齐方式 */
  mainAlign?: 'center' | 'start' | 'end' | 'around' | 'between' | 'evenly';
  /** 'stretch' | 交叉轴对齐方式 */
  crossAlign?: 'stretch' | 'start' | 'end' | 'center';
  /** 内容 */
  children: React.ReactNode;
}
```

**`Flex`**

```tsx | pure
nterface FlexProps extends ComponentBasePropsWithAny {
  /** 1 | 弹性系数 */
  flex?: number | string;
  /** 排序 */
  order?: number;
  /** 单独设置在容器交叉轴上的对齐方式  */
  align?: FlexWrapProps['crossAlign'];
  /** 内容 */
  children?: React.ReactNode;
}
```

**`Tile`**

```tsx | pure
interface TileProps extends Omit<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, 'title'> {
  /** 主要内容 */
  title?: React.ReactNode;
  /** 次要内容 */
  desc?: React.ReactNode;
  /** 前导内容 */
  leading?: React.ReactNode;
  /** 尾随内容 */
  trailing?: React.ReactNode;
  /** 纵轴的对齐方式 */
  crossAlign?: FlexWrapProps['crossAlign'];
}
```

**`Grid`**

```tsx | pure
interface GridProps extends ComponentBaseProps {
  /** 子元素, 必须是一组可以挂载className和style的元素 */
  children: React.ReactElement | React.ReactElement[];
  /** 总列数 */
  count?: number;
  /** 1 | 网格项的宽高比 */
  aspectRatio?: number;
  /** 网格项的高度, 与aspectRatio选用一种 */
  size?: number;
  /** 网格项间的间距, 优先级小于单独设置的 */
  spacing?: number;
  /** 主轴间距 */
  mainSpacing?: number;
  /** 交叉轴间距 */
  crossSpacing?: number;
  /** true | 是否启用边框 */
  border?: boolean;
  /** 'rgba(0, 0, 0, 0.15)' | 边框颜色 */
  borderColor?: string;
  /** true | 当最后一行不能填满时，是否以空项占位 */
  complete?: boolean;
  /** 表格项的类名 */
  contClassName?: string;
  /** 表格项的样式 */
  contStyle?: React.CSSProperties;
}
```

**`AspectRatio`**

```tsx | pure
interface AspectRatioProps extends ComponentBaseProps {
  /** 1 | 网格项的宽高比 */
  ratio?: number;

  children?: React.ReactNode;
}
```

**`Divider`**

```tsx | pure
interface DividerProps extends ComponentBaseProps {
  /** false | 设置为垂直分割线 */
  vertical?: boolean;
  /** 100%(横向) / 0.5(纵向) | 分割线尺寸 */
  width?: number;
  /** 0.5(横向) / 1.2em(纵向) | 分割线尺寸 */
  height?: number;
  /** 颜色 */
  color?: string;
}
```

**`Spacer`**

```tsx | pure
interface SpacerProps {
  /** 宽度 */
  width?: number;
  /** 16 | 高度,  */
  height?: number;
  /** 如果子项传入一个列表，会在每一个子项间设置间距 */
  children?: React.ReactElement[];
}
```

**`Center`**

```tsx | pure
interface CenterProps extends ComponentBaseProps {
  /** false | 为true时，将尺寸固定到与父元素一致(需要保证父元素position不是static), 为false时，需要通过className或style执行设置尺寸 */
  attach?: boolean;
  /** 需要居中的单个子元素 */
  children?: React.ReactElement | string;
}
```
