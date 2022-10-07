---
title: useThrottle
group:
  path: /effect
  order: 2
---

# useThrottle

传入一个函数，经过节流处理后返回, 返回函数的内存地址会一直保持不变

## 示例

<code src="./useThrottle.demo.tsx" />

## API

```ts
function useThrottle<T extends AnyFunction>(
  fn: T,
  wait = 300,
  options?: UseThrottleOption
): throttleFn;

interface UseThrottleOption {
  /** true | 在节流开始前调用 */
  leading?: boolean;
  /** true | 在节流结束后调用 */
  trailing?: boolean;
}
```

**fn** - 待节流的函数

**wait** - 节流延迟时间

**throttleFn** - 经过节流处理后的函数

**throttleFn.cancel()** - 取消节流调用
