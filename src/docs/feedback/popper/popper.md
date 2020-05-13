---
title: Popper - 气泡框
group:
  title: 反馈
  path: /feedback
  order: 2000
---

# Popper 气泡框

通过一个相对于元素位置的气泡框来对用户进行轻量提示或操作提示

## tooltip

一个用于对某个元素进行快速提示的组件, 不应该包含复杂的操作

<code src="./demo.tsx" />

## Popper/Confirm

相对于 tooltip，用来进行快速提示，并且可承载一些复杂操作

<code src="./demo2.tsx" />

## 挂载多个气泡

通过`target`，可以实现一个元素挂载多个气泡

<code src="./demo3.tsx" />

## 位置修复

气泡被遮挡时，会自动调整到其他适合放置的位置, 滚动下方元素查看效果

<code src="./demo4.tsx" />

## API

**`props`**

```ts
interface PopperProps extends ComponentBaseProps {
  /** 直接指定 目标元素/包含目标元素的ref对象/一个表示位置的GetPopperMetasBound对象, 优先级大于children */
  target?: HTMLElement | GetPopperMetasBound | React.MutableRefObject<HTMLElement>;
  /** 气泡方向 */
  direction?: GetBoundMetasDirectionKeys;
  /**
   * 子元素, 作为气泡的定位对象使用, 子元素包含以下限制
   * 1. 只能包含一个直接子节点
   * 2. 该节点能够接受onMouseEnter、onMouseLeave、onFocus、onClick等事件
   * */
  children?: React.ReactElement;
  /** 包裹元素，作为气泡边界的标识，并会在滚动时对气泡进行更新, 默认情况下，边界为窗口，并在window触发滚动时更新气泡 */
  wrapEl?: HTMLElement | React.MutableRefObject<any>;
  /** 12 | 气泡的偏移位置 */
  offset?: number;
  /** 气泡内容 */
  content?: React.ReactNode;
  /** 气泡的触发方式 */
  trigger?: PopperTriggerType | PopperTriggerType[];
  /** 默认是否显示 */
  defaultShow?: boolean;
  /** 通过show/onChange手动控制显示、隐藏 */
  show?: boolean;
  /** 通过show/onChange手动控制显示、隐藏 */
  onChange?(show: boolean): void;
  /** true | 默认content会在气泡显示时才进行渲染，设置为false后会将content随组件一起预渲染 */
  mountOnEnter?: boolean;
  /** false | 在气泡隐藏会是否销毁content */
  unmountOnExit?: boolean;
  /** 禁用 */
  disabled?: boolean;
  /** tooltip | 气泡框类型 */
  type?: 'tooltip' | 'popper' | 'confirm';
  /** 标题，type为popper时生效 */
  title?: React.ReactNode;
  /* ============ confirm特有配置 ============ */
  /** 确认 | 类型为confirm时，确认按钮的文字 */
  confirmText?: React.ReactNode;
  /** 取消 | 类型为confirm时，取消按钮的文字 */
  cancelText?: React.ReactNode;
  /** 点击确认的回调 */
  onConfirm?(): void;
  /** type为confirm时, 此选项用于设置图标 */
  icon?: React.ReactNode;
}
```

**`相关接口`**

```ts
type PopperTriggerType = 'hover' | 'click' | 'focus';

type GetBoundMetasDirectionKeys =
  | 'topStart'
  | 'top'
  | 'topEnd'
  | 'leftStart'
  | 'left'
  | 'leftEnd'
  | 'bottomStart'
  | 'bottom'
  | 'bottomEnd'
  | 'rightStart'
  | 'right'
  | 'rightEnd';

interface ComponentBaseProps {
  /** 包裹元素的类名 */
  className?: string;
  /** 包裹元素样式 */
  style?: React.CSSProperties;
}
```
