focus 能否被其他事件遮蔽

mixedEvent 改名为 trigger, focus 改为 active, 支持 touch

// 可以时不同的 trigger 使用同一个实例
<Trigger id="abcd" />

// 缓存 bound 位置来提升性能
// move 过程中节流更新 bound 位置
如果某个事件被取消, 或者 enable 为 false, 需要关闭之前未完成的事件, 比如 focus, drag 等

focus/active 等是否需要在 click 等事件中设置

在 active & drag & move 事件启用时, 节点需要添加指定 css
