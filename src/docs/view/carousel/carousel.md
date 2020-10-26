---
title: Carousel - 滚动带
group:
  title: 展示组件
  path: /view
  order: 4000
---

# Carousel 滚动带

一组固定大小可滚动容器，用于轮播广告、切换展示的内容等

## 基础示例

<code src="./carousel-demo.tsx" />

## 纵向轮播

<code src="./carousel-vertical.tsx" />

## 手动控制

<code src="./carousel-manual.tsx" />

## 性能

* 开启了`invisibleUnmount`或`invisibleHidden`进行性能优化时，建议不要启用loop，因为它会复制渲染首尾两页的克隆并且一直渲染前两页和后两页来保证动画连贯,
此时是否启用loop开启的权衡点是: 页面总数多，但是页面内容少, 启用； 页面总数少，但是渲染的内容量大则关闭
* 如果作为与安卓'PageView'类似功能的组件来使用，并且内容为无限加载的列表，应该采用虚拟滚动或惰性加载等优化方式对内容进行优化，否则可能在数据量过大时产生页切换卡顿的问题

以下是`invisibleUnmount`和`invisibleHidden`带loop和不带loop的实例，可以通过控制台查看它们是如何渲染的

<code src="./carousel-performance.tsx" />


## props

```tsx | pure
interface CarouselProps extends ComponentBaseProps {
  /** 子元素，必须为多个直接子元素或子元素数组, 项的高度需要统一 */
  children: ReactElement[];
  /** false | 设置滚动方向为纵向, 当为纵向时，必须设置height，否则高度默认为0 */
  vertical?: boolean;
  /** vertical ? 0 : 'auto' | 当vertical为true时，必须设置高度 */
  height?: number | string;
  /** 'auto' | 宽度，与轮播项一致 */
  width?: number | string;
  /** true | 是否开启循环滚动 */
  loop?: boolean;
  /** 0 | 从0开始的默认页码 */
  initPage?: number;
  /** true | 是否开启分页控制和计数器，在横向滚动时，当滚动项总数大于7，计数器会自动更换为数字数据器，纵向模式下计数器永远为图形计数器 */
  control?: boolean;
  /** 强制使用number计数器 */
  forceNumberControl?: boolean;
  /** 自动轮播 */
  autoplay?: number;
  /** 是否开启鼠标滚轮监听 */
  wheel?: boolean;
  /** 是否开启drag */
  drag?: boolean;
  /** 页码改变时触发，在mounted时也会触发，并且会传入first=true */
  onChange?: (currentPage: number, first?: boolean) => void;
  /** 当发生任何可能切换页面的操作(drag、滚动)时触发 */
  onWillChange?: () => void;
  /** 禁用缩放动画 */
  noScale?: boolean;
  /** false | 将不可见内容卸载，只保留空容器(由于存在动画，当前项的前后容器总是会保持装载状态, 启用loop时会有额外规则，见注意事项) */
  invisibleUnmount?: boolean;
  /** true | 元素不可见时，将其display设置为node(需要保证每项只包含一个子元素且能够设置style，注意事项与invisibleUnmount一致) */
  invisibleHidden?: boolean;
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

## ref

```tsx | pure
interface CarouselRef {
  /** 跳转到前一页 */
  prev(): void;
  /** 跳转到后一页 */
  next(): void;
  /**
   * 跳转到指定页
   * @param currentPage - 页码
   * @param immediate - 是否跳过动画
   * */
  goTo(currentPage: number, immediate?: boolean): void;
}
```
