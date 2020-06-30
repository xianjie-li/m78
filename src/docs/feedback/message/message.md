---
title: Message - 消息提醒
group:
  title: 反馈
  path: /feedback
  order: 2000
---

# Message 消息提醒

用于对用户操作进行反馈

## 基础示例

message 组件基于 render-api 实现，包含轻提示、加载中、消息框三种用法

<code src="./message-demo.tsx" />

🔺 当操作在很快的时间内得到了响应时，loading 会一闪而过，这样会比不使用 loading 体验更差，所以在默认情况下，loading 包含一个 300ms 的显示/隐藏延迟

## 底层 api

上例中用到了`message.tips()` `message.loading()` `message.notify()`方法，类似于`$.ajax()`和`$.get()` `$.post()`的关系，这些方法可以通过底层方法`message()`来实现

<code src="./message-demo2.tsx" />

## API

**`message(option)`**

```tsx | pure
interface MessageOption extends ReactRenderApiExtraProps {
  /** 提示框的内容 */
  content?: React.ReactNode;
  /** 状态类型 */
  type?: 'success' | 'error' | 'warning';
  /** 持续时间，如果要一直存在，传Infinity */
  duration?: number;
  /** 是否启用遮罩层 */
  mask?: boolean;
  /** 设置为加载状态 */
  loading?: boolean;
  /** 是否显示关闭按钮 */
  hasCancel?: boolean;
  /** 300 | 延迟显示/隐藏loading的毫秒数 */
  loadingDelay?: number;
}
```

**`tips(option)`**

```tsx | pure
interface TipsOption extends ReactRenderApiExtraProps {
  /** 提示框的内容 */
  content?: React.ReactNode;
  /** 状态类型 */
  type?: 'success' | 'error' | 'warning';
  /** 持续时间，如果要一直存在，传Infinity */
  duration?: number;
  /** 是否启用遮罩层 */
  mask?: boolean;
}
```

**`loading(option?)`**

```tsx | pure
interface LoadingOption extends ReactRenderApiExtraProps {
  /** 提示框的内容 */
  content?: React.ReactNode;
  /** 持续时间，如果要一直存在，传Infinity */
  duration?: number;
  /** 是否启用遮罩层 */
  mask?: boolean;
  /** 300 | 延迟显示loading的毫秒数 */
  loadingDelay?: number;
}
```

**`notify(option)`**

```tsx | pure
interface NotifyOption extends ReactRenderApiExtraProps {
  /** 提示框的内容 */
  content?: React.ReactNode;
  /** 状态类型 */
  type?: 'success' | 'error' | 'warning';
  /** 持续时间，如果要一直存在，传Infinity */
  duration?: number;
  /** 是否启用遮罩层 */
  mask?: boolean;
  /** 是否显示关闭按钮 */
  hasCancel?: boolean;
  /** 标题 */
  title?: React.ReactNode;
  /** 详细内容 */
  desc?: React.ReactNode;
  /** 底部显示的内容 */
  foot?: React.ReactNode;
}
```

**相关接口**

```tsx | pure
interface ReactRenderApiExtraProps {
  /** 相同api下每次只会存在一个实例 */
  singleton?: boolean;
}
```
