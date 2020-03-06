---
title: Result - 结果
group:
    title: 反馈
    path: /feedback
    order: 8000
---

# Result 结果

用于对用户操作结果进行反馈或提示进行某类操作

## 示例
message组件基于render-api实现，包含轻提示、加载中、消息框三种用法

<code src="./demo.tsx" />

## API
```tsx | pure
type ResultTypes =
  | 'success'
  | 'error'
  | 'warning'
  | 'waiting'
  | 'notFound'
  | 'serverError'
  | 'notAuth'

export interface ResultProps {
  /** true | 组件开关，任意falsy或truthy值 */
  show?: boolean;
  /** 'success' | 类型 */
  type?: ResultTypes;
  /** '操作成功' | 标题 */
  title?: string;
  /** 描述 */
  desc?: string;
  /** 子元素会作为说明区域显示 */
  children?: React.ReactNode;
  /** 操作区，一般会传递一组按钮或连接 */
  actions?: React.ReactNode;
  /** false | 浮动模式，脱离文档流全屏进行展示 */
  fixed?: boolean;
}
```










