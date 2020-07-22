import '@lxjx/fr/lib/date/style';

import React from 'react';
import moment, { Moment } from 'moment';
import { DatesProps } from './type';
import Datess from './Dates';

function disabledDate(mmt: Moment, type: any) {
  // 禁用本月5号以前的所有日期/月/年
  if (mmt.isBefore(moment().date(5), type)) {
    return true;
  }

  // 禁用每个月24/26号
  if (mmt.date() === 22 || mmt.date() === 24) return true;

  // 获取本月最后一天
  const endDay = moment().endOf('month');

  // 禁用本月倒数第 3、4、5天
  if (mmt.isBetween(endDay.clone().subtract(5, 'days'), endDay.clone().subtract(2, 'days'))) {
    return true;
  }

  // 禁用本月最后一天
  return endDay.isSame(mmt, 'date');
}

const disabledTime: DatesProps['disabledTime'] = (meta, mmt) => {
  // 禁用所有偶数小时
  // if (meta.key === 'h' && meta.val % 2 !== 0) return true;
  //
  // // 当前时间为5、6、7点时禁用所有小于40的分钟项
  // if (meta.h === 5 || meta.h === 6 || meta.h === 7) {
  //   if (meta.key === 'm' && meta.val < 40) return true;
  // }
  // 选择了偶数日期时，只能选择10点到14点
  // if (mmt && mmt.date() % 2 === 0 && meta.key === 'h') {
  //   if (meta.val < 10 || meta.val > 14) return true;
  // }
};

const Dates = () => {
  // const [val, setV] = useState('2020-7-20 15:30:30');

  return React.createElement(Datess, {
    type: 'year',
    hasTime: false,
    range: false,
    // value: val,
    disabledTime,
    disabledDate,
    // onChange(v, m) {
    //   setV(v);
    // },
  });
};

export { Dates, Datess };
