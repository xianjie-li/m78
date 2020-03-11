---
title: Input - 输入框
group:
    title: 数据录入
    path: /form
    order: 8000
---

# Input 输入框

用于无数据展示时对用户进行反馈

## 示例
<code src="./demo.tsx" />

## props
```tsx | pure
interface EmptyProps extends ComponentBaseProps {
  /** 描述 */
  desc?: React.ReactNode;
  /** 操作区域的内容 */
  children?: React.ReactNode;
  /** 图标和文字的尺寸 */
  size?: 'small' | 'large';
  /** 占位区域内容 */
  emptyNode?: React.ReactElement;
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










