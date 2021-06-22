import { useCheck, useSelf, useSetState } from '@lxjx/hooks';
import { TreeBaseNode, TreeBasePropsMix, TreeValueType } from 'm78/tree/types';
import { flatTreeData, useValCheckArgDispose } from 'm78/tree/common';

/**
 * 抽象的的树状态
 * - 可被其他包含相同功能的组件消费，修改时需要主要是否会影响其他组件使用
 * */
export function useTreeStates(props: TreeBasePropsMix) {
  /** 状态 */
  const [state, setState] = useSetState<{
    /** 初始化状态 */
    loading: boolean;
    /** 扁平化的tree */
    nodes: ReturnType<typeof flatTreeData> | undefined;
    /** 当前搜索关键词 */
    keyword: string;
  }>({
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
  const openChecker = useCheck<TreeValueType, TreeBaseNode>({
    ...props,
    options: list,
    collector: props.valueGetter,
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
  const valChecker = useCheck<TreeValueType, TreeBaseNode>({
    ...checkProps,
    options: list,
    collector: props.valueGetter,
    disables: state.nodes?.disabledValues,
  });

  /** 节点加载状态 */
  const loadingChecker = useCheck<TreeValueType>({});

  return {
    state,
    setState,
    self,
    list,
    openChecker,
    valChecker,
    loadingChecker,
  };
}
