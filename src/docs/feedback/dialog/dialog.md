---
title: Dialog - 对话框
group:
  title: 反馈
  path: /feedback
  order: 2000
---

# Dialog 对话框

用于在不跳转页面的前提下为用户提供询问、表单等操作.

> 💡 通过 [Overlay](/feedback/overlay) 作为底层实现, 基本的用法如显示/隐藏控制、mask、位置、动画、渲染特性等请查阅其文档

## 基础示例

Dialog 组件的配置非常多样化，通过合理的配置可以实现绝大多数的对话框功能

<code src="./demo.tsx" />

## onClose

在通过关闭按钮/确认/或点击dialog以外区域进行关闭时, 会触发`onClose(isConfirm)`, 如果是通过确认按钮触发, 则`isConfirm`为`true`

同时, 为`onClose`返回不同的类型可以达到不同的效果:
- 返回`false`, 阻止默认的关闭行为
- 返回一个`Promise`对象, `dialog`进入加载状态, 如果`promise` resolve的值为`false`或抛出异常则阻止关闭

<code src="./on-close.tsx" />

## overlay

组件通过[overlay](/docs/feedback/overlay)作为底层实现, 所以支持它的所有用法, 将两者结合能实现很多有趣的用法, 更多使用细节请见`overlay`文档

<code src="./overlay.tsx" />


## 通过 api 使用

通过[renderApi](/docs/ecology/render-api) 实现了api用法, 你可以在组件结构以外的任意位置通过api来渲染dialog

> 查阅renderApi文档来学会如何使用api来管理和更新渲染的实例以及更多用法.

<code src="./api.tsx" />

## 嵌入表单

<code src="./form.tsx" />


## API

除了以下扩展api外, 支持[Overlay](/feedback/overlay)所有用法, 以及通过[renderApi](/docs/ecology/render-api)来进行api渲染.

```ts
interface DialogProps extends OverlayProps {
  /** 360 | 内容区域的宽度 */
  width?: number | string;
  /** '提示' | 标题文本 */
  title?: string;

  /**
   * 默认的关闭按钮/确认按钮/右上角关闭按钮点击, 或触发了clickAway时调用, 不同的返回类型会有不同的效果
   * - 返回false, 阻止默认的关闭行为
   * - 返回一个Promise, dialog进入加载状态, 如果promise resolve的值为false或抛出异常则阻止关闭
   * */
  onClose?(isConfirm?: boolean): any;

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

  /** 自定义顶部内容，会覆盖title的配置 */
  header?: React.ReactNode;
  /** 自定义底部内容，与其他底部相关配置的优先级为 footer > btns > confirm、close */
  footer?: React.ReactNode;
  /** 通过配置设置按钮组, 配置项与Button组件的props完全相同 */
  btnList?: ButtonPropsWithHTMLButton[];
  /** 自定义内容区域props */
  contentProps?: JSX.IntrinsicElements['div'];
  /** 自定义头部区域props */
  headerProps?: JSX.IntrinsicElements['div'];
  /** 自定义脚部区域props */
  footerProps?: JSX.IntrinsicElements['div'];
}

在api用法中, 以下props无效
/** 在使用api调用时所有应该剔除的props */
export const omitApiProps = [
  'defaultShow',
  'show',
  'onChange',
  'children',
  'childrenAsTarget',
  'triggerType',
  'onUpdate',
  'onDispose',
  'innerRef',
  'instanceRef',
] as const;
```
