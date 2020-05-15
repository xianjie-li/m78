---
title: Icon - 图标
group:
  title: 基础组件
  path: /base
  order: 1000
--- 

<!-- 样式 -->

# Icon 图标

包含[`@ant-design/icons`](https://ant.design/components/icon-cn)库中的所有图标，以及部分内置图标

## 代码示例

<code src="./icon-demo.tsx"/>

## 内置图标

<code src="./icon-demo3.tsx" inline />

## props

```tsx | pure
interface IconProps {
  /** 设置图标的样式名 */
  className?: string;
  /** 设置图标的样式，例如 fontSize 和 color	CSSProperties */
  style?: CSSProperties;
  /** false | 是否有旋转动画 */
  spin?: boolean;
  /** 图标旋转角度（IE9 无效） */
  rotate?: number;
  /** 仅适用双色图标。设置双色图标的主要颜色 */
  twoToneColor?: string;
}
```
