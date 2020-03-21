---
title: Icon - 图标
group:
    title: 基础组件
    path: /base
    order: 1000
---


<!-- 样式 -->
```tsx | inline
import React from 'react';
import './style.scss';

export default () => <span />
```

# Icon 图标

一套常用的矢量图标，来自 [iconfont](https://www.iconfont.cn/) antd官方图标库

## 代码示例
<code src="./icon-demo.tsx"/>

## 单色图标
<code src="./icon-demo2.tsx" inline />

## svg图标
<code src="./icon-demo3.tsx" inline />

## props
**`Icon`**
```tsx | pure
interface IconProps extends ComponentBasePropsWithAny {
  /** icon类型 */
  type: IconTypes;
  /** 颜色 */
  color?: string;
  /** 大小通过字号跳转，与{ fontSize: number | string }等效 */
  size?: string | number;
  /** 是否添加旋转动画 */
  spin?: boolean;
}
```

**`SvgIcon`**
```tsx | pure
interface SvgIconProps extends ComponentBasePropsWithAny {
  /** icon类型 */
  type: SvgIconTypes;
  /** 大小通过字号跳转，与{ fontSize: number | string }等效 */
  size?: string | number;
  /** 是否旋转图标 */
  spin?: boolean;
}
```

**相关接口**
```tsx | pure
interface ComponentBasePropsWithAny extends ComponentBaseProps{
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












