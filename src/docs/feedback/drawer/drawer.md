---
title: Drawer - 抽屉
group:
    title: 反馈
    path: /feedback
    order: 8000
---

# Drawer 抽屉

与Modal类似，在不跳转页面的情况下向用户展示一组内容

## 基础示例

<code src="./demo.tsx" />

## API
```tsx | pure
interface DrawerProps extends ComponentBaseProps, ReactRenderApiProps {
  /** 是否显示关闭按钮 */
  hasCloseIcon?: boolean;
  /** 方向 */
  direction?: 'bottom' | 'left' | 'right' | 'top';
  /** 全屏 */
  fullScreen?: boolean;
  /** 使drawer依附于它的父元素而不是body，确保父元素非常规定位元素 */
  inside?: boolean;
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











