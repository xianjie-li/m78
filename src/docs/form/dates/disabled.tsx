import React from 'react';
import { Dates, DateType, TimeLimiter, DateLimiter } from 'm78/dates';
import moment, { Moment } from 'moment';

const disabledDate: DateLimiter = (mmt: Moment, type: any) => {
  // 禁用本月5号以前的所有日期/月/年
  if (mmt.isBefore(moment().date(5), type)) {
    return true;
  }

  // 禁用每个月22和24号
  if (mmt.date() === 22 || mmt.date() === 24) return true;

  // 获取本月最后一天
  const endDay = moment().endOf('month');

  // 禁用本月倒数第 3、4、5天
  if (mmt.isBetween(endDay.clone().subtract(5, 'days'), endDay.clone().subtract(2, 'days'))) {
    return true;
  }

  // 禁用本月最后一天
  return endDay.isSame(mmt, 'date');
};

const disabledTime: TimeLimiter = meta => {
  // 禁用所有奇数小时
  if (meta.key === 'h' && meta.val % 2 !== 0) return true;

  // 当前时间为5、6、7点时禁用所有小于40的分钟项
  if (meta.h === 5 || meta.h === 6 || meta.h === 7) {
    if (meta.key === 'm' && meta.val < 40) return true;
  }
};

const disabledTimeWithDate: TimeLimiter = (meta, { checkedDate: mmt }) => {
  // 选择了偶数日期时，只能选择10点到14点
  if (mmt && mmt.date() % 2 === 0 && meta.key === 'h') {
    if (meta.val < 10 || meta.val > 14) return true;
  }
};

const DisabledDemo = () => {
  return (
    <div style={{ maxWidth: 320 }}>
      <div className="mt-24">
        <ul>
          <li>禁用本月5号以前的所有日期/月/年</li>
          <li>禁用每个月22和24号</li>
          <li>禁用本月倒数第 3、4、5天</li>
          <li>禁用本月最后一天</li>
        </ul>
        <Dates type={DateType.DATE} range disabledDate={disabledDate} disabledPreset />
      </div>

      <div className="mt-24">
        <ul>
          <li>禁用所有奇数小时</li>
          <li>当前时间为5、6、7点时禁用所有小于40的分钟项</li>
          <li>选择了偶数日期时，只能选择10点到14点</li>
          <li>
            时间选择器类型为范围选择时，会包含一个内置的限制器，隐藏结束时间中所有小于开始时间的选项
          </li>
          <li>当已选项被禁用时，会自动回退到改列第一个可用选项</li>
        </ul>
        <Dates type={DateType.TIME} range disabledTime={disabledTime} disabledPreset />
      </div>

      <div className="mt-24">
        <ul>
          <li>选择了偶数日期时，只能选择10点到14点</li>
        </ul>
        <Dates type={DateType.DATE} hasTime disabledTime={disabledTimeWithDate} disabledPreset />
      </div>

      <div className="mt-24">
        可以通过关闭`hideDisabledTime`来显示被禁用的选项
        <div>
          <Dates
            type={DateType.TIME}
            hideDisabledTime={false}
            disabledTime={disabledTime}
            disabledPreset
          />
        </div>
      </div>
    </div>
  );
};

export default DisabledDemo;
