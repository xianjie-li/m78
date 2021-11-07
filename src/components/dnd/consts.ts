/** 在此比例内的区域视为边缘 */
export const edgeRatio = 0.24;

/** 禁止拖动的元素tagName */
export const ignoreReg = /^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO|VIDEO)$/;

/** 默认props */
export const defaultProps = {
  enableDrag: true,
  enableDrop: true,
};

/** 当独立配置了enableDrag的某一项时，其他方向的默认值 */
export const initEnableDragsDeny = {
  left: false,
  right: false,
  bottom: false,
  top: false,
  center: false,
  regular: true,
};

/** enableDrag为true时使用的方向配置 */
export const initEnableDragsPass = {
  left: true,
  right: true,
  bottom: true,
  top: true,
  center: true,
  regular: false,
};

/** 初始状态 */
export const initStatus = {
  dragOver: false,
  dragLeft: false,
  dragRight: false,
  dragBottom: false,
  dragTop: false,
  dragCenter: false,
  dragging: false,
  regular: true,
};

/** 提到utils */
export const raf: typeof window.requestAnimationFrame = frameRequestCallback => {
  const _raf =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    // @ts-ignore
    window.mozRequestAnimationFrame ||
    // @ts-ignore
    window.oRequestAnimationFrame ||
    // @ts-ignore
    window.msRequestAnimationFrame ||
    setTimeout;
  return _raf(frameRequestCallback);
};
