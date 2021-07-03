import {
  useCheck,
  useFn,
  useSelf,
  useSetState,
  useVirtualList,
  UseVirtualListOption,
} from '@lxjx/hooks';
import { useMemo } from 'react';
import { DragFullEvent } from 'm78/dnd';
import { getShowList } from './private-functions';
import {
  _InsideState,
  TreeBaseNode,
  TreeBasePropsMix,
  TreeDataSourceItem,
  TreeNode,
  TreeValueType,
} from './_types';
import { getValue, isCheck, isMultipleCheck, useValCheckArgDispose } from './common';

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
    collector: item => getValue(item.origin, props as any),
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
    collector: item => getValue(item.origin, props as any),
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

  /** 处理拖动逻辑排序 */
  const handleDrag = useFn((de: DragFullEvent<TreeBaseNode>) => {
    const { target, source, status } = de;

    // 内置拖动排序逻辑
    if (!props.skipDragDatasourceProcess) {
      const sNode = source?.data;
      const tNode = target?.data;

      if (!sNode || !tNode) return;

      // source所在列表
      let sourceList = props.dataSource || [];
      // target所在列表
      let targetList = props.dataSource || [];

      if (sNode.parents?.length) {
        const parent = sNode.parents[sNode.parents.length - 1];
        sourceList = parent.children as any;
      }

      if (tNode.parents?.length) {
        const parent = tNode.parents[tNode.parents.length - 1];
        targetList = parent.children as any;
      }

      // 移除source
      const sourceInd = sourceList.findIndex(item => item.value === sNode.value);
      if (sourceInd !== -1) {
        sourceList.splice(sourceInd, 1);
      }

      // 移动节点前后
      if (status.dragTop || status.dragBottom) {
        const targetInd = targetList.findIndex(item => item.value === tNode.value);

        if (targetInd !== -1) {
          if (status.dragTop) {
            if (targetInd === 0) {
              targetList.unshift(sNode.origin as any);
            } else {
              targetList.splice(targetInd, 0, sNode.origin as any);
            }
          }

          if (status.dragBottom) {
            targetList.splice(targetInd + 1, 0, sNode.origin as any);
          }
        }
      } else if (status.dragOver) {
        // 移动为子级

        if (!tNode.origin[props.childrenKey!]) {
          tNode.origin[props.childrenKey!] = [];
        }

        tNode.origin[props.childrenKey!].push(sNode.origin as any);
      }

      console.log(status);
    }

    const nextDataSource = [...props.dataSource!];

    // 更新dataSource
    props.onDataSourceChange?.(nextDataSource);
    // 通知
    props.onDragAccept?.(de, nextDataSource);
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
    handleDrag,
  };
}
