---
title: List - 列表
group:
  title: 展示组件
  path: /view
  order: 4000
---

# List - 列表

用于展示列表图片、段落，同时也用作表单的布局和展示

## 列表

<code src="./demo.tsx" />

## API

**`List`**

```tsx | pure
interface ListType extends ComponentBasePropsWithAny {
  /** false | 开启表单模式 */
  form?: boolean;
  /** false | 是否去掉列表项边框 */
  notBorder?: boolean;
  /** 'vertical' | 横向表单/纵向表单 */
  layout?: 'horizontal' | 'vertical';
  /** 1 | 当大于1时，表单为多列模式 */
  column?: number;
  /** false | 不限制最大宽度 */
  fullWidth?: boolean;
  /** false | 禁用表单 */
  disabled?: boolean;
}
```

**`Item`**

```tsx | pure
interface ListItemProps extends ComponentBasePropsWithAny {
  /** 左侧插槽内容 */
  left?: React.ReactNode;
  /** 左侧插槽内容的垂直对其方式，默认居中 */
  leftAlign?: 'top' | 'bottom';
  /** 标题内容，超过两行会自动截行 */
  title: React.ReactNode;
  /** 描述内容，超过两行自动截行 */
  desc?: React.ReactNode;
  /** 右侧的额外描述内容 */
  extra?: React.ReactNode;
  /** 底部内容 */
  footLeft?: React.ReactNode;
  /** 底部内容右侧 */
  footRight?: React.ReactNode;
  /** 是否显示右箭头 */
  arrow?: boolean;
  /** 强制开启点击效果，默认只有带arrow和onClick的项会开启 */
  effect?: boolean;
  /** 自定义要在arrow区域显示的内容 */
  icon?: React.ReactNode;
  /** 禁用该列表项 */
  disabled?: boolean;
  /** 列表状态，会改变footLeft内的文本颜色并在icon插槽内显示反馈图标 */
  status?: 'success' | 'error' | 'warning';
  /** 表单类型的List适用，放置表单控件或说明文本 */
  children?: React.ReactNode;
  /** 标记该项为必填项（标题后会带红色*号） */
  require?: boolean;
  /** 1 | 2 标题和描述的最大行数 */
  titleEllipsis?: number;
  descEllipsis?: number;
}
```

**`Title`**

```tsx | pure
interface ListTitleType extends ComponentBasePropsWithAny {
  /** 标题内容 */
  title: React.ReactNode;
  /** 描述内容 */
  desc?: React.ReactNode;
}
```

**`SubTitle`**

```tsx | pure
interface ListSubTitleType extends ComponentBasePropsWithAny {
  /** 标题内容 */
  title: React.ReactNode;
}
```

**`相关接口/Footer`**

```tsx | pure
interface ComponentBaseProps {
  /** 包裹元素的类名 */
  className?: string;
  /** 包裹元素样式 */
  style?: React.CSSProperties;
}

interface ComponentBasePropsWithAny extends ComponentBaseProps {
  /** 透传到包裹元素上的属性 */
  [key: string]: any;
}
```
