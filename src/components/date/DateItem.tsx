import React from 'react';
import cls from 'classnames';
import moment from 'moment';
import { DateItemProps } from './type';

const DateItem: React.FC<DateItemProps> = ({ itemMoment: m, currentMoment: cm, nowMoment }) => {
  const isCurrentBetween = m.isBetween(
    cm.clone().date(1),
    cm.clone().date(cm.daysInMonth()),
    'dates',
    '[]',
  );

  return (
    <div
      className={cls('fr-dates_date-item', {
        __gray: !isCurrentBetween,
        __focus: m.isSame(nowMoment, 'dates'),
      })}
    >
      <span>{m.date()}</span>
    </div>
  );
};

export default DateItem;
