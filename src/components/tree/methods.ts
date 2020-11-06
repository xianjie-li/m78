import { isArray, isNumber } from '@lxjx/utils';
import _clamp from 'lodash/clamp';
import { isTruthyArray } from 'm78/tree/common';
import { FlatMetas, OptionsItem, Share, TreeValueType } from './types';

export function useMethods(share: Share) {
  const { props, openCheck, flatMetas } = share;
  const { valueGetter } = props;

  function getIds(list: OptionsItem[]) {
    return list.map(valueGetter);
  }

  /** 检测某项是否展开 */
  function isOpen(item: FlatMetas) {
    const parents = item.parents;
    if (!isTruthyArray(parents)) return false;

    const p = parents![parents!.length - 1];

    if (!p) return false;

    return openCheck.checked.indexOf(p.value) !== -1;
  }

  /** 展开所有项 */
  function openAll() {
    openCheck.setChecked(flatMetas.expandableValues);
  }

  /** 展开到第几级(0开始)，超出或小于时会自动限定在界定层级 */
  function openToZ(z: number) {
    if (!isNumber(z)) return;

    const zList = flatMetas.zListValues;

    const _z = _clamp(z, 0, zList.length - 1);

    const values = zList.slice(0, _z + 1 /* 右闭区间 */).reduce((p, i) => [...p, ...i], []);

    openCheck.setChecked(values);
  }

  return {
    getIds,
    isOpen,
    openAll,
    openToZ,
  };
}
