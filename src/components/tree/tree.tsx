import React, { useMemo, useRef } from 'react';
import { useCheck, useSelf, useSetState } from '@lxjx/hooks';
import cls from 'classnames';
import { VariableSizeList as List } from 'react-window';
import Spin from 'm78/spin';
import Empty from 'm78/empty';
import { useDelayDerivedToggleStatus } from 'm78/hooks';
import {
  DraggableRubric,
  DragDropContext,
  Droppable,
  DraggableProvided,
  DraggableStateSnapshot,
  DroppableProvided,
  DroppableProps,
} from 'react-beautiful-dnd';
import { DragItem } from './drag-item';
import { useDragHandle } from './useDragHandle';
import { VirtualItem } from './virtual-item';
import {
  TreeNode,
  Share,
  TreePropsMultipleChoice,
  TreePropsSingleChoice,
  VirtualItemProps,
  TreeValueType,
} from './types';
import TreeItem from './item';
import {
  defaultLabelGetter,
  defaultValueGetter,
  getToolbarConf,
  isTruthyArray,
  useValCheckArgDispose,
} from './common';
import { useMethods } from './methods';
import { useLifeCycle } from './life-cycle';
import Toolbar from './toolbar';

export const defaultProps = {
  valueGetter: defaultValueGetter,
  labelGetter: defaultLabelGetter,
  indicatorLine: true,
  checkStrictly: true,
};

/**
 * 维护一个便利更新tree data的方法
 *  onDataSourceChange(ds) {}
 *
 *  move({ indexes: [1, 5, 7], t1 }, { indexes: [1, 2, 7], t2 });
 *  insert([1, 5, 7], t1, t2, t3, ...);
 *  push([1, 5, 7], t1, t2, ...);
 *  unshift([1, 5, 7, t1, t2, ...])
 *
 * 拖拽
 * 拖动开始时，关闭开启状态
 * 停止在一个可展开节点上时，延迟一定时间后展开该节点
 * 放置时根据拖动位置调整左侧缩进
 * 拖放到元素上时，将其合并到元素末尾
 * */

function Tree(props: TreePropsSingleChoice): JSX.Element;
function Tree(props: TreePropsMultipleChoice): JSX.Element;
function Tree(props: TreePropsSingleChoice | TreePropsMultipleChoice) {
  const { size, height, draggable } = props as Share['props'];

  // 虚拟列表实例
  const virtualList = useRef<List>(null!);

  const [state, setState] = useSetState<Share['state']>({
    nodes: undefined,
    loading: true,
    keyword: '',
  });

  const self = useSelf<Share['self']>({
    scrolling: false,
  });

  /** 平铺列表 */
  const list = state.nodes ? state.nodes.list : [];

  /** 延迟设置的加载状态, 防止数据量较少时loading一闪而过 */
  const loading = useDelayDerivedToggleStatus(state.loading, 150);

  /** 是否开启虚拟滚动 */
  const isVirtual = !!(height && height > 0);

  /** 展开状态 */
  const openCheck = useCheck<TreeValueType, TreeNode>({
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
  const valCheck = useCheck<TreeValueType, TreeNode>({
    ...checkProps,
    options: list,
    collector: props.valueGetter,
    disables: state.nodes?.disabledValues,
  });

  /** 节点加载状态 */
  const loadingCheck = useCheck<TreeValueType>({});

  /** 共享状态 */
  const share: Share = {
    openCheck,
    valCheck,
    loadingCheck,
    props: props as Share['props'],
    nodes: state.nodes,
    state,
    setState,
    self,
    isVirtual,
    list,
    toolbar: getToolbarConf(props.toolbar),
  };

  /** 内部方法 */
  const methods = useMethods(share);

  /** 生命周期 */
  useLifeCycle(share, methods);

  /** 实际显示的列表 */
  const showList = useMemo(() => methods.getShowList(list, state.keyword), [
    list,
    openCheck.checked,
    state.keyword,
  ]);

  /** 拖动相关 */
  const dragMetas = useDragHandle(share, methods, showList);

  /** item的尺寸信息(高度、缩进) */
  const sizeInfo = methods.getSize();

  const itemData: VirtualItemProps['data'] = {
    size: sizeInfo,
    data: showList,
    share,
    methods,
  };

  function renderNormalList() {
    if (!draggable) {
      return showList.map((item, index) => (
        <TreeItem key={item.value} {...itemData} data={item} index={index} />
      ));
    }

    return renderDragList((provided: DroppableProvided) => (
      <div ref={provided.innerRef}>
        {showList.map((item, index) => (
          <DragItem key={item.value} {...itemData} data={item} index={index} />
        ))}
        {provided.placeholder}
      </div>
    ));
  }

  function renderVirtualList() {
    const getList = (provided?: DroppableProvided) => {
      return (
        <List
          ref={virtualList}
          height={height || 0}
          itemCount={showList.length}
          itemSize={index => showList[index].height || sizeInfo.itemHeight}
          estimatedItemSize={sizeInfo.itemHeight}
          width="auto"
          className="m78-tree_nodes"
          overscanCount={3}
          itemData={itemData}
          itemKey={index => showList[index].value}
          onScroll={methods.scrollHandle}
          // 拖动
          outerRef={provided ? provided.innerRef : undefined}
        >
          {VirtualItem}
        </List>
      );
    };

    if (!draggable) return getList();

    return renderDragList(getList);
  }

  function renderDragPlaceHolder(
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot,
    rubric: DraggableRubric,
  ) {
    return (
      <TreeItem
        {...itemData}
        provided={provided}
        snapshot={snapshot}
        data={showList[rubric.source.index]}
        index={rubric.source.index}
      />
    );
  }

  function renderDragList(renderChildren: DroppableProps['children']) {
    return (
      <Droppable
        droppableId="m78-tree-droppable"
        mode={isVirtual ? 'virtual' : 'standard'}
        isCombineEnabled
        renderClone={isVirtual ? renderDragPlaceHolder : undefined}
      >
        {renderChildren}
      </Droppable>
    );
  }

  function renderList() {
    return isVirtual ? renderVirtualList() : renderNormalList();
  }

  const isSearchAndNoList = state.keyword && !isTruthyArray(showList);

  const isEmpty = isSearchAndNoList || !isTruthyArray(props.dataSource);

  return (
    <DragDropContext onDragEnd={() => {}} onBeforeCapture={dragMetas.beforeDragHandle}>
      <div className={cls('m78-tree m78-scroll-bar __hoverEffect __style', size && `__${size}`)}>
        {loading && <Spin full text="索引数据中..." />}

        {share.toolbar && <Toolbar {...share} methods={methods} />}

        {isEmpty && <Empty desc="暂无数据" className="m78-tree_empty" />}

        {!isEmpty && renderList()}
      </div>
    </DragDropContext>
  );
}

Tree.defaultProps = defaultProps;

export default Tree;
