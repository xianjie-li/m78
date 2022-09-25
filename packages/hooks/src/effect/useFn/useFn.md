---
title: useFn
group:
  path: /effect
  order: 2
---

# useFn

用于代替`useCallback`，使回调函数的引用地址永久不变, 从而减少消费组件不必要的更新。

该 hook 的另一个用例是解决闭包导致的回调内外状态不一致问题，并且它不需要传递`deps`参数

## 示例

<code src="./useFn.demo.tsx" />

## API

```ts
const memoFn = useFn(fn, wraper?, deps?)
```

**memoFn** - 经过`memo`的`fn`，内存地址永久不变

**fn** - 需要`memo`化的回调

**wraper** - 接收 fn 并返回，可以藉此对函数实现节流等增强操作, 只在初始化和 deps 改变时调用

**deps** - 依赖数组，如果传入，其中任意值改变都会重载缓存的 fn，可以用来更新 wraper 包装的函数
