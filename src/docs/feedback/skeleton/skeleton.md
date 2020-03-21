---
title: Skeleton - 骨架
group:
  title: 反馈
  path: /feedback
  order: 2000
---

# Skeleton 抽屉

与`Spin`类似，用于对某个区域元素的占位加载提醒。

## 基础示例

<code src="./demo.tsx" />

## API

**`Skeleton`**

```tsx | pure
interface SkeletonProps extends SkeletonFactoryProps {
  /** 6 | 文本行的数量 */
  lineNumber?: number;
  /** 高度 */
  height?: number;
  /** 宽度 */
  width?: number;
  /** #fff | 包裹元素背景色 */
  backgroundColor?: string;
  /** true | 包裹元素是否有阴影 */
  shadow?: boolean;
  /** false | 圆角图片,只在传img时生效 */
  circle?: boolean;
  /** 显示图片占位图，默认false */
  img?: boolean;
}
```

**`BannerSkeleton`**

```tsx | pure
Omit<SkeletonProps, 'circle' | 'img' | 'lineNumber'>
```

**相关接口**

```tsx | pure
interface SkeletonFactoryProps {
  /** 要渲染的骨架总数 */
  number?: number;
  /** 显示/隐藏骨架 */
  show?: boolean;

  children?: React.ReactNode;
}
```
