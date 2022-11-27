---
title: useMeasure
group:
  path: /ui
---

# useMeasure

通过 ResizeObserver api 监听元素尺寸位置改变

## 示例

<code src="./useMeasure.demo.tsx"></code>
<demo demo={require("./useMeasure.demo.tsx")} code={require("!!raw-loader!./useMeasure.demo.tsx")}></demo>

## API

```tsx | pure
/**
 * 实时测量一个元素的尺寸
 * @param target - 目标节点
 * @param debounceDelay - 延迟设置的时间, 对于变更频繁的节点可以通过此项提升性能
 * @return
 *  - return[0] - 元素的尺寸, 位置等信息
 *  - return[1] - 用于直接绑定的ref
 * */
function useMeasure<T>(
  target?: HTMLElement | RefObject<HTMLElement>,
  debounceDelay?: number
): readonly [DOMRectReadOnly, MutableRefObject<T>];
```
