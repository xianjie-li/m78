---
title: Scroller - 滚动容器
group:
  title: 展示组件
  path: /view
  order: 4000
---

# Scroller 滚动容器

## 示例

在滚动到达边缘时开启弹动效果(通常结合移动端的拖动滚动使用)

<code src="./scroller-demo.tsx" />

## 滚动指示

滚动进度条、可滚动标识器

<code src="./flags.tsx" />

## 滚动条

_适用于 pc 版_, 默认会在支持的浏览器上通过`-webkit-`私有前缀定制滚动条样式，也可以选择关闭定制、隐藏滚动条、控制显示时机等

<code src="./bar.tsx" />

## 滚动控制

通过 ref 实例来便捷的控制滚动位置

<code src="./ctrl.tsx" />

## 上拉加载/下拉刷新

下面是一个上拉加载和下拉刷新的结合示例

- 在滚动到最顶部时，可以通过下拉来刷新所有状态
- 滚动到内容底部时会自动加载一些新的数据
- mock 函数会随机模拟错误
- 可以通过下拉刷新来清空列表、错误、无数等状态

<code src="./pull.tsx" />

## 下拉刷新进阶

<code src="./pulldown.tsx" />

## props

```tsx | pure
interface ArticleBoxProps extends ComponentBaseProps {
  /** 合法的html字符串 */
  html?: string;
  /** 可以传入react节点代替html */
  content?: React.ReactNode;
  /** 水印内容，不传时无水印 */
  watermark?: React.ReactNode;
}
```

**相关接口**

```tsx | pure
interface ComponentBaseProps {
  /** 包裹元素的类名 */
  className?: string;
  /** 包裹元素样式 */
  style?: React.CSSProperties;
}
```
