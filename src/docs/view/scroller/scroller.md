---
title: Scroller - 滚动容器
group:
  title: 展示组件
  path: /view
  order: 4000
---

# Scroller 滚动容器

## 示例

<code src="./scroller-demo.tsx" />

## 滚动指示

滚动进度条、可滚动标识器


## props

```tsx | pure
interface ArticleBoxProps extends ComponentBaseProps {
  /** 合法的html字符串 */
  html?: string;
  /** 可以传入react节点代替html */
  content?: React.ReactNode;
  /** 水印内容，不传时无水印 */
  watermark?: React.ReactNode;
}
```

**相关接口**

```tsx | pure
interface ComponentBaseProps {
  /** 包裹元素的类名 */
  className?: string;
  /** 包裹元素样式 */
  style?: React.CSSProperties;
}
```
