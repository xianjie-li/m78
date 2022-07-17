---
title: Notify - 消息提醒
group:
  title: 反馈
  path: /feedback
  order: 2000
---

# Notify 消息提醒

各种轻提示: 消息、通知、loading 等

## 用法/示例

<code src="./demo.tsx" />

此模块包含一个由[renderApi](/docs/ecology/render-api)创建的渲染对象 `notify`, 你可以通过它来渲染消息提示, 或管理/更新已渲染的实例, renderApi 的更多用法请参考其文档.

```ts
import { notify } from 'm78/notify';

notify.render(option);
```

`option`是一个包含以下内容的配置对象:

```ts
interface NotifyState {
  /** 显示的内容, 传入一个函数时会完全替换默认节点, 用于高度定制 */
  content?: React.ReactNode | (() => React.ReactNode);
  /** 'info' | 状态 */
  status?: StatusUnion;
  /** 标题 */
  title?: React.ReactNode;
  /** 'center' | 显示的位置 */
  position?: NotifyPositionUnion;
  /** 1000 | 持续时间，如果不需要自动关闭，传Infinity */
  duration?: number;
  /** 渲染操作栏, 可通过props.onChange(false)来主动关闭, props.onUpdate(newState)来更新状态 */
  actions?: (props: NotifyProps) => React.ReactNode;
  /** 显示关闭按钮 */
  cancel?: boolean;
  /** 是否启用遮罩层 */
  mask?: boolean;
  /** 设置为加载状态 */
  loading?: boolean;
  /** 触摸或光标移动到上方时是否暂停notify动画计时, tips和notify类型默认为true */
  interactive?: boolean;
  /** 隐藏的延迟, 用于loading()实现, 防止loading状态一闪而过 */
  hideDelay?: boolean;
}
```

另外, 还扩展了一个上层方法便于简单的生成`loading`

```ts
const ins = notify.loading(option);

// loading()返回一个render实例, 让你可以在合适的时机关闭它, 更多用法见renderApi文档
ins.hide();

// loading支持notify的部分api以及特有的text
interface LoadingOption {
  /** 'center' | 显示的位置 */
  position?: NotifyPositionUnion;
  /** 是否启用遮罩层 */
  mask?: boolean;
  /** 隐藏的延迟, 用于loading()实现, 防止loading状态一闪而过 */
  hideDelay?: boolean;
  /** loading提示文本 */
  text?: React.ReactNode;
}
```

支持的方向

```ts
enum NotifyPosition {
  top = 'top',
  bottom = 'bottom',
  center = 'center',
  leftTop = 'leftTop',
  leftBottom = 'leftBottom',
  rightTop = 'rightTop',
  rightBottom = 'rightBottom',
}
```
