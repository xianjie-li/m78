---
title: Button - 按钮
group:
  title: 基础组件
  path: /base
---

# Button 按钮

最常见的交互组件

## 颜色

<code src="./button-demo-color.tsx" ></code>

## 禁用

<code src="./button-demo-disabled.tsx"></code>

## 尺寸

<code src="./button-demo-size.tsx"></code>

## 圆形按钮

<code src="./button-demo-circle.tsx"></code>

## 线框按钮

<code src="./button-demo-outline.tsx"></code>

## 加载中

<code src="./button-demo-loading.tsx"></code>

## 块级按钮

<code src="./button-demo-block.tsx"></code>

## 链接/文本按钮

<code src="./button-demo-link.tsx"></code>

## 图标按钮

<code src="./button-demo-icon.tsx"></code>

## API

传入 href 时, 作为 a 链接渲染, 支持 HTML button 的所有 prop, 否则作为 button 渲染，支持 HTML button 的所有 prop.

```tsx | pure
export enum ButtonColor {
  blue = "blue",
  red = "red",
  green = "green",
  orange = "orange",
  second = "second",
  primary = "primary",
}

export interface ButtonProps {
  /** 按钮颜色 */
  color?: ButtonColorUnion;
  /** 尺寸 */
  size?: SizeUnion;

  /** 圆形按钮 */
  circle?: boolean;
  /** 边框按钮 */
  outline?: boolean;
  /** 块级按钮 */
  block?: boolean;
  /** icon按钮, children可以是Icon或文字 */
  icon?: boolean;
  // 文本按钮
  text?: boolean;

  /** 设置禁用状态 */
  disabled?: boolean;
  /** 设置加载状态 */
  loading?: boolean;
  /** 指向内部button的ref */
  innerRef?: React.Ref<HTMLButtonElement>;
  /** 代理onClick, 若onClick事件返回了一个promise like对象, 则自动添加loading状态 */
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
}
```
