---
title: Pin - 固钉
group:
  title: 导航
  path: /Navigation
  order: 4000
---

# Pin 固钉

在内容即将滚动出窗口时将其固定在窗口内部

## 窗口固钉

<code src="./demo.tsx" />

## 指定 target

可以指定元素滚动容器

<code src="./demo2.tsx" />

## props

```tsx | pure
interface PinProps extends ComponentBaseProps {
  /** 指定目标元素，默认为第一个可滚动父元素 */
  target?: HTMLElement | RefObject<any>;
  /** 需要滚动固定的内容 (不能是文本节点、如果包含特殊定位(absolute等), 最好由外层节点控制) */
  children?: React.ReactNode;

  /** 禁用顶部固钉 */
  disableTop?: boolean;
  /** 禁用底部固钉 */
  disableBottom?: boolean;
  /** 0 | 距离顶部此距离时触发 */
  offsetTop?: number;
  /** 0 | 距离顶部此距离时触发 */
  offsetBottom?: number;
}
```
