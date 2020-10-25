import { GetPopperMetasBound } from './getPopperMetas';
import { PopperTriggerType } from './types';

/** 检测是否为合法的GetPopperMetasBound */
export function isPopperMetasBound(arg: any) {
  if (arg && 'left' in arg && 'top' in arg && 'width' in arg && 'height' in arg) {
    return arg as GetPopperMetasBound;
  }
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
