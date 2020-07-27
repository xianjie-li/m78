import { Moment } from 'moment';
import { FormLike } from '@lxjx/hooks';
import React from 'react';
import { SetState } from '@lxjx/hooks/dist/type';
import { AnyFunction } from '@lxjx/utils';
import { InputProps } from '../input';
import { ComponentBaseProps } from '../types/types';

export enum DateType {
  DATE = 'date',
  MONTH = 'month',
  YEAR = 'year',
  TIME = 'time',
}

/* 需要同时允许用户传入DateType 或 字面量 */
type DateTypeUnion = 'date' | 'month' | 'year' | 'time';

/**
 * 禁用日期,返回true的日期项会被禁用
 * @param mmt - 当前项的时间
 * @param type- 当前项类型 当前类型(year | month | date)
 * @param extra - <DisabledExtras>
 * @return - 返回true时，该项被禁用
 * */
export interface DateLimiter {
  (mmt: Moment, type: Exclude<DateType, DateType.TIME>, extra: DisabledExtras): boolean | void;
}

/**
 * 接收当前时间元数据来决定禁用哪些时间
 * @param meta
 * @param meta.key - 当前项类型 'h' | 'm' | 's'
 * @param meta.val - 当前项的值
 * @param meta.h - 当前选中的时
 * @param meta.m - 当前选中的分
 * @param meta.s - 当前选中的秒
 * @param extra - <DisabledExtras>
 * @return - 返回true时，该项被禁用
 * */
export interface TimeLimiter {
  (meta: TimeValue & { key: keyof TimeValue; val: number }, extra: DisabledExtras): boolean | void;
}

/** 传递给disabledDate/disabledTime的额外参数 */
interface DisabledExtras {
  /** 当前时间 */
  checkedDate?: Moment;
  /** 如果为range选择且选择了结束时间，会以此项传入 */
  checkedEndDate?: Moment;
  /** 是否为范围选择 */
  isRange?: boolean;
}

export interface DatesBaseProps extends ComponentBaseProps {
  /** 'date' | 选择器类型 ('date' | 'month' | 'year' | 'time') */
  type?: DateType | DateTypeUnion;
  /** 限制可用日期 */
  disabledDate?: DateLimiter | Array<DateLimiter>;
  /** 'select' | 显示模式 组件、日历、选择器模式 */
  mode?: 'component' | 'calendar' | 'select';
  /** 未选中内容时的占位文本 */
  placeholder?: string;
  /** 格式化显示到占位框上的value，默认单选时为YYYY-MM-DD HH:mm:ss, 多选时为 YYYY-MM-DD HH:mm:ss ~ YYYY-MM-DD HH:mm:ss */
  format?(meta: {
    current?: Moment;
    end?: Moment;
    isRange: boolean;
    type: DateType | DateTypeUnion;
    hasTime: boolean;
  }): string;
  /** 禁用自带的时间预设，当你禁用了某些日期、时间段时，默认的预设可能会和被禁用的时间冲突，此时可以传入该选项来将其禁用 */
  disabledPreset?: boolean;
  /** 尺寸，只针对输入框 */
  size?: InputProps['size'];
  /** 禁用 */
  disabled?: boolean;

  /* ========== Time ========== */
  /** 日期选择时是否启用时间选择 */
  hasTime?: boolean;
  /**
   * 隐藏已被禁用的时间, 当包含很多禁用时间时，可通过此项来提高用户进行信息筛选的速度
   * 也可以通过此项实现时间步进选择(1点 3点 4点...)的效果 */
  hideDisabledTime?: boolean;
  /** 限制可用时间 */
  disabledTime?: TimeLimiter | Array<TimeLimiter>;
}

/** 常规选择，value为string */
export interface DatesProps extends DatesBaseProps {
  value?: string;

  onChange?: (value: string, mmt: Moment) => void;

  defaultValue?: string;
}

/** 范围选择，value为array, 分别表示[开始, 结束时间] */
export interface DatesRangeProps extends DatesBaseProps {
  value?: [string, string];

  onChange?: (values: [string, string], mmts: [Moment, Moment]) => void;

  defaultValue?: [string, string];
  /** 开启范围选择 */
  range?: boolean;
  /** '开始' | 自定义开始时间的文本 */
  startLabel?: string;
  /** '结束' | 自定义结束时间的文本 */
  endLabel?: string;
}

/** 表示年月日中的一项 */
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
  /** 当前参与交互的临时时间，用于预览最终状态等 */
  tempMoment?: Moment;
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
  /** 当前时间处于 活动/失活 时触发 */
  onActive?(mmt?: Moment): void;

  startLabel: DatesRangeProps['startLabel'];

  endLabel: DatesRangeProps['endLabel'];
}

/** 组成时间的基本对象 */
export interface TimeValue {
  h: number;
  m: number;
  s: number;
}

/** 时间组件的props */
export interface TimeProps extends FormLike<TimeValue> {
  /** 选择器顶部显示内容 */
  label?: React.ReactNode;
  /** 隐藏禁用项 */
  hideDisabled?: boolean;

  disabledTime?: Array<TimeLimiter>;
  /** 传递给disabledTime函数的额外参数 */
  disabledTimeExtra?: any;
}

/** 拆分代码时在被拆分代码中被依赖的一些东西 */
export interface ShareMetas {
  nowM: Moment;
  state: {
    currentM: Moment;
    tempM: Moment | undefined;
    type: DateType | DateTypeUnion;
    show: boolean;
    mobile: boolean;
  };
  setState: SetState<ShareMetas['state']>;
  value: string | string[];
  setValue: AnyFunction;
  self: {
    cValueMoment?: Moment;
    endValueMoment?: Moment;
  };
  hasTime: boolean;
  getCurrentTime(isEnd?: boolean): TimeValue | undefined;
  type: DateType | DateTypeUnion;
  props: DatesProps & DatesRangeProps;
}
