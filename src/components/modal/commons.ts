import { TupleNumber } from 'm78/modal/types';

/** 根据alignment值获取x, y值 */
export function calcAlignment(alignment: TupleNumber, screenMeta: TupleNumber) {
  const [sW, sH] = screenMeta;
  const [aX, aY] = alignment;

  const x = sW * aX;
  const y = sH * aY;

  return [x, y];
}

let timer: any = null;

/** 保存鼠标最后点击位置 */
function windowClickHandle(e: MouseEvent) {
  if (timer) {
    clearTimeout(timer);
  }

  const x = e.x || e.screenX; // screenX会有导航栏高度的偏移
  const y = e.y || e.screenY;

  (window as any)._FR_LAST_CLICK_POSITION_X = x;
  (window as any)._FR_LAST_CLICK_POSITION_Y = y;

  timer = setTimeout(() => {
    (window as any)._FR_LAST_CLICK_POSITION_X = undefined;
    (window as any)._FR_LAST_CLICK_POSITION_Y = undefined;
  }, 500);
}

/**
 * 记录点击位置
 * */
export function registerPositionSave() {
  window.removeEventListener('click', windowClickHandle, true);
  // 启用事件捕获防止某个元素事件冒泡导致事件不触发
  window.addEventListener('click', windowClickHandle, true);
}
