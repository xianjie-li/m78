import moment, { Moment, unitOfTime } from 'moment';
import { useFn } from '@lxjx/hooks';
import { DateItemProps, DateType, ShareMetas, TimeValue } from './type';
import {
  DATE_FORMAT_DATE,
  DATE_FORMAT_DATE_TIME,
  DATE_FORMAT_MONTH,
  DATE_FORMAT_TIME,
  DATE_FORMAT_YEAR,
} from './utils';

/** 简化主文件, 获取更新当前选择器数据和位置的一些函数 */
export function useDateUIController({ state, setState }: ShareMetas) {
  /** 在当前月份上增加或减少指定天数并更新currentM */
  function changeDate(cType: 1 | 2, number = 1, dateType = 'months' as unitOfTime.Base) {
    const map = { 1: 'add', 2: 'subtract' } as const;

    const nMm = state.currentM.clone();
    nMm[map[cType]](number, dateType);

    setState({
      currentM: nMm,
    });
  }

  /** 切换 到上一月 */
  const prev = useFn(() => {
    changeDate(2);
  });

  /** 切换 到下一月 */
  const next = useFn(() => {
    changeDate(1);
  });

  /** 切换 到上一年 */
  const prevY = useFn(() => {
    changeDate(2, 1, 'years');
  });

  /** 切换 到下一年 */
  const nextY = useFn(() => {
    changeDate(1, 1, 'years');
  });

  /** 接收来自DateItem的通知并更新currentM */
  const onCurrentChange: DateItemProps['onCurrentChange'] = useFn(mmt => {
    setState({
      currentM: mmt,
    });
  });

  const toYear = useFn(() => {
    setState({
      type: DateType.YEAR,
    });
  });

  const toMonth = useFn(() => {
    setState({
      type: DateType.MONTH,
    });
  });

  const toDate = useFn(() => {
    setState({
      type: DateType.DATE,
    });
  });

  const toTime = useFn(() => {
    setState({
      type: DateType.TIME,
    });
  });

  return {
    changeDate,
    prev,
    next,
    prevY,
    nextY,
    onCurrentChange,
    toYear,
    toMonth,
    toDate,
    toTime,
  };
}

/** 简化主文件, 外部化一些事件处理器 */
export function useHandlers(
  { hasTime, setValue, getCurrentTime, self, type, state, setState, nowM, props }: ShareMetas,
  { toTime }: ReturnType<typeof useDateUIController>,
) {
  function rangeHandler(dString: string, mmt: Moment, format: string) {
    if (self.cValueMoment && !self.endValueMoment) {
      const min = moment.min(mmt, self.cValueMoment);
      const max = moment.max(mmt, self.cValueMoment);

      self.cValueMoment = min;
      self.endValueMoment = max;
      setValue([min.format(format), max.format(format)], [min, max]);
      return;
    }
    self.endValueMoment = undefined;

    setValue([dString], [mmt]);
  }

  /** 选中日期项 */
  const onCheck: DateItemProps['onCheck'] = useFn((dString, mmt) => {
    const format = hasTime ? DATE_FORMAT_DATE_TIME : DATE_FORMAT_DATE;

    const nowTime = {
      hour: nowM.hour(),
      minute: nowM.minute(),
      second: nowM.second(),
    };

    if (props.range) {
      // 范围选择时，默认设置当前时间
      if (hasTime) {
        mmt.set(nowTime);
      }

      rangeHandler(mmt.format(format), mmt, format);

      if (hasTime && self.cValueMoment && self.endValueMoment) {
        setTimeout(toTime);
      }
      return;
    }

    // 常规选择且包含时间，设置将已选时间设置到选择的日期上
    if (hasTime) {
      mmt.set(getCurrentTime() || nowTime);

      setValue(mmt.format(format), mmt);

      // 需要value更新完成后再执行
      setTimeout(toTime);
      return;
    }

    setValue(dString, mmt);
  });

  /** 选中时间, 传入isEnd时设置结束时间 */
  const onCheckTime = useFn(({ h, m, s }: TimeValue, isEnd?: boolean) => {
    // 如果是单纯的时间选择，则以当天时间设置moment返回，否则根据已选时间设置

    let cM = isEnd ? self.endValueMoment?.clone() : self.cValueMoment?.clone();
    // 没有已选中时间时取当天
    if (!cM || type === DateType.TIME) cM = nowM.clone();

    // 在当前时间的基础上替换时间
    cM.set({
      hour: h,
      minute: m,
      second: s,
    });

    if (isEnd) {
      self.endValueMoment = cM;
    } else {
      self.cValueMoment = cM;
    }

    const format = type === DateType.TIME ? DATE_FORMAT_TIME : DATE_FORMAT_DATE_TIME;

    const ds = cM.format(format);

    if (!props.range) {
      setValue(ds, cM);
      return;
    }

    isEnd
      ? setValue([self.cValueMoment?.format(format), ds], [self.cValueMoment, cM])
      : setValue([ds, self.endValueMoment?.format(format)], [cM, self.endValueMoment]);
  });

  /** 选中月 */
  const onCheckMonth: DateItemProps['onCheck'] = useFn((dString, mmt) => {
    // 选择器类型为月时直接选中，不是则将UI更新到对应的月

    if (type === DateType.MONTH) {
      if (props.range) {
        rangeHandler(dString, mmt, DATE_FORMAT_MONTH);
        return;
      }

      setValue(dString, mmt);
      return;
    }

    const cm = state.currentM.clone();

    cm.year(mmt.year()).month(mmt.month());

    setState({
      currentM: cm,
      type: DateType.DATE,
    });
  });

  /** 选中年 */
  const onCheckYear: DateItemProps['onCheck'] = useFn((dString, mmt) => {
    // 选择器类型为年时直接选中，不是则将UI更新到对应的月

    if (type === DateType.YEAR) {
      if (props.range) {
        rangeHandler(dString, mmt, DATE_FORMAT_YEAR);
        return;
      }

      setValue(dString, mmt);
      return;
    }

    const cm = state.currentM.clone();
    cm.year(mmt.year());

    setState({
      currentM: cm,
      type: DateType.MONTH,
    });
  });

  /** 设置活动状态 */
  const onItemActive: DateItemProps['onActive'] = useFn(mmt => {
    setState({
      tempM: mmt,
    });
  });

  return {
    onCheck,
    onCheckTime,
    onCheckMonth,
    onCheckYear,
    onItemActive,
  };
}
