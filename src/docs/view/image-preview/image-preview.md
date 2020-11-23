---
title: ImagePreview - 图片浏览
group:
  title: 展示组件
  path: /view
  order: 4000
---

# ImagePreview 图片浏览

对一组图片进行浏览

## 示例

💡 支持`Viewer`组件的所有手势

<code src="./demo.tsx" />

## 通过 api 调用

基于`render-api`进行 api 形式渲染

<code src="./demo-api.tsx" />

## 列表

<code src="./demo-list.tsx" />

## props

```tsx | pure
interface ImagePreviewProps extends ReactRenderApiProps {
  /** 图片数据 */
  images?: { img: string; desc?: string }[];
  /** 初始页码，组件创建后页码会由组件内部管理，当page值改变时会同步到组件内部 */
  page?: number;
}
```

**相关接口**

```tsx | pure
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
