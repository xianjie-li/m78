---
title: ShowFromMouse - 遮罩2
group:
    title: 工具
    path: /utils
    order: 7000
---

# ShowFromMouse  遮罩

与 [Mask](/#/utils/mask) 组件功能完全相同，区别是它的内容区域会从鼠标点击区域开始进入和离开并且固定显示于页面中间

注意事项:
* 作为base模块的依赖，使用此组件必须引入base模块
* children的动画由组件部实现，不需要像Mask组件一样单独再实现

## 示例
<code src="./demo.tsx" />


💡 [Modal](/#/utils/modal) 组件基于此组件实现

## API
参数同Mask组件基本相同，更多参数请查看 [Mask](/#/utils/mask)
```ts
interface ShowFromMouseProps extends MaskProps {
  contClassName?: string;
  contStyle?: React.CSSProperties;
}
```









