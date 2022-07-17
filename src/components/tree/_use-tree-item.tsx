/**
 * 抽象的的树节点状态
 * - 可被其他包含相同功能的组件消费，修改时需要主要是否会影响其他组件使用
 * */
import { isArray, isFunction } from '@lxjx/utils';
import { useFn } from '@lxjx/hooks';
import { CaretRightOutlined } from 'm78/icon';
import React from 'react';
import { stopPropagation } from 'm78/common';
import { Check } from 'm78/check';
import { DragPartialEvent } from 'm78/dnd';
import { filterIncludeDisableChildNode, isTruthyArray } from './common';
import functions from './functions';
import { Share, TreeBasePropsMix, TreeNode } from './_types';

interface Props<Node = TreeNode> {
  /** 当前节点 */
  data: Node;
  /** 树状态 */
  treeState: Share['treeState'];
  /** tree组件props */
  props: TreeBasePropsMix;
}

const openRotateClassName = 'm78-tree_open-icon';

export default function _useTreeItem({ data, treeState, props }: Props) {
  const { openChecker, valChecker, loadingChecker, isSCheck, isMCheck, self } = treeState;
  const { onLoad, checkStrictly, dataSource, onDataSourceChange, expansionIcon } = props;

  const originDs = data.origin;

  const value = data.value;

  /** 是否包含children */
  const hasChildren = !!data.children?.length;

  /** 是否展开 */
  const isOpen = openChecker.isChecked(value);

  /** 是否选中 */
  const isChecked = valChecker.isChecked(value);

  const isLoading = loadingChecker.isChecked(value);

  const isDisabled = props.disabled || valChecker.isDisabled(value) || isLoading;

  /** 是否为树枝节点 */
  const isTwig = checkIsTwig();

  /** 是否为动态加载树 */
  const isLoadTwig = checkIsLoadTwig();

  /** 是否为空的树枝节点 */
  const isEmptyTwig = isTwig && !hasChildren;

  /** 是否是同级中最后一项 */
  const isLast = data.siblings[data.siblings.length - 1] === data;

  /** 处理值选中逻辑 */
  const valueCheckHandle = useFn(() => {
    if (isDisabled) return;

    if (isSCheck) {
      if (!isTwig || props.checkTwig) {
        valChecker.setChecked([value]);
      }
    }

    if (isMCheck) {
      /** 选中树枝节点时，更新子级选中状态 */
      if (hasChildren && checkStrictly) {
        if (isChecked || checkIsPartial()) {
          // 取消当前节点和所有子节点选中
          valChecker.unCheckList(functions.getSelfAndDescendants(data));
        } else {
          // 选中当前节点和所有子节点中不包含禁用子节点的节点
          const ls = functions.getSelfAndDescendantsItem(data);

          valChecker.checkList(filterIncludeDisableChildNode(ls));
        }

        // 更新所有父节点的选中状态
        setTimeout(() => {
          functions.syncParentsChecked(treeState, data);
        });

        return;
      }

      // 选中同时需要更新所有父节点状态
      checkStrictly
        ? functions.syncParentsChecked(treeState, data, !isChecked) // 兄弟节点全选、反选时同步所有父级
        : valChecker.toggle(value);
    }
  });

  /** 处理展开关闭逻辑 */
  const toggleHandle = useFn(() => {
    // if (isDisabled) return;

    props.onNodeClick?.(data);

    // // 单选时共享此事件
    // isSCheck && valueCheckHandle();

    if (!isTwig && !isLoadTwig) return;

    if (isLoadTwig && !isOpen) {
      loadHandle();
    }

    if (isOpen) {
      // 已选中，移除当前级和所有子级
      openChecker.unCheckList(functions.getSelfAndDescendants(data));
    } else if (props.accordion) {
      // 手风琴开启，选中当前级和所有父级
      openChecker.setChecked(functions.getSelfAndParents(data));
    } else {
      // 正常单项选中
      openChecker.check(value);
    }
  });

  /** DND拖动首帧的处理函数 */
  const handleDrag = useFn((e: DragPartialEvent<TreeNode>) => {
    const node = e.source.data;

    if (node) {
      self.currentDragNode = node;

      if (openChecker.isChecked(node.value)) {
        toggleHandle();
      }
    }
  });

  /** DND拖动结束的处理函数 */
  function handleDrop() {
    treeState.self.currentDragNode = undefined;
  }

  /** 检测是否半选 */
  function checkIsPartial() {
    // 当前项已选中
    if (isChecked || !checkStrictly) return false;

    // 查询子项
    const des = data.descendantsValues;

    if (!isTruthyArray(des)) return false;

    return des!.some(valChecker.isChecked);
  }

  /** 检测是否为树枝节点 */
  function checkIsTwig() {
    if (!isArray(data.children)) return false;

    if (props.emptyTwigAsNode) {
      if (data.children.length === 0) return false;
    }

    return true;
  }

  /** 检测是否为需要动态加载的树枝节点 */
  function checkIsLoadTwig() {
    // 是否开启
    if (!isFunction(onLoad)) return false;
    // 已有子级的树枝节点排除
    if (isTwig && isArray(originDs.children)) return false;
    // 标记为树叶节点的排除
    return !originDs.isLeaf;
  }

  /** 触发加载子级时的处理程序 */
  async function loadHandle() {
    if (!onLoad) return;

    loadingChecker.check(value);

    try {
      const _children = await onLoad(data);

      if (isArray(_children)) {
        data.origin[props.childrenKey!] = _children;
      } else {
        data.origin.isLeaf = true;
      }

      const newDs = [...dataSource!];

      onDataSourceChange?.(newDs);
    } catch (e) {
      // nothing
    } finally {
      // console.log('加载结束');
      loadingChecker.unCheck(value);
    }
  }

  function renderExpansionIcon() {
    if (expansionIcon) {
      if (isFunction(expansionIcon)) {
        return expansionIcon(isOpen, data, openRotateClassName);
      }

      return expansionIcon;
    }

    return <CaretRightOutlined className={openRotateClassName} />;
  }

  function renderMultiCheck() {
    if (!isMCheck) return null;
    return (
      <span {...stopPropagation} className="lh-1">
        <Check
          className="mr-8"
          waveWrap={false}
          type="checkbox"
          partial={checkIsPartial()}
          checked={isChecked}
          disabled={isDisabled}
          onChange={valueCheckHandle}
        />
      </span>
    );
  }

  /** 透传给DND的props */
  const dndProps = {
    data,
    enableDrop: true,
    onDrag: handleDrag,
    onDrop: handleDrop,
  };

  return {
    value,
    hasChildren,
    isOpen,
    isChecked,
    isSCheck,
    isMCheck,
    isLoading,
    isDisabled,
    isTwig,
    isLoadTwig,
    isEmptyTwig,
    isLast,
    valueCheckHandle,
    toggleHandle,
    checkIsPartial,
    checkIsTwig,
    checkIsLoadTwig,
    loadHandle,
    renderExpansionIcon,
    renderMultiCheck,
    dndProps,
  };
}
