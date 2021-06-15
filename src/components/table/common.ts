import { AnyObject, isArray, isString } from '@lxjx/utils';

export const getPrimaryKey = (obj: AnyObject) => obj.id || obj.key;

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
