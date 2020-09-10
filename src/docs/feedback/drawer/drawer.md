---
title: Drawer - 抽屉
group:
  title: 反馈
  path: /feedback
  order: 2000
---

# Drawer 抽屉

与 Dialog 类似，在不跳转页面的情况下向用户展示一组内容, 区别是它从窗体边缘动画进入

💡 通过 [Modal](/feedback/modal) 作为底层实现, 基本的用法如显示/隐藏的不同控制方式、mask、位置、动画、渲染特性等请查阅其文档

## 基础示例

<code src="./demo.tsx" />

## API

该组件 props 继承至 ModalBaseProps 的子集, 完整配置等请参考 [Modal](/feedback/modal)

```tsx | pure
type OmitModalSpecific = Omit<
  ModalBaseProps,
  | 'baseZIndex'
  | 'namespace'
  | 'alignment'
  | 'animationType'
  | 'onRemove'
  | 'onRemoveDelay'
  | 'config'
  | 'innerRef'
>;

export interface DrawerProps extends OmitModalSpecific {
  /** 是否显示关闭按钮 */
  closeIcon?: boolean;
  /** 方向 */
  direction?: 'bottom' | 'left' | 'right' | 'top';
  /** 全屏 */
  fullScreen?: boolean;
}
```
