import moment, { Moment } from 'moment';

export const DATE_FORMAT_YEAR = 'YYYY';

export const DATE_FORMAT_MONTH = 'YYYY-MM';

export const DATE_FORMAT_DATE = 'YYYY-MM-DD';

export const DATE_FORMAT_TIME = 'HH:mm:ss';

export const DATE_FORMAT_DATE_TIME = `${DATE_FORMAT_DATE} ${DATE_FORMAT_TIME}`;

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

/** 根据年、月获取用于显示的月moment列表 */
export function getMonths(year: number) {
  const ms: Moment[] = [];

  for (let i = 0; i < 12; i++) {
    ms.push(moment([year, i]));
  }

  return ms;
}

/** 根据年获取与该年相邻的前4年和后7年和对应区间的可读字符 */
export function getYears(year: number) {
  const ms: Moment[] = [];

  for (let i = 0; i < 5; i++) {
    ms.unshift(moment([year - i]));
  }

  for (let i = 1; i < 8; i++) {
    ms.push(moment([year + i]));
  }

  return [ms, `${year - 4} ~ ${year + 7}`] as const;
}

/** 根据年月日获取时间 */
export function getTimes() {
  const time = {
    h: [] as number[],
    m: [] as number[],
    s: [] as number[],
  };

  for (let i = 0; i < 24; i++) {
    time.h.push(i);
  }

  for (let i = 0; i < 60; i++) {
    time.m.push(i);
    time.s.push(i);
  }

  return time;
}

export function formatDate(m: Moment, format: string) {
  return m.format(format);
}
