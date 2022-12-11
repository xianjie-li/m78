需要使用虚拟目标, 所以不考虑 `Intersection Observer API`

- 位置更新均使用对外暴露的 update 系列方法
- 更新依赖 lastXY, lastAlignment, lastTarget, 在执行 update 前需要主动更新对应值, updateXX 系列方法会自动更新这些值, 无序设置
- 代码中的简单命名约定 t: 目标节点(即定位目标), c: 内容节点(即 overlay 容器)
