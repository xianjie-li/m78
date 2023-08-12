/** 包含开关状态的事件被手动停止(enable设置为false, 对应事件类型被关闭, 实例被销毁等)时, 会将未关闭的事件进行关闭, 此时, 此事件作为nativeEvent的填充 */
export declare const triggerClearEvent: Event;
/** 从指定事件中获取xy, 并检测是否是touch事件 */
export declare function _eventXyGetter(e: TouchEvent | MouseEvent): readonly [number, number, boolean];
//# sourceMappingURL=common.d.ts.map