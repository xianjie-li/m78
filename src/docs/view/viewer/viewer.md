---
title: Viewer - 查看器
group:
    title: 展示组件
    path: /view
---

# Viewer 查看器

创建一个可操作的展示区域，支持通过drag拖动、手势旋转、手势或鼠标滚轮缩放子元素

## 示例
😊 请在移动端体验此示例的完整`(手势支持)`效果

<code src="./demo.tsx" />

> 滚轮缩放会与页面滚动冲突，可通过`useLockBodyScroll`<!-- TODO: 添加链接 -->解决, 但是更推荐的做法是不在常规文档流中使用Viewer组件，如基于此组件实现的`image-preview`

## API
**`props`**
```tsx | pure
interface ViewerProps {
  /** 任何react可渲染的东西 */
  children: React.ReactNode;
  /** 禁用任何手势或实例方法 */
  disabled?: boolean;
}
```

**`ref`**
```tsx | pure
interface ViewerRef {
  setRotate(rotate: number): void;
  setScale(scale: number): void;
  reset(): void;
  instance: {
    scale: number;
    rotateZ: number;
    x: number;
    y: number;
    drag: boolean;
    pinch: boolean;
    wheel: boolean;
  };
}
```










