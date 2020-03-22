---
title: Modal - 对话框
group:
  title: 反馈
  path: /feedback
  order: 2000
---

# Modal 对话框

用于提示用户进行一组操作而不必跳转页面，或是给予用户一些快捷提示

## 基础示例

Modal 组件的配置非常多样化，通过合理的配置可以实现绝大多数的 Modal 功能

<code src="./demo.tsx" />

## 通过 api 使用

通过[render-api](/#/utils/render-api)来进行组件外渲染

<code src="./demo-api.tsx" />

## 完全定制

使用`content`参数，你可以最大化的对 Modal 进行定制，它将会覆盖所有的默认节点选项

<code src="./demo-custom.tsx" />

`css`

```css
.modal {
  text-align: center;
  border-radius: 2px;
  overflow: hidden;
}
.modal-img img {
  width: 100%;
}
.modal-title {
  margin: 24px 0 12px;
  font-size: 18px;
}
.modal-cont {
  padding: 0 24px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
}
.modal-btn {
  margin: 12px 12px 24px;
  font-size: 18px;
}
```

## API

```tsx | pure
interface ModalProps extends ReactRenderApiProps, ComponentBaseProps {
  /** 启用响应式按钮，按钮会根据底部的宽度平分剩余宽度 */
  flexBtn?: boolean;
  /** 内容区域的最大宽度, 默认为360 */
  maxWidth?: number | string;
  /** 自定义顶部内容，会覆盖title的配置 */
  header?: React.ReactNode;
  /** '提示' | 标题文本 */
  title?: string;
  /** 内容区域 */
  children?: React.ReactNode;
  /** 通过配置设置按钮组 */
  btns?: (Pick<ButtonProps, 'color' | 'children' | 'onClick' | 'disabled' | 'icon' | 'link'> & {
    text: string;
  })[];
  /** 自定义底部内容，与其他底部相关配置的优先级为 footer > btns > confirm、close */
  footer?: React.ReactNode;
  /** 默认的确认按钮被点击时 */
  onConfirm?(): void;
  /** false | '取消' | 是否显示取消按钮，传入string时，为按钮文本 */
  close?: boolean | string;
  /** '确认' | 是否显示确认按钮，传入string时，为按钮文本 */
  confirm?: boolean | string;
  /** true | 是否显示遮罩 */
  mask?: boolean;
  /** true | 是否允许点击mask进行关闭 */
  maskClosable?: boolean;
  /** true | 是否显示关闭图标 */
  closeIcon?: boolean;
  /** 设置弹层为loading状态，阻止操作(在loading结束前会阻止mask点击关闭以及防止弹层点击) */
  loading?: boolean;
  /** 使用自定义内容完全替换默认渲染内容，会覆盖掉footer、header、title区域并使相关的配置失效 */
  content?: React.ReactNode;
  /** 设置modal的状态 */
  status?: 'success' | 'error' | 'warning';
  /** 内容区域class */
  contentClassName?: string;
  /** 头部区域class */
  headerClassName?: string;
  /** 脚部区域class */
  footerClassName?: string;
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

interface ReactRenderApiProps {
  /** 实例组件是否显示 */
  show?: boolean;
  /** 从实例列表移除指定实例, 如果组件带关闭动画，请先使用onClose，然后在show = false时执行关闭动画并在合适的时机执行此方法来移除实例 */
  onRemove?: () => void;
  /** 将该项的show设置为false */
  onClose?: () => void;
  /** 此参数透传至createRenderApi(options)中的option.namespace，用于帮助组件渲染到自定义命名的节点下
   *  用于某些可能会存在组件形式与api形式一起使用的组件(如modal)，同节点下渲染两种组件会造成react渲染冲突。
   * */
  namespace?: string;
}
```
