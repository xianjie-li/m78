- ~~单实例~~
- ~~事件对象直接修改可以动态作用到事件, 只可传入事件对象~~
- ~~move和active事件性能~~
  - 事件开始后才实时更新位置, 只需更新当前组件的bound等信息
  - 对 getBound api 进行限流
- ~~事件竞争优化~~
- ~~通过一个map控制拖动/拖动中/hover的光标~~
- ~~事件的延迟改为默认, 不支持修改~~
- ~~preCheck 改为 enable, 支持字面量或函数~~
- ~~互斥事件~~
  - drag - 开启时, 禁用其他事件
- ~~允许单个对象绑定多次事件~~ 不允许
- ~~什么情况下需要中断正在运行的事件?~~
  - instance.enable 设置关闭: 关闭所有正在运行的事件
  - 事件对象被通过 off / clear 移除: 关闭关联的正在运行事件
  - 特殊事件: drag 启用后, 需要停止并阻止其他事件
  - 正在运行的事件不在本次运行列表中了
- ~~阻止默认行为~~
  - active touch模式: preventDefault() + 阻止contextMenu + 防止复制 + touchaction
  - contextMenu touch模式: 防止复制 + touchaction
  - move touch模式: preventDefault() + touchaction
  - drag: preventDefault() + 防止复制 + touchaction
- ~~暴露统一事件, 便于集中调整光标样式, 添加覆盖样式等~~

bug: ~~touch模式active自动关闭~~
~~点击支持focus触发~~
~~事件包含真实dom时使用dom处理事件~~

~~调整为新的export方式~~

useScroll迁移到新版

trigger迁移到新版
- overlay
- bubble
- menu
- table

~~单例时闪烁~~`
~~单例时active不关闭~~
~~trigger移到单独的库~~
添加新属性, 事件模板直到解绑前移动的所有距离distanceXY
添加drag bound: 一个html节点或bound对象, 表示其在视口的rect框
优化大量绑定和解绑的速度

smooth更名为animate-tools
Raf  rafCaller  从utils迁移到animate-tools
useScroll 从 hooks迁移到trigger
添加css动画支持, 支持暂停播放等, 支持接收监听, 添加关键字动画支持

keyboard从hooks迁移到animate-tools