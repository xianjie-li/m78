/*
 * ########################################
 * 组件内部使用的函数
 * ########################################
 * */

import { isNumber } from '@lxjx/utils';
import _debounce from 'lodash/debounce';
import { UseCheckReturns } from '@lxjx/hooks';
import { sizeMap } from './common';
import {
  _InsideState,
  Share,
  TreeBaseNode,
  TreeBasePropsMix,
  TreeProps,
  TreeValueType,
} from './_types';
import functions from './functions';

/** 根据参数获取应有尺寸 */
export function getSize({ itemHeight, identWidth, size }: TreeProps) {
  const _size = {
    itemHeight: itemHeight!,
    identWidth: identWidth!,
  };

  const hasH = isNumber(itemHeight);
  const hasW = isNumber(identWidth);

  // 优先使用直接传入的尺寸
  if (hasH && hasW) return _size;

  // 回退尺寸
  const builtIn = sizeMap[size || 'default'];

  if (!hasH) {
    _size.itemHeight = builtIn.h;
  }

  if (!hasW) {
    _size.identWidth = builtIn.identW;
  }

  return _size;
}

/** 获取要显示的列表 */
export function getShowList(
  list: TreeBaseNode[],
  state: _InsideState,
  openChecker: UseCheckReturns<TreeValueType, any>,
  filter: TreeBasePropsMix['filter'],
) {
  let _list = list;

  // 过滤关键字
  if (state.keyword) {
    _list = list.filter(item => {
      return item.fullSearchKey.indexOf(state.keyword) !== -1;
    });
  }

  // 过滤未选中和 props.filter
  return _list.filter(item => {
    const filterPass = filter ? filter(item) : true;
    return functions.isShow(openChecker, item) && filterPass;
  });
}

export const keywordChangeHandle = _debounce((treeState: Share['treeState'], keyword: string) => {
  treeState.setState({
    keyword,
  });
}, 300);
