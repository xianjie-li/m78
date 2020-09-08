---
title: Layout - 布局
group:
  title: 展示组件
  path: /base
  order: 1000
---

# Layout 布局

声明式的布局能提供很大的方便，但是传统的12列或24列网格局限性又太大，不适用于定制化很高的前端页面。

所以，参考Flutter提供了几个比较基础的flex base布局组件，以及部分功能性布局组件, 用于完成行、列、对齐、网格、固定比例盒子等常见的布局场景。

## Flexible

基于flex的一组布局组件

<code src="./flexDemo.tsx" />

## Grid

网格布局

<code src="./gridDemo.tsx" />

## AspectRatio

一个永远保持固定宽高比的盒子!

<code src="./aspectRatioDemo.tsx" />

## Divider

易于使用的分割线组件

<code src="./DividerDemo.tsx" />

## Center

将子组件居中放置

<code src="./CenterDemo.tsx" />


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

**`Grid`**

```tsx | pure
interface GridProps extends ComponentBaseProps {
  /** 子元素, 必须是一组可以挂在className和style的元素 */
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

**`Center`**

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
