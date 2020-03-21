---
title: ShowFromMouse - 遮罩2
group:
  title: 工具
  path: /utils
  order: 5000
---

# ShowFromMouse 遮罩

与 [Mask](/#/utils/mask) 组件功能完全相同，区别是它的内容区域会从鼠标点击区域开始进入和离开并且固定显示于页面中间

注意事项:

- 作为 base 模块的依赖，使用此组件必须引入 base 模块
- children 的动画由组件内部实现，不需要像 Mask 组件一样单独再实现

## 示例

<code src="./demo.tsx" />

💡 [Modal](/#/feedback/modal) 组件基于此组件实现

## API

参数同 Mask 组件基本相同，更多参数请查看 [Mask](/#/utils/mask)

```ts
interface ShowFromMouseProps extends MaskProps {
  contClassName?: string;
  contStyle?: React.CSSProperties;
}
```
