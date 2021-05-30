---
title: ListView - 列表
group:
  title: 展示组件
  path: /view
---

# ListView - 列表

经典的展示组件

## 列表

<code src="./demo.tsx" />

## API

**`ListView`**

```tsx | pure
interface ListViewProps {
  /** 内容, 通常是一组ListViewItem */
  children: React.ReactNode;
  /** 多列模式 */
  column?: number;
  /** 调整布局紧凑程度、字号等 */
  size?: SizeEnum | Size;
  /** false | 列表容器显示边框 */
  border?: boolean;
  /**
   * 'splitLine' | 项的基础样式类型
   * - splitLine模式在开启了多列的情况下无效
   * */
  itemStyle?: 'splitLine' | 'border' | 'none' | ListViewItemStyleEnum;
  /** true | 列表项交互效果 */
  effect?: boolean;
}
```

**`ListViewItem`**

```tsx | pure
interface ListViewItemProps {
  /** 主要内容 */
  title: React.ReactNode;
  /** 次要内容 */
  desc?: React.ReactNode;
  /** 前导内容 */
  leading?: React.ReactNode;
  /** 尾随内容 */
  trailing?: React.ReactNode;
  /** 纵轴的对齐方式 */
  crossAlign?: FlexWrapProps['crossAlign'];
  /** 显示右侧箭头 */
  arrow?: boolean;
  /** 禁用（视觉禁用） */
  disabled?: boolean;
  /** 1 | 标题最大行数 */
  titleEllipsis?: number;
  /** 2 | 描述区域最大行数 */
  descEllipsis?: number;
}
```

**`ListViewTitle`**

```tsx | pure
interface ListViewTitle {
  /** 是否是子标题 */
  subTile?: boolean;
  /** 标题内容 */
  children?: React.ReactNode;
}
```
