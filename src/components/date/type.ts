import { Moment } from 'moment';
import { FormLikeWithExtra, FormLike } from '@lxjx/hooks';
import React from 'react';
import { SetState } from '@lxjx/hooks/dist/type';
import { AnyFunction } from '@lxjx/utils';
import { ComponentBaseProps } from '../types/types';

export enum DateType {
  DATE = 'date',
  MONTH = 'month',
  YEAR = 'year',
  TIME = 'time',
}
// 使用宽容模式解析时间，因而支持很多的怪异时间格式

/* 需要同时允许用户传入DateType 或 字面量 */
type DateTypeUnion = 'date' | 'month' | 'year' | 'time';

export interface DatesProps extends ComponentBaseProps, FormLikeWithExtra<string, Moment> {
  /** 选择器类型 */
  type?: DateType | DateTypeUnion;
  /**
   * 定制时间格式
   * 默认支持解析 YYYY-MM-DD HH:mm:ss / YYYY/MM/DD HH:mm:ss 两种格式
   * 默认导出格式为 YYYY-MM-DD HH:mm:ss
   * 传入后，将统一解析和导出时间为指定的格式, 令牌格式可参考https://momentjs.com/docs/#/displaying/format/
   * */
  format?: string;
  /** 禁用日期, 参数为当前项的moment、当前类型(year | month | date)，返回true时禁用该项 */
  disabledDate?(mmt: Moment, type: Exclude<DateType, DateType.TIME>): boolean | void;
  /** 开启范围选择 */
  range?: boolean;
  /** '开始' | 自定义开始时间的文本 */
  startDateLabel?: string;
  /** '结束' | 自定义结束时间的文本 */
  endDateLabel?: string;

  /* ===== Time ===== */
  /** 日期选择时是否包含时间选择 */
  hasTime?: boolean;
  /**
   * 隐藏已被禁用的时间, 当包含很多禁用时间时，可通过此项来提高用户进行信息筛选的速度
   * 也可以通过此项实现时间步进选择(1点 3点 4点...)的效果 */
  hideDisabledTime?: boolean;
  /**
   * 接收当前时间元数据来决定禁用哪些时间
   * @param meta
   * @param meta.key - 当前项类型 'h' | 'm' | 's'
   * @param meta.val - 当前项的值
   * @param meta.h - 当前选中的时
   * @param meta.m - 当前选中的分
   * @param meta.s - 当前选中的秒
   * @param currentDate - 如果类型为日期选择器，则此项会传入当前选中的日期
   * @return - 返回true时，该项被禁用
   * */
  disabledTime?(
    meta: TimeValue & { key: keyof TimeValue; val: number },
    currentDate?: Moment,
  ): boolean | void;
}

export interface DateItemProps {
  /** 该项所在时间 */
  itemMoment: Moment;
  /** 当前显示的时间 */
  currentMoment: Moment;
  /** 当前时间 */
  nowMoment: Moment;
  /** 当前选中时间 */
  checkedMoment?: Moment;
  /** 当前选中的结束时间 */
  checkedEndMoment?: Moment;
  /** 点击选中该项 */
  onCheck?(dString: string, mmt: Moment): void;
  /** 禁用所有返回true的日期 */
  disabledDate: DatesProps['disabledDate'];
  /** 通知父节点更新currentMoment, (目前会在用户通过日期中的灰色日期选中下一月日期时触发) */
  onCurrentChange?(mmt: Moment): void;
  /** 选择器类型 */
  type?: Exclude<DateType, DateType.TIME>;
  /** 是否多选 */
  range?: boolean;
}

/** 组成时间的基本对象 */
export interface TimeValue {
  h: number;
  m: number;
  s: number;
}

export interface TimeProps extends FormLike<TimeValue> {
  /** 选择器顶部显示内容 */
  label?: React.ReactNode;
  /** 隐藏禁用项 */
  hideDisabled?: boolean;
  /**
   * 接收当前时间参数并根据参数决定禁用哪些时间
   * @param meta
   * @param meta.key - 当前项类型 'h' | 'm' | 's'
   * @param meta.val - 当前项的值
   * @param meta.h - 当前选中的时
   * @param meta.m - 当前选中的分
   * @param meta.s - 当前选中的秒
   * @param extra - 传递给组件的disabledTimeExtra
   * @return - 返回true时，该项被禁用
   * */
  disabledTime?(
    meta: TimeValue & { key: keyof TimeValue; val: number },
    extra?: any,
  ): boolean | void;
  /** 传递给disabledTime函数的额外参数 */
  disabledTimeExtra?: any;
}

/** 拆分代码时在被拆分代码中被依赖的一些东西 */
export interface ShareMetas {
  nowM: Moment;
  state: {
    currentM: Moment;
    type: DateType | DateTypeUnion;
  };
  setState: SetState<ShareMetas['state']>;
  value: string | string[];
  setValue: AnyFunction;
  self: {
    cValueMoment?: Moment;
    endValueMoment?: Moment;
  };
  hasTime: boolean;
  getCurrentTime(): TimeValue;
  type: DateType | DateTypeUnion;
  props: DatesProps;
}
