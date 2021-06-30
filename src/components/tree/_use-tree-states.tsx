import { useCheck, useSelf, useSetState, useVirtualList, UseVirtualListOption } from '@lxjx/hooks';
import { useMemo } from 'react';
import { getShowList } from 'm78/tree/private-functions';
import {
  _InsideState,
  TreeBaseNode,
  TreeBasePropsMix,
  TreeDataSourceItem,
  TreeNode,
  TreeValueType,
} from './_types';
import { isCheck, isMultipleCheck, useValCheckArgDispose } from './common';

/**
 * 抽象的的树状态
 * - 可被其他包含相同功能的组件消费，修改时需要主要是否会影响其他组件使用
 * - 传入isVirtual开启虚拟滚动，此时需要通过virtualOption进行虚拟滚动配置
 * */
export default function _useTreeStates<Node = TreeNode, DS = TreeDataSourceItem>(
  props: TreeBasePropsMix,
  isVirtual?: boolean,
  virtualOption?: Omit<UseVirtualListOption<Node>, 'list'>,
) {
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
    // 当前正在拖拽的节点
    currentDragNode?: TreeNode;
  }>({});

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
    openChecker.checked,
    state.keyword,
    list,
  ]);

  const virtualList = useVirtualList<Node>({
    overscan: 2,
    key: (item: TreeBaseNode) => item.value,
    ...(virtualOption as any),
    disabled: !isVirtual,
    list: showList as any,
    keepAlive: (item: TreeBaseNode) => {
      if (self.currentDragNode) {
        return item.value === self.currentDragNode.value;
      }
    },
  });

  /** 单选多选类型检测 */
  const isSCheck = isCheck(props);
  const isMCheck = isMultipleCheck(props) && !isSCheck; /* 权重低于单选 */

  return {
    state,
    setState,
    self,
    list,
    virtualList,
    openChecker,
    valChecker,
    loadingChecker,
    showList,
    isSCheck,
    isMCheck,
  };
}
