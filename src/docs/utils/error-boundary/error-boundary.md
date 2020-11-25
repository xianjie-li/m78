---
title: ErrorBoundary - 错误边界
group:
  title: 反馈
  path: /utils
  order: 5000
---

# ErrorBoundary 错误边界

`Error Boundaries` API 的简单封装

## 示例

<code src="./demo.tsx" />

## 定制

<code src="./custom.tsx" />

## API

**`props`**

```tsx | pure
interface ErrorBoundaryProps extends ComponentBaseProps {
  /** 显示类型, 简洁模式和完整模式 */
  type?: 'simple' | 'full' | ErrorBoundaryType;
  /** 自定义错误反馈内容 */
  customer?: (infos: ErrorBoundaryCustomInfos) => React.ReactNode;
  /** 自定义重载时显示的加载指示器 */
  customLoadingNode?: React.ReactNode;
  /** 发生错误时触发，可用于向服务器上报错误信息 */
  onError?: (error: Error, errorInfo: any) => void;
}
```
