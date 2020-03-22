---
title: Carousel - 轮播
group:
  title: 展示组件
  path: /view
  order: 4000
---

# Carousel 轮播

用于在指定区域对一组子元素进行切换展示用于在指定区域对一组子元素进行切换展示用于在指定区域对一组子元素进行切换展示

## 基础示例

<code src="./carousel-demo.tsx" />

## 纵向轮播

<code src="./carousel-vertical.tsx" />

## 手动控制

<code src="./carousel-manual.tsx" />

> 💡 确保每一个轮播子项的宽高一致

## props

```tsx | pure
interface CarouselProps extends ComponentBaseProps {
  /** 子元素，必须为多个直接子元素或子元素数组 */
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
  /** 页码改变时触发，在mounted时也会触发，并且会传入first=true */
  onChange?: (currentPage: number, first?: boolean) => void;
  /** 自动轮播 */
  autoplay?: number;
  /** 是否开启鼠标滚轮监听 */
  wheel?: boolean;
  /** 是否开启drag */
  drag?: boolean;
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
