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
    if (!dataSource) return;

    setTimeout(() => {
      const flatTree = flatTreeData(dataSource, {
        valueGetter,
        labelGetter,
        skipSearchKeySplicing: !share.toolbar?.search,
      });

      setState({
        flatMetas: flatTree,
        loading: false,
      });
    });
  }, [dataSource]);

  // 启用默认展开全部行为
  useEffect(() => {
    // flatMetas第一次初始化时执行
    if (defaultOpenAll && state.flatMetas && !self.defaultOpenTriggered) {
      methods.openAll();
      self.defaultOpenTriggered = true;
    }
  }, [defaultOpenAll, state.flatMetas]);

  // 搜索时自动展开全部
  useUpdateEffect(() => {
    setTimeout(methods.openAll);
  }, [state.keyword]);

  // 默认展开到指定层级
  useEffect(() => {
    // flatMetas第一次初始化时执行
    if (isNumber(defaultOpenZIndex) && state.flatMetas && !self.defaultOpenZIndexTriggered) {
      methods.openToZ(defaultOpenZIndex);
      self.defaultOpenZIndexTriggered = true;
    }
  }, [defaultOpenZIndex, state.flatMetas]);
}
