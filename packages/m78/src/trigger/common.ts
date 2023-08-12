/** 包含开关状态的事件被手动停止(enable设置为false, 对应事件类型被关闭, 实例被销毁等)时, 会将未关闭的事件进行关闭, 此时, 此事件作为nativeEvent的填充 */
export const triggerClearEvent = new Event("m78-trigger-clear");

/** 从指定事件中获取xy, 并检测是否是touch事件 */
export function _eventXyGetter(e: TouchEvent | MouseEvent) {
  const isTouch = e.type.startsWith("touch");

  let clientX = 0;
  let clientY = 0;

  const mouseEv = e as MouseEvent;
  const touchEv = e as TouchEvent;

  if (isTouch) {
    const point = touchEv.changedTouches[0];
    clientX = point.clientX;
    clientY = point.clientY;
  } else {
    clientX = mouseEv.clientX;
    clientY = mouseEv.clientY;
  }

  return [clientX, clientY, isTouch] as const;
}
