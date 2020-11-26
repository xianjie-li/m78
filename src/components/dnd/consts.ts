import { DragStatus } from './types';

/** 在此比例内的区域视为边缘 */
export const edgeRatio = 0.2;

export const initStatus: DragStatus = {
  dragOver: false,
  dragLeft: false,
  dragRight: false,
  dragBottom: false,
  dragTop: false,
  dragCenter: false,
  dragging: false,
};
