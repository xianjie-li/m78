import { unitOfTime } from 'moment';
import { useFn } from '@lxjx/hooks';
import { DateItemProps, DateType, TimeProps, ShareMetas } from './type';
import { DATE_FORMAT_DATE_TIME } from './utils';

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
  { hasTime, setValue, getCurrentTime, self, type, state, setState }: ShareMetas,
  { toTime }: ReturnType<typeof useDateUIController>,
) {
  /** 选中日期项 */
  const onCheck: DateItemProps['onCheck'] = useFn((dString, mmt) => {
    if (hasTime) {
      mmt.set(getCurrentTime());

      setValue(mmt.format(DATE_FORMAT_DATE_TIME), mmt);

      toTime();
      return;
    }

    setValue(dString, mmt);
  });

  /** 选中时间 */
  const onCheckTime: TimeProps['onChange'] = useFn(({ h, m, s }) => {
    const cM = self.cValueMoment.clone();

    cM.set({
      hour: h,
      minute: m,
      second: s,
    });

    setValue(cM.format(DATE_FORMAT_DATE_TIME), cM);
  });

  /** 选中月 */
  const onCheckMonth: DateItemProps['onCheck'] = useFn((dString, mmt) => {
    console.log(dString);
    // 选择器类型为月时直接选中，不是则将UI更新到对应的月

    if (type === DateType.MONTH) {
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
    console.log(dString);
    // 选择器类型为年时直接选中，不是则将UI更新到对应的月

    if (type === DateType.YEAR) {
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

  return {
    onCheck,
    onCheckTime,
    onCheckMonth,
    onCheckYear,
  };
}
