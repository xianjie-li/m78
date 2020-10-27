---
title: BackTop - 返回顶部
group:
  title: 导航
  path: /Navigation
  order: 4000
---

# BackTop 返回顶部

用于长页面的返回顶部按钮

## 示例

默认情况下，`BackTop`挂载在 body 下，并会从当前节点开始查找父级第一个可滚动元素作为监听节点

<code src="./demo.tsx" />

## 指定元素

可以直接指定元素作为监听点，然后搭配`style`或`className`将其作用域滚动区局部

<code src="./demo2.tsx" />

## props

```tsx | pure
interface BackTopProps extends ComponentBaseProps {
  /**
   * 目标滚动容器
   * - 如果未传入会查找第一个可滚动的父级，且挂载到body下
   * - 如果传入，挂载到组件所在位置并以传入节点作为滚动目标
   * */
  target?: HTMLElement | RefObject<HTMLElement>;
  /** 自定义内容 */
  children?: React.ReactNode;
  /** 500 | 滚动达到此高度时出现 */
  threshold?: number;
  /** 200 | 防抖时间(ms) */
  debounceTime?: number;
}
```
