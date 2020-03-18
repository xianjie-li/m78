
/* 内置format */
import { InputProps } from './type';

type BuildInPatterns = {
  [key in NonNullable<InputProps['format']>]: {
    pattern: string;
    delimiter?: string;
    lastRepeat?: boolean;
    repeat?: boolean;
  };
};

export const buildInPattern: BuildInPatterns = {
  phone: {
    delimiter: ' ',
    pattern: '3,4',
    lastRepeat: true,
  },
  idCard: {
    delimiter: ' ',
    pattern: '3,3,4',
    lastRepeat: true,
  },
  money: {
    delimiter: '\'',
    pattern: '5,3',
    lastRepeat: true,
  },
  bankCard: {
    delimiter: ' ',
    pattern: '3,4',
    lastRepeat: true,
  },
};

/* money format需要单独处理小数点 */
export function formatMoney(moneyStr = '', delimiter = '\'') {
  const dotIndex = moneyStr.indexOf('.');

  if (dotIndex === -1) return moneyStr;

  const first = moneyStr.slice(0, dotIndex - 1);
  // 移除小数点前一位以及以后所有的delimiter
  const last = moneyStr.slice(dotIndex - 1).replace(new RegExp(delimiter, 'g'), '');

  return first + last;
}

/* 处理 type=number */
export function parserNumber(value = '') {
  value = value.replace(/[^(0-9|.)]/g, '');
  // 去首位点
  if (value[0] === '.') {
    value = value.slice(1);
  }
  // 去1个以上的点
  const matchDot = value.match(/(\.)/g);
  if (matchDot && matchDot.length > 1) {
    const firstDotInd = value.indexOf('.');
    const firstStr = value.slice(0, firstDotInd + 1);
    const lastStr = value.slice(firstDotInd + 1).replace('.', '');
    value = firstStr + lastStr;
  }
  return value;
}

/* 处理 type=integer */
export function parserInteger(value = '') {
  return value.replace(/[\D]/g, '');
}

/* 处理 type=general */
export function parserGeneral(value = '') {
  return value.replace(/[\W]/g, '');
}

/* 处理 maxLength */
export function parserLength(value = '', maxLength: number) {
  return value.slice(0, maxLength);
}

/* 处理 min max */
export function parserThan(value = '', num: number, isMin = true) {
  const _num = Number(value);
  if (Number.isNaN(_num)) return value;
  if (isMin && _num < num) {
    return String(num);
  }
  if (!isMin && _num > num) {
    return String(num);
  }
  return value;
}
