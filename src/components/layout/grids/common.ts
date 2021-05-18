import {
  GridsColMediaQueryProps,
  GridsColNumberOrMediaQueryProps,
  GridsColProps,
  mediaQueryGetter,
  MediaQueryMeta,
  MediaQueryObject,
} from 'm78/layout';
import { isNumber, isObject, isTruthyOrZero } from '@lxjx/utils';

/**
 * 根据MediaQueryMeta从GridColProps中获取GridColMediaQueryProps
 * 获取遵循以下规则:
 * - 当前媒体尺寸不包含有效配置时，从小于此区间的媒体尺寸中依次获取并拿到第一个有效配置
 * - 当任何区间都不能获取到有效值时，获取直接传入的配置
 * - 如下所示
 * - xxl.col > md.col > xs.col > props.col
 * - xxl.offset > md.offset > xs.offset > props.offset
 * */
export function getCurrentMqProps(
  mqMeta: MediaQueryMeta,
  { col, offset, move, order, flex, hidden, align, xs, sm, md, lg, xl, xxl }: GridsColProps,
) {
  const mqObject: MediaQueryObject<GridsColNumberOrMediaQueryProps> = {
    xs,
    sm,
    md,
    lg,
    xl,
    xxl,
  };

  const obj = {
    col: mediaQueryGetter(mqMeta!, mqObject, col, item => isNumber(item) || isNumber(item?.col)),
    offset: mediaQueryGetter(
      mqMeta!,
      mqObject,
      offset,
      item => !isNumber(item) && isNumber(item?.offset),
    ),
    move: mediaQueryGetter(
      mqMeta!,
      mqObject,
      move,
      item => !isNumber(item) && isNumber(item?.move),
    ),
    order: mediaQueryGetter(
      mqMeta!,
      mqObject,
      order,
      item => !isNumber(item) && isNumber(item?.order),
    ),
    flex: mediaQueryGetter(
      mqMeta!,
      mqObject,
      flex as any,
      item => !isNumber(item) && isTruthyOrZero(item?.flex),
    ),
    hidden: mediaQueryGetter(
      mqMeta!,
      mqObject,
      hidden as any,
      item => !isNumber(item) && item?.hidden,
      true,
    ),
    align: mediaQueryGetter(
      mqMeta!,
      mqObject,
      align as any,
      item => !isNumber(item) && item?.align,
    ),
  };

  const gridColMediaQueryProps: any = {};

  Object.entries(obj).forEach(([k, v]) => {
    if (isObject(v)) {
      gridColMediaQueryProps[k] = v[k];
    } else {
      gridColMediaQueryProps[k] = v;
    }
  });

  return gridColMediaQueryProps as GridsColMediaQueryProps;
}
