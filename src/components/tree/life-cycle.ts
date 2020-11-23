import { useEffect } from 'react';
import { isNumber } from '@lxjx/utils';
import { useUpdateEffect } from 'react-use';
import { flatTreeData } from './common';
import { Share } from './types';
import { useMethods } from './methods';

export function useLifeCycle(share: Share, methods: ReturnType<typeof useMethods>) {
  const { props, state, setState, self } = share;

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

    setTimeout(() => {
      const flatTree = flatTreeData(dataSource, {
        valueGetter,
        labelGetter,
        skipSearchKeySplicing: !share.toolbar?.search,
      });

      setState({
        nodes: flatTree,
        loading: false,
      });
    });
  }, [dataSource]);

  // 启用默认展开全部行为
  useEffect(() => {
    // nodes第一次初始化时执行
    if (defaultOpenAll && state.nodes && !self.defaultOpenTriggered) {
      methods.openAll();
      self.defaultOpenTriggered = true;
    }
  }, [defaultOpenAll, state.nodes]);

  // 搜索时自动展开全部
  useUpdateEffect(() => {
    setTimeout(methods.openAll);
  }, [state.keyword]);

  // 默认展开到指定层级
  useEffect(() => {
    // nodes第一次初始化时执行
    if (isNumber(defaultOpenZIndex) && state.nodes && !self.defaultOpenZIndexTriggered) {
      methods.openToZ(defaultOpenZIndex);
      self.defaultOpenZIndexTriggered = true;
    }
  }, [defaultOpenZIndex, state.nodes]);
}
