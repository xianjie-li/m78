import { AnyObject } from '@lxjx/utils';

/** 对象是否包含属性值都为true的项 */
export function allPropertyHasTrue(obj: AnyObject) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return Object.entries(obj).some(([_, _enable]) => _enable);
}

/** 两个对象是否所有属性值都相等 */
export function allPropertyIsEqual(obj: AnyObject, obj2: AnyObject) {
  return Object.entries(obj).every(([key, val]) => val === obj2[key]);
}
