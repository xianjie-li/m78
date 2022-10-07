---
title: useDebounce
group:
  path: /effect
  order: 2
---

# useDebounce

传入一个函数，经过防抖处理后返回, 返回函数的内存地址会一直保持不变

## 示例

<code src="./useDebounce.demo.tsx" />

## API

```ts
function useDebounce<T extends AnyFunction>(fn: T, wait = 300): debounceFn;
```

**fn** - 待防抖的函数

**wait** - 防抖延迟时间

**throttleFn** - 经过防抖处理后的函数

**throttleFn.cancel()** - 取消防抖调用
