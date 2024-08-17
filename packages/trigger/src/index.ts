import { _create, _create as createTrigger } from "./create.js";

export { createTrigger };
export * from "./types.js";

/**
 * 事件触发器, 整合了click/active/focus/contextMenu/move/drag等常用事件, 处理了这些事件在触控和光标设备上的兼容性, 并提供了更易于使用的事件对象模型.
 *
 * trigger还支持将虚拟的位置和尺寸作为事件目标.
 *
 * > 注意: trigger不会自动对浏览器默认行为进行阻止, 你可以根据需要在包含长按/滑动等操作的事件目标上添加以下样式:
 * > touch-action: none;
 */
export const trigger = _create();
