---
title: NoSSR - 非服务端渲染
group:
  title: 工具包
  path: /utils
  order: 5000
---

# NoSSR - 非服务端渲染

此组件用于跳过 SSR，以此达到以下目的：

- 跳过一些非必要组件的服务端渲染，如：时间选择器、列表筛选项、表单等等，这些内容通常对`SEO`没有任何意义
- 跳过一些不支持 SSR 的组件渲染
- 由于跳过了不必要的渲染，服务端的渲染压力更小，呈现速度也会更快
- 在服务器渲染压力过大时，可以临时通过此组件来跳过服务端渲染，将渲染压力分到用户端

## 示例

<code src="./demo.tsx" />

## Props

```tsx | pure
interface NoSSRProps {
  /** 不在SSR节点渲染的节点 */
  children?: React.ReactNode;
  /** 作为回退的内容, 在服务端渲染 */
  feedback?: React.ReactNode;
}
```
