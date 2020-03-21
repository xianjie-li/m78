---
title: Ellipsis - 超出隐藏
group:
    title: 展示组件
    path: /base
    order: 1000
---

# Ellipsis 超出隐藏

用于长文本的超出隐藏

## 示例
<code src="./demo.tsx" />

> 💡 当使用普通CSS模式时，子元素是复杂的嵌套结构会导致隐藏失效，使用`forceCompat`模式则无此限制

## API
**`props`**
```tsx | pure
interface MaskProps extends React.PropsWithoutRef<JSX.IntrinsicElements['div']> {
  /** 1 | 最大行数 */
  line?: number;
  /** 兼容模式时默认适合亮色主题，通过此项设置为暗色 */
  dark?: boolean;
  /** 强制启用兼容模式 */
  forceCompat?: boolean;
  /** 禁用 */
  disabled?: boolean;
}
```
