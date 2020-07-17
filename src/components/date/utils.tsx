import moment, { Moment } from 'moment';

/** 根据年、月获取用于显示的moment列表 */
export function getDates(year: number, month: number) {
  const base = `${year}-${month}`;

  const t = moment(base, 'Y-M');
  const moments: Moment[] = [];
  const dayNum = t.daysInMonth();

  for (let i = 0; i < dayNum; i++) {
    moments.push(moment(`${base}-${i + 1}`, 'Y-M-D'));
  }

  const firstM = moments[0];
  const firstMDay = firstM.day();

  const lastM = moments[moments.length - 1];

  // 前补齐
  if (firstMDay !== 1) {
    let count: number;
    if (firstMDay === 0) {
      count = 6;
    } else {
      count = firstMDay - 1;
    }

    for (let i = 0; i < count; i++) {
      moments.unshift(firstM.clone().subtract(i + 1, 'days'));
    }
  }

  // 后补齐, 共计42天 7 * 6
  const count = 42 - moments.length;

  for (let i = 0; i < count; i++) {
    moments.push(lastM.clone().add(i + 1, 'days'));
  }

  return moments;
}

/** 传入的moment获取数组 [上一月，当前，下一月] */
export function getListMoments(m: Moment) {
  const prev = m.clone();
  const next = m.clone();
  prev.subtract(1, 'month');
  next.add(1, 'month');

  return [prev, m.clone(), next];
}
