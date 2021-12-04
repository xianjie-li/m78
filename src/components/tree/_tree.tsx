import React from 'react';
import cls from 'clsx';
import { Spin } from 'm78/spin';
import { Empty } from 'm78/empty';
import { useDelayDerivedToggleStatus } from 'm78/hooks';
import { DNDContext } from 'm78/dnd';
import { isNumber } from '@lxjx/utils';
import useTreeStates from './_use-tree-states';
import { getSize } from './private-functions';
import { VirtualItem } from './virtual-item';
import {
  ItemProps,
  Share,
  TreeBasePropsMix,
  TreePropsMultipleChoice,
  TreePropsSingleChoice,
} from './_types';
import TreeItem from './_item';
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

/** Tree */
function Tree(props: TreePropsSingleChoice): JSX.Element;
function Tree(props: TreePropsMultipleChoice): JSX.Element;
function Tree(props: TreePropsSingleChoice | TreePropsMultipleChoice) {
  const { size, height } = props as Share['props'];

  /** 是否开启虚拟滚动 */
  const isVirtual = !!height;

  /** item的尺寸信息(高度、缩进) */
  const sizeInfo = getSize(props);

  /** 共享tree状态 */
  const treeState = useTreeStates(props as TreeBasePropsMix, isVirtual, {
    size: item => item.origin.height || sizeInfo.itemHeight,
    height: isNumber(height) ? height : undefined,
  });

  /** 延迟设置的加载状态, 防止数据量较少时loading一闪而过 */
  const loading = useDelayDerivedToggleStatus(treeState.state.loading, 150);

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

  const itemData: Pick<ItemProps, 'size' | 'share'> = {
    size: sizeInfo,
    share,
  };

  function renderNormalList() {
    return (
      <div className="m78-tree_nodes">
        {showList.map((item, index) => (
          <TreeItem key={item.value} {...itemData} data={item} index={index} />
        ))}
      </div>
    );
  }

  function renderVirtualList() {
    const virtualList = treeState.virtualList;

    // 虚拟滚动时，如果高度不为有效number则设置为固定height，用于优化虚拟滚动
    let heightKey = 'maxHeight';
    if (isVirtual && (!height || !isNumber(height))) {
      heightKey = 'height';
    }

    return (
      <div
        ref={virtualList.containerRef}
        className="m78-tree_nodes m78-scrollbar"
        style={{ [heightKey]: height || 0 }}
      >
        <div ref={virtualList.wrapRef}>
          <virtualList.Render>
            {state =>
              state.list.map(item => (
                <VirtualItem
                  key={item.key}
                  {...itemData}
                  data={item.data}
                  index={item.index}
                  scrolling={state.scrolling}
                />
              ))
            }
          </virtualList.Render>
        </div>
      </div>
    );
  }

  function renderList() {
    const list = isVirtual ? renderVirtualList() : renderNormalList();

    if (props.draggable) {
      return <DNDContext onAccept={treeState.handleDrag}>{list}</DNDContext>;
    }

    return list;
  }

  function renderToolbar() {
    if (!share.toolbar) return null;
    return <Toolbar {...share} />;
  }

  const isSearchAndNoList = treeState.state.keyword && !isTruthyArray(showList);

  const isEmpty = isSearchAndNoList || !isTruthyArray(props.dataSource);

  return (
    <div className={cls('m78 m78-tree __hoverEffect __style', size && `__${size}`)}>
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
