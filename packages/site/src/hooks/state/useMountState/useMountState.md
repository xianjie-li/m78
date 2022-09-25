---
title: useMountState
group:
  path: /state
  order: 3
---

# useMountState

用来方便的实现以下接口:

```css
interface UseMountStateConfig {
  /** true | 如果为true，在第一次启用时才真正挂载内容 */
  mountonenter?: boolean;
  /** false | 在关闭时卸载内容 */
  unmountonexit?: boolean;
}
```

例如, 有一个弹窗组件, 通过`open`控制是否打开, 我们希望他在第一次`open`后才挂载节点, 并在`open`为`false`时保留节点, 减少再次渲染的成本, 则可以使用此 hook

## 示例

<code src="./useMountState.demo.tsx" />

卸载的准确时机 hook 内是不能感知的，因为可能中间会存在动画或其他延迟行为，所以需要用户在正确时机调用 unmount()通知卸载

## API

```ts
function useMountState(
  toggle: boolean,
  config?: UseMountStateConfig
): [boolean, unmount];
```
