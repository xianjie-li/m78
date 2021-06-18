import { AnyObject, isArray, isString, isTruthyOrZero } from '@lxjx/utils';
import { throwError } from 'm78/util';
import { TableMeta } from 'm78/table/types';

export const getPrimaryKey = (obj: AnyObject) => {
  const key = obj.id || obj.key;

  if (!isTruthyOrZero(key)) {
    throwError(
      'Get default PrimaryKey(id/key) failed, please manual set <Table primaryKey="<FieldName>" />',
      'Table',
    );
  }

  return key;
};

/** 获取对象中的指定字段，字段支持传入键数组，支持索引 */
export const getField = (obj: AnyObject, field?: string | string[]) => {
  if (isString(field)) {
    return obj?.[field];
  }

  if (isArray(field) && field.length) {
    return field.reduce((p, i) => {
      return p?.[i];
    }, obj);
  }
};

/** 获取一个只包含初始值的tableMeta, 可以传入指定对象覆盖默认值 */
export const getInitTableMeta = (overObj?: Partial<TableMeta>): TableMeta => {
  return {
    column: { label: '' }, // 表示一个不存在的列
    record: {},
    colIndex: 0,
    rowIndex: 0,
    isBody: false,
    isFoot: false,
    isHead: false,
    ...overObj,
  };
};
