---
title: Layout - 布局
group:
  title: 展示组件
  path: /base
  order: 1000
---

# Layout 布局

Layout模块能够极大的简化您的布局方式，它包含以下主要内容:

* 一个功能强大的12列栅格系统
* 声明式的媒体查询组件和工具
* 大量常用的布局原子类，像是`bg-blue` `bold `  `fs-sm`等等
* 一些很常用的声明式布局组件, 如`Tile` `Spacer` `Divider`等

> 声明式的布局能提供很大的方便, 在`Flutter`和`tailwindcss`等技术中被大量使用, 对于简单、局部的小型布局, 使用它可以非常方便且迅速的实现，并且大部分情况下不需要编写css代码,
> 如果你正在编写过于复杂的大块布局或精度很高的用户端页面，则推荐使用css辅以声明式布局的方式


## Grids

一个类似bootstrap的12格栅格系统

* 核心计算通过js实现，所以比传统的静态css栅格拥有更强的能力, 比如小数位的栅格, 断点支持设置对象并且包含丰富的配置等
* 采用12格的栅格系统(相比24格心算更简单✌), 但是得益于小数位栅格的支持，同样可以实现非常灵活的布局，如： 二等分 6 / 三等分 4 / 四等分 3 / 五等分 2.4 / 六等分 2
* 布局采用flex，可以灵活的控制栅格定位行为

### 基础栅格

使用`Grids`和`GridsItem`来进行栅格布局, 传入`col`来控制栅格数

<code src="./grids/base.tsx" />

### offset

通过`offset`来为格设置左（负数）右偏移

<code src="./grids/offset.tsx" />

### 排序

通过`move`来在不影响格布局流的情况下移动子项进行排序, 也可以通过order来进行排序

<code src="./grids/order.tsx" />

### 布局行为

通过`mainAlign`和`crossAlign`来分别控制子项在主轴和交叉轴上的布局方式

<code src="./grids/layouts.tsx" />


### flex

`GridsItem`支持传入flex设置弹性系数

<code src="./grids/flex.tsx" />

### 响应式栅格

预设6种响应尺寸 `xs` `sm` `md` `lg` `xl` `xxl`

实际使用时不可能为每一个断点都设置值，所有断点遵循一套继承机制，以减少编码量: 

* 断点会影响其后所有未设置值的断点，比如，设置了`xs`时, `xs`之后的所有断点都会继承`xs`的配置, 如果`xs`后任意一个断点也设置了值，则后续断点会改为继承该断点
* hidden的继承顺序与其他属性是相反的，也就是从大到小
* 基于`MediaQuery`系列组件实现断点，所以断点是支持容器级的

<code src="./grids/mediaQuery.tsx" />

### API

**`Grids`**

```tsx
interface GridsRowProps {
  /** 间隔 */
  gutter?: number;
  /** true | 是否允许换行 */
  wrap?: boolean;
  /** 'start' | 主轴对齐方式 */
  mainAlign?: 'center' | 'start' | 'end' | 'around' | 'between' | 'evenly';
  /** 'start' | 交叉轴对齐方式 */
  crossAlign?: 'stretch' | 'start' | 'end' | 'center';
  /** 内容 */
  children: React.ReactNode;
}
```

**`GridsItem`**

```tsx
interface GridsColProps extends GridsColMediaQueryProps {
  /** 内容 */
  children?: ReactNode;
  /** 处于特定媒体类型下的配置 */
  xs?: GridsColNumberOrMediaQueryProps;
  sm?: GridsColNumberOrMediaQueryProps;
  md?: GridsColNumberOrMediaQueryProps;
  lg?: GridsColNumberOrMediaQueryProps;
  xl?: GridsColNumberOrMediaQueryProps;
  xxl?: GridsColNumberOrMediaQueryProps;
}

type GridsColNumberOrMediaQueryProps = number | GridsColMediaQueryProps;

// 以下所有props都支持在断点中以对象形式设置，如xs={{ col: 5, move: 2 }}
interface GridsColMediaQueryProps {
  /** 包裹元素的类名 */
  className?: string;
  /** 包裹元素样式 */
  style?: React.CSSProperties;
  /** 占用栅格列数 */
  col?: number;
  /** 左侧间隔列 */
  offset?: number;
  /** 向左或向右移动指定列，不会影响原有文档流 */
  move?: number;
  /** 控制顺序 */
  order?: number;
  /** 手动指定该列的flex值 */
  flex?: string | number;
  /** 该项在交叉轴的对齐方式 */
  align?: FlexWrapProps['crossAlign'];
  /** 是否隐藏, 此属性与其他属性的继承顺序是相反的 */
  hidden?: boolean;
}
```


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
