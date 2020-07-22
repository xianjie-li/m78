import React, { useMemo } from 'react';
import cls from 'classnames';
import { useFn } from '@lxjx/hooks';
import { useHover } from 'react-use-gesture';
import { dumpFn } from '@lxjx/utils';
import moment from 'moment';
import { DATE_FORMAT_DATE, DATE_FORMAT_MONTH, DATE_FORMAT_YEAR, formatDate } from './utils';
import { DateItemProps, DateType } from './type';

const DateItem: React.FC<DateItemProps> = ({
  itemMoment,
  currentMoment: cm,
  nowMoment,
  disabledDate,
  onCheck,
  checkedMoment,
  checkedEndMoment,
  onCurrentChange,
  tempMoment,
  type = DateType.DATE as NonNullable<DateItemProps['type']>,
  range,
  onActive = dumpFn,
  startDateLabel,
  endDateLabel,
}) => {
  /** 由于调用频率很高，一定要确保计算都被memo */

  const insideM = useMemo(() => itemMoment.clone(), [itemMoment]);

  // 对各种类型的值映射
  const map1 = {
    [DateType.DATE]: 'days',
    [DateType.MONTH]: 'months',
    [DateType.YEAR]: 'years',
  } as const;

  const map2 = {
    [DateType.DATE]: 'dates',
    [DateType.MONTH]: 'months',
    [DateType.YEAR]: 'years',
  } as const;

  const map3 = {
    [DateType.DATE]: DATE_FORMAT_DATE,
    [DateType.MONTH]: DATE_FORMAT_MONTH,
    [DateType.YEAR]: DATE_FORMAT_YEAR,
  } as const;

  // 前后一天
  const prev = useMemo(() => insideM.clone().subtract(1, map1[type]), [insideM]);
  const last = useMemo(() => insideM.clone().add(1, map1[type]), [insideM]);

  /** 是否是当天/月/年 */
  const isSame = useMemo(() => insideM.isSame(nowMoment, map2[type]), [insideM]);

  /** 是否在当前月 (只在 type = DATE 时需要) */
  const isCurrentBetween = useMemo(() => {
    return type === DateType.DATE
      ? insideM.isBetween(cm.clone().startOf('month'), cm.clone().endOf('month'), 'dates', '[]')
      : false;
  }, [insideM, cm]);

  /** 是否选中 */
  const isChecked = useMemo(() => {
    return checkedMoment ? insideM.isSame(checkedMoment, map2[type]) : false;
  }, [insideM, checkedMoment]);

  /** 是否为范围选中的尾值 */
  const isEndChecked = useMemo(() => {
    return checkedEndMoment ? insideM.isSame(checkedEndMoment, map2[type]) : false;
  }, [insideM, checkedEndMoment]);

  // 是否是范围选中的两个范围之间
  const isRangeCheckBetween = useMemo(() => {
    if (!range || !checkedMoment) return false;
    if (!checkedEndMoment && !tempMoment) return false;

    if (checkedMoment && checkedEndMoment) {
      return insideM.isBetween(checkedMoment, checkedEndMoment, map2[type]);
    }

    if (tempMoment) {
      const min = moment.min(checkedMoment, tempMoment);
      const max = moment.max(checkedMoment, tempMoment);

      return insideM.isBetween(min, max, map2[type]);
    }
    return false;
  }, [checkedMoment, checkedEndMoment, tempMoment, insideM]);

  const isDisabled = useMemo(() => disabledDate?.(insideM, type), [insideM]);

  /** 前后一天/月/年是否被禁用 */
  const prevDisabled = useMemo(() => disabledDate?.(prev, type), [prev]);
  const lastDisabled = useMemo(() => disabledDate?.(last, type), [last]);

  const isDisabledRange = isDisabled && (prevDisabled || lastDisabled);

  /** 是否是活动时间 */
  const isActiveDate = useMemo(() => {
    if (!range || !tempMoment || !checkedMoment || isDisabled) return false;
    if (checkedMoment && checkedEndMoment) return false;
    return insideM.isSame(tempMoment, map2[type]);
  }, [tempMoment, range]);

  /** 活动时间是否在选中时间之前 */
  const isActiveBeforeChecked = useMemo(() => {
    if (!isActiveDate || !tempMoment) return false;
    return tempMoment.isBefore(checkedMoment);
  }, [isActiveDate]);

  const isActiveSameChecked = useMemo(() => {
    if (!isActiveDate || !tempMoment) return false;
    return tempMoment.isSame(checkedMoment, map2[type]);
  }, [isActiveDate]);

  const bind = useHover(
    ({ hovering }) => {
      onActive(hovering ? insideM.clone() : undefined);
    },
    { enabled: onActive && range && !checkedEndMoment && !!checkedMoment && !isDisabled },
  );

  const onClick = useFn(() => {
    onActive(undefined);
    if (isDisabled) return;

    if (onCheck) {
      onCheck(formatDate(itemMoment, map3[type]), itemMoment.clone());
    }

    if (onCurrentChange && type === DateType.DATE && !isCurrentBetween) {
      onCurrentChange(insideM.clone());
    }
  });

  function renderItemFormat() {
    if (type === DateType.DATE) {
      return insideM.date();
    }

    if (type === DateType.MONTH) {
      return `${insideM.month() + 1}月`;
    }

    if (type === DateType.YEAR) {
      return `${insideM.year()}年`;
    }

    return '-';
  }

  return (
    <div
      className={cls('fr-dates_date-item', {
        __active: isChecked || isEndChecked || isActiveDate,
        __gray: type === DateType.DATE ? !isCurrentBetween : false,
        __focus: isSame,
        __disabled: isDisabled,
        __disabledRange: isDisabledRange,
        __firstRange: isDisabled && !prevDisabled,
        __lastRange: isDisabled && !lastDisabled,
        __yearMonth: type === DateType.MONTH || type === DateType.YEAR,
        __activeRange: isRangeCheckBetween,
      })}
      onClick={onClick}
      {...bind()}
    >
      {/* 日历模式 */}
      <span className="fr-dates_date-item-inner">
        {range && isChecked && !isEndChecked && (
          <span className="fr-dates_tips">{startDateLabel}</span>
        )}
        {range && isEndChecked && (
          <span className="fr-dates_tips">
            {isChecked ? `${startDateLabel}/${endDateLabel}` : endDateLabel}
          </span>
        )}
        {isActiveDate && isActiveSameChecked && (
          <span className="fr-dates_tips">
            设为{startDateLabel}/{endDateLabel}
          </span>
        )}
        {isActiveDate && !isActiveSameChecked && (
          <span className="fr-dates_tips">
            {isActiveBeforeChecked ? `设为${startDateLabel}` : `设为${endDateLabel}`}
          </span>
        )}
        {renderItemFormat()}
      </span>
    </div>
  );
};

export default DateItem;
