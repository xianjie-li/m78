---
title: PageHeader - 页头
group:
  title: 导航
  path: /Navigation
  order: 4000
---

# PageHeader 页头

一个通用的页头组件

## 示例

<code src="./demo.tsx" />

## props

```tsx | pure
interface PageHeaderProps extends ComponentBaseProps {
  /** 标题 */
  title?: React.ReactNode;
  /** 操作区域 */
  actions?: React.ReactNode;
  /** false | 居中显示标题和描述 */
  centerTitle?: boolean;
  /** 颜色, 为true时使用主题色，为字符串时作为颜色使用 */
  color?: string | boolean;

  /** 描述 */
  desc?: React.ReactNode;
  /** 左侧内容(返回按钮后) */
  leading?: React.ReactNode;
  /** false | 白色前景(按钮、文字、边框) */
  white?: boolean;
  /** 自定义返回按钮, 为null时隐藏 */
  backIcon?: React.ReactElement | null;
  /** 点击返回时触发，如果传入，会替换默认的返回行为 */
  onBack?: () => void;
  /**
   * 固定模式
   * - 为防止固定后页面内容上移导致被遮挡，会在挂在位置生成一个同等高度得占位节点
   * - 这种模式只适合防止再页面顶部，如果有特殊需求，可以通过className自行配置fixed样式
   * */
  fixed?: boolean;

  /** 开启阴影 */
  shadow?: boolean;
  /** 开启边框, 优先级高于shadow */
  border?: boolean;
  /** 底部区域显示的内容 */
  bottom?: React.ReactNode;
}
```
