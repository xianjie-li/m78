import moment, { Moment } from 'moment';
import { isArray } from '@lxjx/utils';
import _debounce from 'lodash/debounce';
import { SM } from 'm78/common';
import { DateLimiter, DatesProps, DateType, TimeLimiter, ShareMetas } from './type';

export const DATE_FORMAT_YEAR = 'YYYY';

export const DATE_FORMAT_MONTH = 'YYYY-MM';

export const DATE_FORMAT_DATE = 'YYYY-MM-DD';

export const DATE_FORMAT_TIME = 'HH:mm:ss';

export const DATE_FORMAT_DATE_TIME = `${DATE_FORMAT_DATE} ${DATE_FORMAT_TIME}`;

// 支持的value解析格式
export const DATE_DEFAULT_PARSE = [DATE_FORMAT_DATE_TIME, 'YYYY/MM/DD HH:mm:ss'];

export const formatMap = {
  [DateType.DATE]: DATE_FORMAT_DATE,
  [DateType.MONTH]: DATE_FORMAT_MONTH,
  [DateType.YEAR]: DATE_FORMAT_YEAR,
  [DateType.TIME]: DATE_FORMAT_TIME,
};

export const placeholderMaps = {
  [DateType.YEAR]: '年份',
  [DateType.MONTH]: '月份',
  [DateType.DATE]: '日期',
  [DateType.TIME]: '时间',
};

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

/** 根据年获取用于显示的月moment列表 */
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

/** 获取用于渲染的时间列表 */
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

/** 将一个时间串 HH:mm:ss 以当前日期拼接为一个完整moment对象并返回 */
export function concatTimeToMoment(tStr: string) {
  return moment(`${moment().format(DATE_FORMAT_DATE)} ${tStr}`, DATE_DEFAULT_PARSE);
}

/** 用于将传入的DisabledTime/DisabledTime或数组组成严格化为数组并与内置处理器合并 */
export function disabledHandlerFormat<T>(
  handler?: Array<T> | T,
  builtIn?: Array<T>,
): Array<T> | undefined {
  if (!handler) return builtIn;
  if (!isArray(handler)) return [...(builtIn || []), handler];
  if (!handler.length) return builtIn;
  return [...(builtIn || []), ...handler];
}

/** 接收DisabledTime或DisabledDate组成的数组并进行验证，如果有任意一个返回了true则返回true */
export function checkDisabled(handler: Array<DateLimiter> | Array<TimeLimiter>, ...args: any) {
  if (!handler.length) return false;

  for (let i = 0; i < handler.length; i++) {
    if ((handler[i] as any)(...args)) {
      return true;
    }
  }

  return false;
}

/** 决定了如何从value字符串中解析cValueMoment/endValueMoment */
export function parseValue({ value, type, props, self }: ShareMetas) {
  if (!value) return;
  const { range } = props;

  if (type === DateType.TIME) {
    if (range) {
      if (!value.length) return;

      const cValueM = concatTimeToMoment(value[0]);
      cValueM.isValid() && (self.cValueMoment = cValueM);

      if (value[1]) {
        const cEValueM = concatTimeToMoment(value[1]);
        cEValueM.isValid() && (self.endValueMoment = cEValueM);
      }
      return;
    }

    const cValueM = concatTimeToMoment(value as string);
    // 作为纯时间组件使用
    cValueM.isValid() && (self.cValueMoment = cValueM);
  } else {
    if (range) {
      if (!value.length) return;
      const cValueM = moment(value[0], DATE_DEFAULT_PARSE);
      cValueM.isValid() && (self.cValueMoment = cValueM);

      if (value[1]) {
        const cEValueM = moment(value[1], DATE_DEFAULT_PARSE);
        cEValueM.isValid() && (self.endValueMoment = cEValueM);
      }
      return;
    }
    const cEValueM = moment(value, DATE_DEFAULT_PARSE);
    cEValueM.isValid() && (self.cValueMoment = cEValueM);
  }
}

/** 根据大小屏切换选择器的展示方式 */
export function pickerTypeWrap(state: ShareMetas['state'], setState: ShareMetas['setState']) {
  return () => {
    const debounceResize = _debounce(() => {
      const isM = window.innerWidth <= SM;

      if (isM !== state.mobile) {
        setState({
          mobile: isM,
        });
      }
    }, 400);

    debounceResize();

    window.addEventListener('resize', debounceResize);

    return () => window.removeEventListener('resize', debounceResize);
  };
}

/** 格式化value到input中用于显示 */
export const defaultFormat: NonNullable<DatesProps['format']> = ({
  current,
  end,
  type,
  hasTime,
}) => {
  const isDateTime = hasTime && type === DateType.DATE;

  const format = formatMap[type] + (isDateTime ? ` ${DATE_FORMAT_TIME}` : '');

  if (current && end) {
    return `${current.format(format)} ~ ${end.format(format)}`;
  }

  if (current) {
    return `${current.format(format)}`;
  }

  return '';
};

/** 预设的时间段 */
export const timePreset = {
  day: [
    {},
    {
      hour: 23,
      minute: 59,
      second: 59,
    },
  ],
  morning: [
    {
      hour: 8,
    },
    {
      hour: 11,
    },
  ],
  midday: [
    {
      hour: 11,
    },
    {
      hour: 13,
    },
  ],
  afternoon: [
    {
      hour: 13,
    },
    {
      hour: 18,
    },
  ],
  evening: [
    {
      hour: 18,
    },
    {
      hour: 23,
    },
  ],
};
