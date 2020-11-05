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

对某个元素进行快速文本提示

<code src="./demo.tsx" />

## popper/confirm

- Popper 用来进行快速提示，并且可承载一些复杂操作

- Confirm 用于进行快速询问

<code src="./type.tsx" />

## trigger

指定不同的触发方式

<code src="./demo2.tsx" />

## target

通过`target`来指定挂载点，代替默认的`children`用法, `target`可以是一个指向`HTMLElement`的 ref 对象或者直接传入`HTMLElement`对象

<code src="./demo3.tsx" />

## 控制显示行为

通过`show`, `onChange`, `defaultShow` 来自行控制显示行为

<code src="./show.tsx" />

## flip

气泡被遮挡时，会自动调整到其他适合放置的位置, 滚动下方元素查看效果

<code src="./demo4.tsx" />

## 定制

如果有定制气泡组件的需求，使用 `customer`组件, 内置的三种组件类型均是通过`customer`实现, 接收气泡组件所有`props`和`show`/`setShow`来控制气泡状态

<code src="./coustom.tsx" />

## API

**`props`**

```ts
interface PopperProps extends ComponentBaseProps {
  /** tooltip | 气泡框类型 */
  type?: 'tooltip' | 'popper' | 'confirm';
  /** 气泡内容 */
  content?: React.ReactNode;
  /**
   * 子元素, 作为气泡的定位目标, 子元素包含以下限制
   * - 只能包含一个直接子节点
   * - 该节点能够支持className、onMouseEnter、onMouseLeave、onFocus、onClick等props
   * */
  children?: React.ReactElement;
  /** 'top' | 气泡方向, 会根据气泡的遮挡情况自动调整 */
  direction?: PopperDirectionKeys;
  /** 'hover' | 气泡的触发方式 */
  trigger?: PopperTriggerType | PopperTriggerType[];
  /**
   * 直接指定 [目标元素/指向目标元素的ref/表示位置的Bound对象] 作为定位目标
   * - 优先级大于children
   * - 如果使用bound，需要自行保证它的memo性，频繁的地址变更会造成性能损耗
   * */
  target?: HTMLElement | Bound | React.RefObject<HTMLElement>;
  /** 禁用 */
  disabled?: boolean;
  /** 标题，type为popper时生效 */
  title?: React.ReactNode;
  /** 获取实例对象 */
  instanceRef?: Ref<PopperRef>;

  /* ############ 显示 / mount状态 控制 ############ */
  /** 通过show/onChange手动控制显示、隐藏 */
  show?: boolean;
  /** 通过show/onChange手动控制显示、隐藏 */
  onChange?(show: boolean): void;
  /** 默认是否显示 */
  defaultShow?: boolean;
  /** true | 默认content会在气泡显示时才进行渲染，设置为false后会将content随组件一起预渲染 */
  mountOnEnter?: boolean;
  /** true | 在气泡隐藏会是否销毁content */
  unmountOnExit?: boolean;

  /* ############ confirm 特有配置 ############ */
  /** 确认 | 类型为confirm时，确认按钮的文字 */
  confirmText?: React.ReactNode;
  /** 取消 | 类型为confirm时，取消按钮的文字 */
  cancelText?: React.ReactNode;
  /** 点击确认的回调 */
  onConfirm?(): void;
  /** type为confirm时, 此选项用于设置图标 */
  icon?: React.ReactNode;
  /** 定制气泡样式 通过根节点选择器来命中箭头，如 .my-custom + .m78-popper_arrow */
  customer?(props: PopperPropsCustom): JSX.Element;

  /* ############ 不常用 ############ */
  /** 包裹元素，作为气泡边界的标识，并会在滚动时对气泡进行更新, 默认为第一个滚动父元素 */
  wrapEl?: HTMLElement | React.RefObject<any>;
  /** 12 | 气泡的偏移位置 */
  offset?: number;
}
```

**`相关接口`**

```ts
/** 触发类型 */
type PopperTriggerKeys = 'hover' | 'click' | 'focus';

/** 方向 */
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

/** 自定义Popper组件接口 */
interface PopperPropsCustom extends PopperProps {
  /** 设置显示状态 */
  setShow(patch: boolean | ((prevState: boolean) => boolean)): void;
  /** 当前显示状态 */
  show: boolean;
}
```
