---
title: Viewer - 查看器
group:
    title: 展示组件
    path: /view
    order: 4000
---

# Viewer 查看器

创建一个可操作的展示区域，支持通过drag拖动、手势旋转、手势或鼠标滚轮缩放子元素

## 示例
😊 请在移动端体验此示例的完整`(手势支持)`效果

<code src="./demo.tsx" />

## API
**`props`**
```tsx | pure
interface ViewerProps {
  /** 任何react可渲染的东西 */
  children: React.ReactNode;
  /** false | 禁用任何手势或实例方法 */
  disabled?: boolean;
  /** 传入一个dom元素或一个ref对象用于限制可拖动的范围, 默认拖动范围为当前元素宽高值 * 缩放比 */
  bound?: React.MutableRefObject<Element> | Element;
  /** true | 单独开启关闭某一类事件 */
  drag?: boolean;
  pinch?: boolean;
  wheel?: boolean;
}
```

**`ref`**
```tsx | pure
interface ViewerRef {
  /** 设置旋转角度 */
  setRotate(rotate: number): void;
  /** 设置缩放比例 */
  setScale(scale: number): void;
  /** 还原所有状态 */
  reset(): void;
  /** 实例属性 */
  instance: {
    /** 只读 | 当前缩放比 */
    scale: number;
    /** 只读 | 当前旋转角度 */
    rotateZ: number;
    /** 只读 | x轴偏移距离 */
    x: number;
    /** 只读 | y轴偏移距离 */
    y: number;
    /** 拖动是否可用 */
    drag: boolean;
    /** 捏、双指展开是否可用 */
    pinch: boolean;
    /** 鼠标滚动是否可用 */
    wheel: boolean;
  };
}
```
