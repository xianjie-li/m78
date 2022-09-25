---
title: useEffectEqual
group:
  path: /effect
  order: 2
---

# useEffectEqual

支持对 deps 进行深度对比的`useEffect`

💡 保持 deps 值结构相对简单能够减少对比深度，从而提高性能

## 示例

<code src="./useEffectEqual.demo.tsx" />

## API

```ts
function useEffectEqual(
  effect: React.EffectCallback,
  deps?: any[],
  customizer?: IsEqualCustomizer
);
```

**effect** - 同 useEffect 参数 1

**deps** - 依赖数组，用法与 useEffect 一致，但是会对 dep 项执行深对比, 所以支持传入对象等复杂结构

**customizer** - 可以通过此函数自定义对比方式, 如果相等返回 true，否则返回 false, 返回 undefined 时使用默认对比方式
