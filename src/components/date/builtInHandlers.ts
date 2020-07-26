import { DisabledLimiter } from './type';

/** 从结束时间中开始时间之前的所有时间 */
const rangeDisabledBeforeTime: DisabledLimiter = ({ h, m, val, key }, { checkedDate, isRange }) => {
  if (isRange && checkedDate) {
    if (key === 'h' && checkedDate.hour() > val) {
      return true;
    }

    if (key === 'm' && checkedDate.hour() === h) {
      return checkedDate.minute() > val;
    }

    if (key === 's' && checkedDate.hour() === h && checkedDate.minute() === m) {
      return checkedDate.seconds() > val;
    }
  }
};

export { rangeDisabledBeforeTime };
