import { isNumber, isString, isTruthyOrZero } from '@lxjx/utils';
import { Tree } from 'm78/tree';

export const defaultProps = {
  columns: [],
  primaryKey: '',
  stripe: true,
  loading: false,
  cellMaxWidth: '300px',
  checkFieldValid: isTruthyOrZero,
  ...Tree.defaultProps,
  valueKey: 'id',
  customScrollbar: true,
};

export const tableHeaderHeight = 42;

/**
 * 将 ['user', 'name'], ['list', '0', 'title'] 格式的字段数组转换为字符串，
 * - 如果解析失败，返回null
 * - 如果数组成员非字符或数字，则将其忽略
 * */
export function stringifyArrayField(arr: Array<string | number>) {
  const s = arr.reduce((p, i) => {
    if (isNumber(Number(i))) {
      return `${p}[${i}]`;
    }

    if (isString(i)) {
      return (p as string).length ? `${p}.${i}` : i;
    }

    return p;
  }, '');

  return (s as string) || null;
}
