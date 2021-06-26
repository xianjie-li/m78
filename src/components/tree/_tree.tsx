import React from 'react';
import cls from 'clsx';
import { VariableSizeList as List } from 'react-window';
import { Spin } from 'm78/spin';
import { Empty } from 'm78/empty';
import { useDelayDerivedToggleStatus } from 'm78/hooks';
import useTreeStates from './_use-tree-states';
import { getSize } from './private-functions';
import functions from './functions';
import { VirtualItem } from './virtual-item';
import {
  Share,
  TreeBasePropsMix,
  TreePropsMultipleChoice,
  TreePropsSingleChoice,
  VirtualItemProps,
} from './types';
import TreeItem from './item';
import { defaultProps, getToolbarConf, isTruthyArray } from './common';
import { useTreeLifeCycle } from './life-cycle';
import Toolbar from './toolbar';

/*
 * 由于其他组件(Table)会用到此组件内的树选择、树结构处理等功能，需要对相关的逻辑进行抽象用以复用，
 * 所以此组件内部的代码分为两种，一种是抽象的复用代码，一种是内部代码，修改抽象代码时应注意对其他相关组件的影响，
 *
 * 抽象只针对状态和行为部分，UI均自行实现
 *
 * 抽象的部分:
 * - `use-tree-states.tsx`  tree的主要状态
 * - `functions.tsx`        共享的操作函数
 *  */

/**
 * TODO: 拖拽
 * 拖动开始时，关闭开启状态
 * 停止在一个可展开节点上时，延迟一定时间后展开该节点
 * 放置时根据拖动位置调整左侧缩进
 * 拖放到元素上时，将其合并到元素末尾
 * */

function Tree(props: TreePropsSingleChoice): JSX.Element;
function Tree(props: TreePropsMultipleChoice): JSX.Element;
function Tree(props: TreePropsSingleChoice | TreePropsMultipleChoice) {
  const { size, height } = props as Share['props'];

  /** 共享tree状态 */
  const treeState = useTreeStates(props as TreeBasePropsMix);

  /** 延迟设置的加载状态, 防止数据量较少时loading一闪而过 */
  const loading = useDelayDerivedToggleStatus(treeState.state.loading, 150);

  /** 是否开启虚拟滚动 */
  const isVirtual = !!height;

  const showList = treeState.showList;

  /** 上下文状态 */
  const share: Share = {
    treeState,
    props: props as Share['props'],
    isVirtual,
    toolbar: getToolbarConf(props.toolbar),
  };

  /** 共享生命周期 */
  useTreeLifeCycle(props, treeState, !!share.toolbar?.search);

  /** item的尺寸信息(高度、缩进) */
  const sizeInfo = getSize(share);

  const itemData: VirtualItemProps['data'] = {
    size: sizeInfo,
    data: showList,
    share,
  };

  function renderNormalList() {
    return showList.map((item, index) => (
      <TreeItem key={item.value} {...itemData} data={item} index={index} />
    ));
  }

  function renderVirtualList() {
    return (
      <List
        // ref={virtualList}
        height={height || 0}
        itemCount={showList.length}
        itemSize={index => showList[index].origin.height || sizeInfo.itemHeight}
        estimatedItemSize={sizeInfo.itemHeight}
        width="auto"
        className="m78-tree_nodes"
        overscanCount={3}
        itemData={itemData}
        itemKey={index => showList[index].value}
        onScroll={() => functions.scrollHandle(treeState)}
      >
        {VirtualItem}
      </List>
    );
  }

  function renderList() {
    return isVirtual ? renderVirtualList() : renderNormalList();
  }

  function renderToolbar() {
    if (!share.toolbar) return null;
    return <Toolbar {...share} />;
  }

  const isSearchAndNoList = treeState.state.keyword && !isTruthyArray(showList);

  const isEmpty = isSearchAndNoList || !isTruthyArray(props.dataSource);

  return (
    <div className={cls('m78-tree m78-scroll-bar __hoverEffect __style', size && `__${size}`)}>
      {loading && <Spin full text="索引数据中..." />}

      {renderToolbar()}

      {isEmpty && <Empty desc="暂无数据" className="m78-tree_empty" />}

      {!isEmpty && renderList()}
    </div>
  );
}

Tree.defaultProps = defaultProps;
Tree.displayName = 'Tree';

export default Tree;
