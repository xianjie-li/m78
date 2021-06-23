import { useCheck, useSelf, useSetState } from '@lxjx/hooks';
import {
  _InsideState,
  TreeBaseNode,
  TreeBasePropsMix,
  TreeDataSourceItem,
  TreeNode,
  TreeValueType,
} from './types';
import { flatTreeData, useValCheckArgDispose } from './common';
import { useMemo } from 'react';
import { getShowList } from 'm78/tree/private-functions';

/**
 * 抽象的的树状态
 * - 可被其他包含相同功能的组件消费，修改时需要主要是否会影响其他组件使用
 * */
export function useTreeStates<Node = TreeNode, DS = TreeDataSourceItem>(props: TreeBasePropsMix) {
  /** 状态 */
  const [state, setState] = useSetState<_InsideState>({
    nodes: undefined,
    loading: true,
    keyword: '',
  });

  /** 实例 */
  const self = useSelf<{
    // 标记defaultOpen是否已触发过
    defaultOpenTriggered?: boolean;
    // 标记defaultOpenZIndex是否已触发过
    defaultOpenZIndexTriggered?: boolean;
    // 是否正在滚动中
    scrolling: boolean;
    // 恢复scrolling状态的计时器
    scrollingCheckTimer?: any;
  }>({
    scrolling: false,
  });

  /** 平铺列表 */
  const list = state.nodes ? state.nodes.list : [];

  /** 展开状态控制 */
  const openChecker = useCheck<TreeValueType, TreeBaseNode<Node, DS>>({
    ...props,
    options: list as any,
    collector: item => props.valueGetter!(item.origin as any),
    triggerKey: 'onOpensChange',
    valueKey: 'opens',
    defaultValueKey: 'defaultOpens',
    value: [],
    defaultValue: [],
    onChange: () => {},
  });

  /** 如果是单选类型，将props调整为兼容useCheck的格式并代理onChange */
  const checkProps = useValCheckArgDispose(props);

  /** 选中状态 */
  const valChecker = useCheck<TreeValueType, TreeBaseNode<Node, DS>>({
    ...(checkProps as any),
    options: list as any,
    collector: item => props.valueGetter!(item.origin as any),
    disables: state.nodes?.disabledValues,
  });

  /** 节点加载状态 */
  const loadingChecker = useCheck<TreeValueType>({});

  /** 实际显示的列表 */
  const showList = useMemo(() => getShowList(list, state, openChecker), [
    list,
    openChecker.checked,
    state.keyword,
  ]);

  return {
    state,
    setState,
    self,
    list,
    openChecker,
    valChecker,
    loadingChecker,
    showList,
  };
}
