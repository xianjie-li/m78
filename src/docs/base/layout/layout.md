---
title: Layout - 布局
group:
  title: 展示组件
  path: /base
  order: 1000
---

# Layout 布局

Layout 模块能够极大的简化您的布局方式，它包含以下主要内容:

- 一个功能强大的 12 列栅格系统
- 声明式的媒体查询组件和工具
- 一些很常用的声明式布局组件, 如`Tile` `Spacer` `Divider`等
- 大量常用的布局原子类，像是`bg-blue` `bold ` `fs-sm`等等

> 声明式的布局能提供很大的方便, 在`Flutter`和`tailwindcss`等技术中被大量使用, 对于简单、局部的小型布局, 使用它可以非常方便且迅速的实现，并且大部分情况下不需要编写 css 代码, 如果你正在编写过于复杂的大块布局或精度很高的用户端页面，则推荐使用 css 辅以声明式布局的方式

## Grids

一个类似 bootstrap 的 12 格栅格系统

- 核心计算通过 js 实现，所以比传统的静态 css 栅格拥有更强的能力, 比如小数位的栅格, 断点支持设置对象并且包含丰富的配置等
- 采用 12 格的栅格系统(相比 24 格心算更简单 ✌), 但是得益于小数位栅格的支持，同样可以实现非常灵活的布局，如： 二等分 6 / 三等分 4 / 四等分 3 / 五等分 2.4 / 六等分 2
- 布局采用 flex，可以灵活的控制栅格定位行为

### 基础栅格

使用`Grids`和`GridsItem`来进行栅格布局, 传入`col`来控制栅格数

<code src="./grids/base.tsx" />

### offset

通过`offset`来为格设置左（负数）右偏移

<code src="./grids/offset.tsx" />

### 排序

通过`move`来在不影响格布局流的情况下移动子项进行排序, 也可以通过 order 来进行排序

<code src="./grids/order.tsx" />

### 布局行为

通过`mainAlign`和`crossAlign`来分别控制子项在主轴和交叉轴上的布局方式

<code src="./grids/layouts.tsx" />

### flex

`GridsItem`支持传入 flex 设置弹性系数

<code src="./grids/flex.tsx" />

### 响应式栅格

预设 6 种响应尺寸 `xs` `sm` `md` `lg` `xl` `xxl`

实际使用时不可能为每一个断点都设置值，所有断点遵循一套继承机制，以减少编码量:

- 断点会影响其后所有未设置值的断点，比如，设置了`xs`时, `xs`之后的所有断点都会继承`xs`的配置, 如果`xs`后任意一个断点也设置了值，则后续断点会改为继承该断点
- hidden 的继承顺序与其他属性是相反的，也就是从大到小
- 基于`MediaQuery`系列组件实现断点，所以断点是支持容器级的

<code src="./grids/mediaQuery.tsx" />

### API

**`Grids`**

```tsx | pure
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

```tsx | pure
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

<br>
<br>

## MediaQuery

一套声明式的媒体查询工具，帮助你轻松的实现响应式布局

- 响应式的监听点可以是窗口，也可以是指定容器
- 包含 6 种断点尺寸, 由小到大依次是 `xs` `sm` `md` `lg` `xl` `xxl`
- 媒体查询的核心类型是`MediaQueryMeta`,所有 api 都围绕此类型展开

### MediaQuery 组件

最常用的断点组件，它通过 render children 来根据断点渲染差异化的子项

<code src="./mediaQuery/base.tsx" />

你也可以使用`MediaQuery`的内部实现 hook`useMediaQuery`, 用法几乎一致，但是 hook 的用法会在尺寸类型变更时更新整个消费组件

```ts
const meta = useMediaQuery();

meta.type;
meta.isSM();
```

### MediaQuery 断点

可以方便的为`MediaQuery`设置一组断点配置并在 render children 中接收符合当前尺寸的值

> 为了减少断点声明，断点配置包含一组继承规则，详情见下方`MediaQuery`api 说明

```tsx | pure
<MediaQuery xs="small" md="medium" xxl="large">
  {(meta, value) => (
    <div>
      {meta.type} {value}
    </div>
  )}
</MediaQuery>

// 如过配置为联合类型，可以通过泛型组件设置类型, 如果为单一类型的话会自动推导
<MediaQuery<string | number> xs="small" md={5} xxl="large">
  {(meta, value /* 这里的类型为 string | number */) => (
    <div>
      {meta.type} {value}
    </div>
  )}
</MediaQuery>
```

### 监听器

一个获取`MediaQueryMeta`变更的事件订阅器，不会产生更新

```tsx | pure
<MediaQueryListener onChange={meta => console.log(meta)} />
```

另一种更简单的订阅方式是使用`useMediaQueryListener`

```ts
const meta = useMediaQueryListener(meta => {
  meta.type;
  meta.isSM();
});
```

### 重要 API & 类型

**`断点`**

```ts
/**
 * MediaQuery的所有类型
 * 判断是否在某一类型的方式为 当前宽度大于等于该类型的值且小于下一类型的值
 * */
enum MediaQueryTypeValues {
  XS = 0,
  SM = 576,
  MD = 768,
  LG = 992,
  XL = 1200,
  XXL = 1600,
}

export enum MediaQueryTypeKeys {
  XS = 'xs',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
  XXL = 'xxl',
}
```

**`MediaQuery`**

```ts
interface MediaQueryProps {
  /** 延迟响应变更的时间(ms) */
  debounce?: number;
  /**
   * 'type' | 监听类型
   * - 为type时，只在MediaQueryTypeKey变更时更新, 需要注意的时，此时的width和height值为更新时的快照值, 不应该依赖其进行一些计算操作
   * - 为size时，会在每一次尺寸变更时更新, size模式建议开启debounce, 防止频繁render
   * */
  listenType?: 'type' | 'size';
  /**
   * 处于特定媒体类型下的断点配置, 符合条件的会传递给children
   * 实际使用时不可能为每一个断点都设置值，所有断点遵循一套继承机制，以减少编码量:
   * - 断点会影响其后所有未设置值的断点，比如，设置了xs时, xs之后的所有断点都会继承xs的配置, 如果xs后任意一个断点也设置了值，则后续断点会改为继承该断点
   * */
  xs?: Val;
  sm?: Val;
  md?: Val;
  lg?: Val;
  xl?: Val;
  xxl?: Val;
  /** 默认的断点值继承机制为从左到右，传入此项将其继承顺序颠倒 */
  reverse?: boolean;
  /** 断点内容render, 其接收的value是当前命中的断点配置 */
  children: (meta: MediaQueryMeta) => ReactElement<any, any> | null;
}
```

**`MediaQueryMeta`**

```ts
interface MediaQueryMeta {
  /** 当前容器宽度 */
  width: number;
  /** 当前容器高度 */
  height: number;
  /** 当前类型 */
  type: MediaQueryTypeKeys;
  /** 检测是否为指定类型 */
  isXS: () => boolean;
  isSM: () => boolean;
  isMD: () => boolean;
  isLG: () => boolean;
  isXL: () => boolean;
  isXXL: () => boolean;
  /** 当前尺寸是 xs或sm */
  isSmall: () => boolean;
  /** 当前尺寸是 md或lg */
  isMedium: () => boolean;
  /** 当前尺寸大于 lg */
  isLarge: () => boolean;
}
```

<br>
<br>

## Flexible

基于 flex 的一组布局组件

<code src="./flexDemo.tsx" />

## 原子类

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
