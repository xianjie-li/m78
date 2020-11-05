import { isArray } from '@lxjx/utils';
import { OptionsItem } from './types';

export const defaultValueGetter = (item: OptionsItem) => item.value!;

export function isNonEmptyArray(arg: any): boolean {
  if (!isArray(arg)) return false;
  return arg.length !== 0;
}
