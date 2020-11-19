---
title: Dialog - 对话框
group:
  title: 反馈
  path: /feedback
  order: 2000
---

# Dialog 对话框

用于在不跳转页面的前提下为用户提供一组询问、表单等操作, 可以将其理解为包含预设样式和简化了交互操作的[Modal](/feedback/modal)

💡 通过 [Modal](/feedback/modal) 作为底层实现, 基本的用法如显示/隐藏的不同控制方式、mask、位置、动画、渲染特性等请查阅其文档

## 基础示例

Dialog 组件的配置非常多样化，通过合理的配置可以实现绝大多数的 Dialog 功能

<code src="./demo.tsx" />

## 通过 api 使用

通过 api 使用方式来进行组件外渲染

<code src="./api.tsx" />

## API

该组件 props 继承至 ModalBaseProps 的子集, 完整配置等请参考 [Modal](/feedback/modal)

```tsx | pure
interface DialogProps extends Omit<ModalBaseProps, 'children' | 'onClose'> {
  /** 内容区域的最大宽度, 默认为360 */
  maxWidth?: number | string;
  /** '提示' | 标题文本 */
  title?: string;
  /** 内容区域 */
  children?: React.ReactNode;
  /** 默认的关闭按钮/确认按钮/右上角关闭按钮点击, 或触发了clickAway时，如果是通过确认按钮点击的，isConfirm为true */
  onClose?(isConfirm?: boolean): void;
  /** false | '取消' | 是否显示取消按钮，传入string时，为按钮文本 */
  close?: boolean | string;
  /** '确认' | 是否显示确认按钮，传入string时，为按钮文本 */
  confirm?: boolean | string;
  /** true | 是否显示关闭图标 */
  closeIcon?: boolean;
  /** 设置弹层为loading状态，阻止操作(在loading结束前会阻止clickAwayClosable) */
  loading?: boolean;
  /** 设置Dialog的状态 */
  status?: 'success' | 'error' | 'warning';
  /** 启用响应式按钮，按钮会根据底部的宽度平分剩余宽度 */
  flexBtn?: boolean;
  /** true | 点击默认的确认按钮时，是否关闭弹窗 */
  confirmClose?: boolean;

  /** 自定义顶部内容，会覆盖title的配置 */
  header?: React.ReactNode;
  /** 自定义底部内容，与其他底部相关配置的优先级为 footer > btns > confirm、close */
  footer?: React.ReactNode;
  /** 通过配置设置按钮组 */
  btns?: (Pick<ButtonProps, 'color' | 'children' | 'onClick' | 'disabled' | 'icon' | 'link'> & {
    text: string;
  })[];
  /** 内容区域class */
  contentClassName?: string;
  /** 头部区域class */
  headerClassName?: string;
  /** 脚部区域class */
  footerClassName?: string;
}
```
