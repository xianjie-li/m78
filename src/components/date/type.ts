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

type DateTypeUnion = 'date' | 'month' | 'year' | 'time';

export interface DatesProps extends ComponentBaseProps, FormLikeWithExtra<Moment> {
  /** 选择器类型 */
  type?: DateType | DateTypeUnion /* 接受传 DateType 或 字面量 */;
  /** 是否包含时间 */
  hasTime?: boolean;
}

export interface ItemBase {
  /** 该项所在时间 */
  itemMoment: Moment;
  /** 当前显示的时间 */
  currentMoment: Moment;
  /** 当前时间 */
  nowMoment: Moment;
  /** 当前选中时间 */
  checkedMoment: Moment | null;
  /** 点击选中该项 */
  onCheck?(dString: string, mmt: Moment): void;
}

export interface DateItemProps extends ItemBase {
  /** 禁用所有返回true的日期 */
  disabledDate?(mmt: Moment, type: DateType): boolean | void;
  /** 通知父节点更新currentMoment */
  onCurrentChange?(mmt: Moment): void;
  /** 选择器类型 */
  type?: Exclude<DateType, DateType.TIME>;
}

export interface TimeValue {
  h: number;
  m: number;
  s: number;
}

export interface TimeProps extends FormLike<TimeValue> {
  label?: React.ReactNode;
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
  value: string;
  setValue: AnyFunction;
  self: {
    cValueMoment: Moment;
  };
  hasTime: boolean;
  getCurrentTime(): TimeValue;
  type: DateType | DateTypeUnion;
}
