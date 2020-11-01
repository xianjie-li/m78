import { Bound, PopperTriggerType } from './types';

/** 检测是否为合法的Bound */
export function isPopperBound(arg: any): arg is Bound {
  return arg && 'left' in arg && 'top' in arg && 'width' in arg && 'height' in arg;
}

/** 根据PopperTriggerType获取启用的事件类型 */
export function getTriggerType(type: PopperTriggerType | PopperTriggerType[]) {
  let types: PopperTriggerType[] = [];
  if (typeof type === 'string') {
    types = [type];
  } else {
    types = type;
  }

  return {
    hover: types.includes('hover'),
    click: types.includes('click'),
    focus: types.includes('focus'),
  };
}

export interface MountExistBase {
  /** true | 如果为true，在第一次启用时才真正挂载内容 */
  mountOnEnter?: boolean;
  /** false | 是否在关闭时卸载内容 */
  unmountOnExit?: boolean;
}

interface UseMountExistOption extends MountExistBase {
  /** 当前显示状态 */
  toggle: boolean;
  /**
   * 延迟设置非mount状态, 单位ms,
   * - 用于在内容包含动画时，在动画结束后在卸载内容
   * - 此值不用必须精准匹配动画时间，只要大于动画时间即可
   * */
  exitDelay?: number;
}
