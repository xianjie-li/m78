---
title: Modal - 弹层
group:
  title: 反馈
  path: /feedback
  order: 5000
---

# Modal 弹层

Modal 是 Dialog 以及其他大多数弹层类组件的底层组件，用于便捷的创建提示层, 涵盖了大多数弹层场景所需的功能

🤔 如果你需要一个开箱即用的对话框/提示组件等, 请使用[Dialog](/m78/docs/feedback/dialog)/[Message](/m78/docs/feedback/message)等组件, 如果对弹窗有很强的定制意愿，请使用此组件

## 基本使用

可通过四种方式使用:

1. 通过 show/onChange 手动控制 modal 显示状态
2. 通过 triggerNode 配置一个节点用于开关 Modal
3. 通过 defaultShow 进行初始渲染并将控制权交由组件内部(不演示，直接传 defaultShow 即可)
4. 通过 Modal.api()来进行 api 形式的调用

<code src="./base.tsx" />

## 位置

通过 alignment 来自由定制弹窗出现出现的位置 alignment 是一个包含两个项的元组，取值区间为 `[0, 0] ~ [1, 1]`, 分别代表屏幕的左上角到右下角、x 轴/y 轴

<code src="./alignment.tsx" />

## 动画

内置了很多动画效果，默认是从鼠标位置出现、隐藏

下面是一个包含所有动画类型演示的套娃示例

<code src="./animation.tsx" />

## 遮罩

## API

`**props**`

```ts
export interface ModalBaseProps extends ComponentBaseProps {
  /** Modal要展示的内容 */
  children: React.ReactNode;
  /** 默认显示状态，与show同时使用时无效 */
  defaultShow?: boolean;
  /** 手动控制modal的显示/隐藏, 与onClose搭配作为受控模式使用 */
  show?: boolean;
  /** 显示状态发生改变时触发 */
  onChange?: (currentShow: boolean) => void;
  /** 可选, 传入一个占位节点来作为Modal的控制开关, 在非受控时会直接代理show的值，受控时通过onChange回传最新状态 */
  triggerNode?: React.ReactElement;
  /** MODAL' | 自定义挂载节点的命名空间 */
  namespace?: string;
  /** 1800 | 基准zIndex值，默认为Modal层(1800) */
  baseZIndex?: number;
  /** true | 是否显示遮罩 */
  mask?: boolean;
  /** 设置到mask节点上的className */
  maskClassName?: string;
  /** true | 点击内容区域以外是否关闭Modal */
  clickAwayClosable?: boolean;
  /** 'light' | mask主题色 */
  maskTheme?: 'dark' | 'light';
  /** [0.5, 0.5] | 指定x/y轴位置, 值为 -1 ~ 1, 例：[0.5, 0.5] -> 居中， [1, 0] -> 右上， [1, 1] -> 右下 */
  alignment?: TupleNumber;
  /** 动画类型, 默认从光标位置出现 */
  animationType?: TransitionTypes | 'fromMouse';
  /** true | 开启后内容会在Modal开启时才进行渲染，关闭后内容随Modal一起渲染, 并根据show状态决定是否显示 */
  mountOnEnter?: boolean;
  /** false | Modal关闭后是否卸载其内容 */
  unmountOnExit?: boolean;
  /** true | modal出现时锁定滚动条 */
  lockScroll?: boolean;
}

interface ComponentBaseProps {
  /** 包裹元素的类名 */
  className?: string;
  /** 包裹元素样式 */
  style?: React.CSSProperties;
}
```

`**Modal.api()**` 接口如下

```ts
interface ModalBaseApi
  extends Omit<
    ModalBaseProps,
    // 除了以下配置外的所有配置均支持在api中使用
    'children' | 'defaultShow' | 'show' | 'triggerNode' | 'mountOnEnter' | 'unmountOnExit'
  > {
  // Modal的内容，替换了children
  content: ModalBaseProps['children'];
}
```
