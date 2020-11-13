import React, { useMemo, useRef } from 'react';
import { useCheck, useSelf, useSetState } from '@lxjx/hooks';
import cls from 'classnames';
import { VariableSizeList as List } from 'react-window';
import Spin from 'm78/spin';
import { VirtualItem } from './virtual-item';
import Empty from 'm78/empty';
import {
  FlatMetas,
  Share,
  TreePropsMultipleChoice,
  TreePropsSingleChoice,
  VirtualItemProps,
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

function Tree(props: TreePropsSingleChoice): JSX.Element;
function Tree(props: TreePropsMultipleChoice): JSX.Element;
function Tree(props: TreePropsSingleChoice | TreePropsMultipleChoice) {
  const { size, height } = props as Share['props'];

  // 虚拟列表实例
  const virtualList = useRef<List>(null!);

  const [state, setState] = useSetState<Share['state']>({
    flatMetas: undefined,
    loading: true,
    keyword: '',
  });

  const self = useSelf<Share['self']>({
    scrolling: false,
  });

  /** 平铺列表 */
  const list = state.flatMetas ? state.flatMetas.list : [];

  /** 是否开启虚拟滚动 */
  const isVirtual = !!(height && height > 0);

  /** 展开状态 */
  const openCheck = useCheck<string | number, FlatMetas>({
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

  /** 展开状态 */
  const valCheck = useCheck<string | number, FlatMetas>({
    ...checkProps,
    options: list,
    collector: props.valueGetter,
    disables: state.flatMetas?.disabledValues,
  });

  /** 共享状态 */
  const share: Share = {
    openCheck,
    valCheck,
    props: props as Share['props'],
    flatMetas: state.flatMetas,
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

  /** item的尺寸信息(高度、缩进) */
  const sizeInfo = methods.getSize();

  const itemData: VirtualItemProps['data'] = {
    size: sizeInfo,
    data: showList,
    share,
    methods,
  };

  function renderNormalList() {
    return showList.map(item => {
      return <TreeItem key={item.value} {...itemData} data={item} />;
    });
  }

  function renderVirtualList() {
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
      >
        {VirtualItem}
      </List>
    );
  }

  const isSearchAndNoList = state.keyword && !isTruthyArray(showList);

  return (
    <div className={cls('m78-tree m78-scroll-bar __hoverEffect __style', size && `__${size}`)}>
      {state.loading && <Spin full text="初始化中..." />}

      {share.toolbar && <Toolbar {...share} methods={methods} />}

      {(isSearchAndNoList || !isTruthyArray(props.dataSource)) && (
        <Empty desc="暂无数据" className="m78-tree_empty" />
      )}

      {isVirtual ? renderVirtualList() : renderNormalList()}
    </div>
  );
}

Tree.defaultProps = defaultProps;

export default Tree;
