---
title: ArticleBox - 富文本盒子
group:
    title: 展示组件
    path: /view
    order: 4000
---

# ArticleBox 富文本盒子

一个用于展示富文本的容器

与直接渲染的区别：
* 对图片、表格等做了限制处理，可以防止过宽的图片超出容器破坏样式，并且可以很好的支持移动端
* 添加水印

## 示例
<code src="./article-box-demo.tsx" />


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










