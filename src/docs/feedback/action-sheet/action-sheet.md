---
title: ActionSheet - 操作面板
group:
  title: 反馈
  path: /feedback
  order: 2000
---

# ActionSheet 操作面板

快捷的提示用户进行一组操作

## 基础示例

基于 useFormState <!-- TODO: 添加链接  --> 实现，可以当做常规的表单组件使用

<code src="./demo.tsx" />

## 通过 api 调用

api 形式使用，支持编程式渲染、更新、关闭等，具体见 render-api <!-- TODO: 添加链接  -->

<code src="./demo-api.tsx" />

## API

**`Item`**

```tsx | pure
interface ActionSheetItem {
  /* 该选项标题 */
  name: string;
  /* 选项的唯一标识 */
  id: number;
  /* 详情 */
  desc?: string;
  /* 高亮该项 */
  highlight?: boolean;
  /* 禁用该项 */
  disabled?: boolean;
}
```

**`props`**

```tsx | pure
interface ActionSheetProps extends ReactRenderApiProps, FormLike<ActionSheetItem> {
  /** 操作项配置 */
  options: ActionSheetItem[];
  /** 标题 */
  title: string;
  /** true | 是否开启选择模式，选择后需要确认才会进行关闭 */
  isConfirm?: boolean;
  /** isConfirm时，点击确认按钮后触发  */
  onConfirm?: (option: ActionSheetItem | undefined) => void;
  /** '确认' | 确认按钮文本 */
  confirmText?: string;
}
```

**`api option`**

```tsx | pure
type ActionSheetOption = Omit<ActionSheetProps, keyof ReactRenderApiProps>;
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

interface FormLike<T> {
  value?: T;
  onChange?: (value: T) => void;
  defaultValue?: T;
}
```
