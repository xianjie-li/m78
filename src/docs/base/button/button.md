---
title: Button - 按钮
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

# Button 按钮

一组预设的按钮

## 颜色

包含**默认** + **功能色** + **主题色** 等配色按钮

<code src="./button-demo-color.tsx" />

## 禁用

<code src="./button-demo-disabled.tsx" />

## 尺寸

<code src="./button-demo-size.tsx" />

## 圆形按钮

<code src="./button-demo-circle.tsx" />

## 透明 + 边框

<code src="./button-demo-outline.tsx" />

## 加载中

<code src="./button-demo-loading.tsx" />

## 块级按钮

<code src="./button-demo-block.tsx" />

## 链接按钮

<code src="./button-demo-link.tsx" />

## 图标按钮

<code src="./button-demo-icon.tsx" />

## 交互效果

<code src="./button-demo-effect.tsx" />

## props

**`<Button>`**

```tsx | pure
interface
  ButtonProps
extends
  ComponentBasePropsWithAny,
  React.PropsWithoutRef<JSX.IntrinsicElements['button']>
{
  /** 按钮颜色 */
  color?: 'blue' | 'red' | 'green' | 'yellow' | 'primary';
  /** 大小 */
  size?: 'large' | 'small' | 'mini';
  /** 圆形按钮 */
  circle?: boolean;
  /** 边框按钮 */
  outline?: boolean;
  /** 块级按钮 */
  block?: boolean;
  /** link按钮 */
  link?: boolean;
  /** icon按钮, children可以是Icon或文字 */
  icon?: boolean;
  /** 设置禁用状态 */
  disabled?: boolean;
  /** 设置加载状态 */
  loading?: boolean;
  /** 仅启用md风格的点击效果 */
  md?: boolean;
  /** 仅启用win风格的点击效果 */
  win?: boolean;
  /** 为link按钮时，href所指向的地址 */
  href?: string;
}
```

**相关接口**

```tsx | pure
interface ComponentBasePropsWithAny extends ComponentBaseProps {
  /** 透传到包裹元素上的属性 */
  [key: string]: any;
}

interface ComponentBaseProps {
  /** 包裹元素的类名 */
  className?: string;
  /** 包裹元素样式 */
  style?: React.CSSProperties;
}
```
