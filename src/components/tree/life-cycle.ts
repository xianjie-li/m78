import { useEffect } from 'react';
import { isNumber } from '@lxjx/utils';
import { useUpdateEffect } from 'react-use';
import functions from './functions';
import { flatTreeData } from './common';
import { Share, TreeBaseProps } from './_types';

/**
 * 抽象的的树状态树声明周期，传入hasSearch来控制是否启用搜索
 * - 可被其他包含相同功能的组件消费，修改时需要主要是否会影响其他组件使用
 * */
export function useTreeLifeCycle(
  props: TreeBaseProps<any, any>,
  treeState: Share['treeState'],
  hasSearch: boolean,
) {
  const { state, setState, self } = treeState;
  const { defaultOpenAll, defaultOpenZIndex, dataSource, valueKey, labelKey, childrenKey } = props;

  // 搜索是否开启
  const shouldSearch =
    'keyword' in props || hasSearch; /* hasSearch为true目前表现为tree组件开启了toolbar search */

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

    const flatTree = flatTreeData(dataSource, {
      valueKey: valueKey!,
      labelKey: labelKey!,
      childrenKey: childrenKey!,
      skipSearchKeySplicing: !shouldSearch,
    });

    setState({
      nodes: flatTree,
      loading: false,
    });
  }, [dataSource]);

  // 启用默认展开全部行为
  useEffect(() => {
    // nodes第一次初始化时执行
    if (defaultOpenAll && state.nodes && !self.defaultOpenTriggered) {
      functions.openAll(treeState);
      self.defaultOpenTriggered = true;
    }
  }, [defaultOpenAll, state.nodes]);

  // 同步props.keyword到state.keyword
  useEffect(() => {
    if (!shouldSearch) return;
    treeState.setState({ keyword: props.keyword });
  }, [props.keyword]);

  // 搜索时自动展开全部
  useUpdateEffect(() => {
    if (!shouldSearch) return;
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
