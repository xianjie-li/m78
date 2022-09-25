---
title: Spin - 加载中
group:
  title: 基础组件
  path: /base
  order: 1000
---

<!-- 样式 -->

```tsx | inline
import React from 'react';
import './style.scss';

export default () => <span />;
```

# Icon 图标

设置一个内联的加载提示元素或将某个块设置为加载状态

## 基本用法

<code src="./spin-demo.tsx"/>

## 内联

<code src="./spin-demo2.tsx"/>

## 自定义文本

<code src="./spin-demo-custom-text.tsx"/>

## 填满容器

> 💡 需要确保父元素非常规定位元素，即 position 的值非 static

<code src="./spin-demo-full.tsx"/>

## props

```tsx | pure
interface SpinProps extends ComponentBaseProps {
  /** 大小 */
  size?: FullSize | FullSizeKeys;
  /** 内联模式 */
  inline?: boolean;
  /** '加载中' | 提示文本 */
  text?: React.ReactNode;
  /** 使spin充满父元素(需要父元素是static以外的定位元素) */
  full?: boolean;
  /** true | 是否显示加载状态 */
  show?: boolean;
  /** 包裹组件样式 */
  style?: React.CSSProperties;
  /** 包裹组件的类名 */
  className?: string;
  /** 300 | 每次出现的最小持续时间, 防止loading闪烁 */
  minDuration?: number;
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
