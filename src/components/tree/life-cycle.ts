import { useEffect } from 'react';
import { isNumber } from '@lxjx/utils';
import { useUpdateEffect } from 'react-use';
import functions from './functions';
import { flatTreeData } from './common';
import { Share } from './types';

/**
 * 抽象的的树状态树声明周期，传入hasSearch来控制是否启用搜索
 * - 可被其他包含相同功能的组件消费，修改时需要主要是否会影响其他组件使用
 * */
export function useLifeCycle(share: Share, hasSearch = true) {
  const { props, treeState } = share;
  const { state, setState, self } = treeState;

  const { defaultOpenAll, defaultOpenZIndex, dataSource, valueGetter, labelGetter } = props;

  // 同步平铺dataSource
  useEffect(() => {
    if (!dataSource) {
      setState({
        loading: false,
      });
      return;
    }

    if (!state.loading) {
      setState({
        loading: true,
      });
    }

    // setTimeout(() => {
    const flatTree = flatTreeData(dataSource, {
      valueGetter,
      labelGetter,
      skipSearchKeySplicing: !hasSearch && !share.toolbar?.search,
    });

    setState({
      nodes: flatTree,
      loading: false,
    });
    // });
  }, [dataSource]);

  // 启用默认展开全部行为
  useEffect(() => {
    // nodes第一次初始化时执行
    if (defaultOpenAll && state.nodes && !self.defaultOpenTriggered) {
      functions.openAll(treeState);
      self.defaultOpenTriggered = true;
    }
  }, [defaultOpenAll, state.nodes]);

  // 搜索时自动展开全部
  useUpdateEffect(() => {
    if (!hasSearch) return;
    setTimeout(() => functions.openAll(treeState));
  }, [state.keyword]);

  // 默认展开到指定层级
  useEffect(() => {
    // nodes第一次初始化时执行
    if (isNumber(defaultOpenZIndex) && state.nodes && !self.defaultOpenZIndexTriggered) {
      functions.openToZ(treeState, defaultOpenZIndex);
      self.defaultOpenZIndexTriggered = true;
    }
  }, [defaultOpenZIndex, state.nodes]);
}
