import { isArray } from '@lxjx/utils';
import { isNonEmptyArray } from 'm78/tree/common';
import { FlatMetas, OptionsItem, Share, TreeValueType } from './types';

export function useMethods(share: Share) {
  const { props, openCheck } = share;
  const { valueGetter } = props;

  function getIds(list: OptionsItem[]) {
    return list.map(valueGetter);
  }

  function isOpen(item: FlatMetas) {
    const parents = item.parents;
    if (!isNonEmptyArray(parents)) return false;

    const p = parents![parents!.length - 1];

    if (!p) return false;

    return openCheck.checked.indexOf(p.value) !== -1;
  }

  return {
    getIds,
    isOpen,
  };
}
