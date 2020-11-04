import { BoundWithVisible, PopperDirectionKeys, PopperDirectionInfoWidthVisible } from './types';

/** 关联的方向，用于帮助猜测下一个Direction的合理位置 */
const relateDirectionMap: { [key in PopperDirectionKeys]: PopperDirectionKeys[] } = {
  topStart: ['top', 'topEnd', 'bottomStart'],
  top: ['bottom', 'topStart', 'topEnd'],
  topEnd: ['top', 'topStart', 'bottomEnd'],
  leftStart: ['left', 'leftEnd', 'bottom'],
  left: ['right', 'leftStart', 'leftEnd'],
  leftEnd: ['left', 'leftStart', 'top'],
  bottomStart: ['bottom', 'bottomEnd', 'topStart'],
  bottom: ['top', 'bottomStart', 'bottomEnd'],
  bottomEnd: ['bottom', 'bottomStart', 'topEnd'],
  rightStart: ['right', 'rightEnd', 'bottom'],
  right: ['left', 'rightStart', 'rightEnd', 'bottom'],
  rightEnd: ['right', 'rightStart', 'top'],
};

interface Options {
  /** 目标方向 */
  direction: PopperDirectionKeys;
  /** 前一个方向 */
  prevDirection: PopperDirectionKeys;
  /** 包含可见信息的所有方向信息 */
  directionInfo: PopperDirectionInfoWidthVisible;
}

/**
 * direction prevDirection directionInfo
 * 选取方向顺序:
 * 前一个方向 ->
 * 指定方向 ->
 * 根据前一个方向获取关联方向 ->
 * 指定方向获取关联方向 ->
 * 关联方向均不可用时, 获取第一个visible方向 ->
 * 无任何visible方向时，获取第一个非hidden方向 ->
 * 使用指定方向
 * */

export function selectDirection({
  direction,
  prevDirection,
  directionInfo,
}: Options): [BoundWithVisible, PopperDirectionKeys] | null {
  // 前一个方向
  const prev = directionInfo[prevDirection];

  if (prev && prev.visible) return [prev, prevDirection];

  // 指定方向
  const current = directionInfo[direction];

  if (current && current.visible) return [current, direction];

  // 根据前一个方向获取关联方向
  const relates = relateDirectionMap[prevDirection];
  const relateDirection = relates.reduce<[BoundWithVisible, PopperDirectionKeys] | undefined>(
    (pr, key) => {
      if (directionInfo[key].visible && !pr) {
        return [directionInfo[key], key];
      }
      return pr;
    },
    undefined,
  );

  if (relateDirection) return relateDirection;

  // 指定方向获取关联方向
  const currentRelates = relateDirectionMap[direction];
  const currentRelateDirection = currentRelates.reduce<
    [BoundWithVisible, PopperDirectionKeys] | undefined
  >((pr, key) => {
    if (directionInfo[key].visible && !pr) {
      return [directionInfo[key], key];
    }
    return pr;
  }, undefined);

  if (currentRelateDirection) return currentRelateDirection;

  // 获取第一个visible方向
  for (const [key, val] of Object.entries(directionInfo)) {
    if (val.visible) {
      return [val, key] as [BoundWithVisible, PopperDirectionKeys];
    }
  }

  let allHidden = true;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [_, val] of Object.entries(directionInfo)) {
    if (!val.hidden) {
      allHidden = false;
      break;
    }
  }

  if (allHidden) return null;

  const subKey = prevDirection || current;

  const substitute = directionInfo[subKey];

  return [substitute, subKey];
}
