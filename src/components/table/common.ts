import { AnyObject, isArray, isString, isTruthyOrZero } from '@lxjx/utils';
import { throwError } from 'm78/util';

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
