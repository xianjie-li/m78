import { isArray } from '@lxjx/utils';
import { Size } from 'm78/types';
import {
  _MediaQueryTypeContext,
  MediaQueryMeta,
  MediaQueryObject,
  MediaQueryTypeKeys,
  MediaQueryTypeValues,
} from '../types';

/**
 * 根据尺寸检测是何种类型
 * */
export function calcType(size: number) {
  if (size >= MediaQueryTypeValues.XXL) {
    return MediaQueryTypeKeys.XXL;
  }

  if (size >= MediaQueryTypeValues.XL && size < MediaQueryTypeValues.XXL) {
    return MediaQueryTypeKeys.XL;
  }

  if (size >= MediaQueryTypeValues.LG && size < MediaQueryTypeValues.XL) {
    return MediaQueryTypeKeys.LG;
  }

  if (size >= MediaQueryTypeValues.MD && size < MediaQueryTypeValues.LG) {
    return MediaQueryTypeKeys.MD;
  }

  if (size >= MediaQueryTypeValues.SM && size < MediaQueryTypeValues.MD) {
    return MediaQueryTypeKeys.SM;
  }

  return MediaQueryTypeKeys.XS;
}

/**
 * 抽取onChange公共逻辑
 * 如果传入了skipEmit，会跳过通知Listeners并改为返回meta对象
 * */
export function onChangeHandle(
  { width, height }: Size,
  ctx: _MediaQueryTypeContext,
  skipEmit?: boolean,
) {
  const type = calcType(width);

  const changeListeners = ctx.changeListeners;

  const size = {
    width,
    height,
  };

  const is = {
    isXS: () => type === MediaQueryTypeKeys.XS,
    isSM: () => type === MediaQueryTypeKeys.SM,
    isMD: () => type === MediaQueryTypeKeys.MD,
    isLG: () => type === MediaQueryTypeKeys.LG,
    isXL: () => type === MediaQueryTypeKeys.XL,
    isXXL: () => type === MediaQueryTypeKeys.XXL,
    isSmall: () => is.isXS() || is.isSM(),
    isMedium: () => is.isMD() || is.isLG(),
    isLarge: () => !is.isSmall() && !is.isMedium(),
  };

  const full: MediaQueryMeta = { ...size, type, ...is };
  ctx.meta = full;

  if (skipEmit) {
    return ctx.meta;
  }
  if (isArray(changeListeners)) {
    changeListeners.forEach(fn => fn(full));
  }
}

const mediaQueryGetterDefaultChecker = (item: any) => item !== undefined;

/**
 * 根据 { [MediaQueryTypeKeys]: T } 格式的对象获取当前尺寸下符合条件的值
 * @param meta - 媒体查询源信息
 * @param mq - 包含MediaQueryTypeKeys配置的对象
 * @param fullback - 没有任何匹配的回退值
 * @param checker - 自定义T是否生效，默认检测其是否为undefined
 * @return t - 满足当前媒体条件的值
 * */
export function mediaQueryGetter<T>(
  meta: MediaQueryMeta,
  mq: MediaQueryObject<T>,
  fullback: T,
  checker?: (item?: T) => boolean,
) {
  let val: T | undefined;

  const _checker = checker || mediaQueryGetterDefaultChecker;

  /** 从列表中获取首个包含正确值的value */
  const getFirst = (cLs: (T | undefined)[]) => cLs.find(_checker);

  /** 取值顺序 */
  const ls = [mq.xxl, mq.xl, mq.lg, mq.md, mq.sm, mq.xs];

  if (meta.isXXL()) {
    val = getFirst(ls);
  }

  if (meta.isXL()) {
    val = getFirst(ls.slice(1));
  }

  if (meta.isLG()) {
    val = getFirst(ls.slice(2));
  }

  if (meta.isMD()) {
    val = getFirst(ls.slice(3));
  }

  if (meta.isSM()) {
    val = getFirst(ls.slice(4));
  }

  if (meta.isXS()) {
    val = getFirst(ls.slice(5));
  }

  if (!_checker(val)) {
    val = fullback;
  }

  return val as T;
}
