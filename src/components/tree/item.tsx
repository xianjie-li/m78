import React from 'react';
import cls from 'clsx';
import { If, Switch } from 'm78/fork';
import { CaretRightOutlined, LoadingOutlined } from 'm78/icon';
import { useFn } from '@lxjx/hooks';
import { isArray, isFunction } from '@lxjx/utils';
import { stopPropagation } from 'm78/util';
import { Check } from 'm78/check';
import { SizeEnum } from 'm78/types';
import { areEqual } from 'react-window';
import {
  filterIncludeDisableChildNode,
  highlightKeyword,
  isCheck,
  isMultipleCheck,
  isTruthyArray,
} from './common';
import { ItemProps } from './types';
import functions from 'm78/tree/functions';

const openRotateClassName = 'm78-tree_open-icon';

const TreeItem = React.memo(({ data, share, className, style, size }: ItemProps) => {
  const { treeState, props, isVirtual } = share;
  const { openChecker, valChecker, state, loadingChecker } = treeState;
  const { itemHeight, identWidth } = size;
  const {
    indicatorLine,
    expansionIcon,
    checkStrictly,
    emptyTwigAsNode,
    onLoad,
    onDataSourceChange,
    dataSource = [],
  } = props;

  const value = data.value;
  const actions = data.actions;

  /** 是否包含children */
  const hasChildren = !!data.children?.length;

  /** 是否展开 */
  const isOpen = openChecker.isChecked(value);

  /** 是否选中 */
  const isChecked = valChecker.isChecked(value);

  /** 单选多选类型检测 */
  const isSCheck = isCheck(props);
  const isMCheck = isMultipleCheck(props) && !isSCheck; /* 权重低于单选 */

  const isLoading = loadingChecker.isChecked(value);

  const isDisabled = props.disabled || valChecker.isDisabled(value) || isLoading;

  /** 是否为树枝节点 */
  const isTwig = checkIsTwig();

  /** 是否为动态加载树 */
  const isLoadTwig = checkIsLoadTwig();

  /** 是否为空的树枝节点 */
  const isEmptyTwig = isTwig && !hasChildren;

  /** 是否是同级中最后一项 */
  const isLast =
    indicatorLine /* 不显示时跳过检测 */ && data.siblings[data.siblings.length - 1] === data;

  const iconStyle = { height: itemHeight, width: identWidth };

  const identUnitStyle = { width: identWidth };

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
    if (isDisabled) return;

    props.onNodeClick?.(data);

    // 单选时共享此事件
    isSCheck && valueCheckHandle();

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

    if (emptyTwigAsNode) {
      if (data.children.length === 0) return false;
    }

    return true;
  }

  /** 检测是否为需要动态加载的树枝节点 */
  function checkIsLoadTwig() {
    // 是否开启
    if (!isFunction(onLoad)) return false;
    // 已有子级的树枝节点排除
    if (isTwig && hasChildren) return false;
    // 标记为树叶节点的排除
    return !data.isLeaf;
  }

  /** 触发加载子级时的处理程序 */
  async function loadHandle() {
    if (!onLoad) return;

    loadingChecker.check(value);

    try {
      const _children = await onLoad(data);

      if (isTruthyArray(_children)) {
        data.origin.children = _children;
      } else {
        data.origin.isLeaf = true;
      }

      const newDs = [...dataSource];

      onDataSourceChange?.(newDs);
    } catch (e) {
      // nothing
    } finally {
      // console.log('加载结束');
      loadingChecker.unCheck(value);
    }
  }

  function renderIdentList() {
    if (!data.parents?.length) return null;

    return data.parents.map((parent, identInd) => {
      // 当前层最后一个
      const currentLast = indicatorLine && isLast && identInd + 1 === data.zIndex;

      const child = parent.child;

      // 动态标识是否开启线
      let flag = true;

      if (data.parentsValues && child) {
        if (
          /** 如果父级的最后一个孩子是此节点的父级之一，则隐藏标识线 */
          data.parentsValues.includes(child[child.length - 1].value!)
        ) {
          flag = false;
        }
      }

      return (
        <span
          className={cls('m78-tree_ident-unit', props.rainbowIndicatorLine && `__c${identInd % 5}`)}
          style={identUnitStyle}
          key={identInd}
        >
          {indicatorLine && (
            <>
              {!currentLast && flag && <span className="m78-tree_line-node m78-tree_line" />}
              {currentLast && <span className="m78-tree_line-node m78-tree_turn-line" />}
            </>
          )}
        </span>
      );
    });
  }

  function renderIdent() {
    return (
      <div className="m78-tree_ident">
        {renderIdentList()}

        <Switch>
          <If when={isLoading}>
            <span className="m78-tree_icon color" style={iconStyle}>
              <LoadingOutlined />
            </span>
          </If>
          <If when={isTwig || isLoadTwig}>
            <span
              className={cls('m78-tree_icon', {
                __open: isOpen,
                __empty: isEmptyTwig && !isLoadTwig,
              })}
              style={iconStyle}
            >
              {renderExpansionIcon()}
            </span>
          </If>
          <If>
            <span className="m78-tree_icon" style={iconStyle}>
              {data.icon || props.icon || (
                <span className="m78-dot" style={{ width: 3, height: 3 }} />
              )}
            </span>
          </If>
        </Switch>
      </div>
    );
  }

  function renderExpansionIcon() {
    if (expansionIcon) {
      if (isFunction(expansionIcon)) {
        return expansionIcon(isOpen, openRotateClassName);
      }

      return expansionIcon;
    }

    return <CaretRightOutlined className={openRotateClassName} />;
  }

  function renderLabel() {
    if (state.keyword) {
      return (
        <span dangerouslySetInnerHTML={{ __html: highlightKeyword(data.label, state.keyword) }} />
      );
    }

    return <span>{data.label}</span>;
  }

  function renderMultiCheck() {
    return (
      <span {...stopPropagation}>
        {isMCheck && (
          <Check
            size={SizeEnum.small}
            type="checkbox"
            partial={checkIsPartial()}
            checked={isChecked}
            disabled={isDisabled}
            onChange={valueCheckHandle}
          />
        )}
      </span>
    );
  }

  return (
    <div
      className={cls('m78-tree_item', className, {
        __active: isChecked,
        __disabled: isDisabled,
        // __dragging: snapshot?.isDragging,
        // __combine: snapshot?.combineTargetFor,
      })}
      onClick={toggleHandle}
      title={isEmptyTwig ? '空节点' : ''}
      style={{
        height: itemHeight,
        ...style,
      }}
    >
      {isSCheck && isChecked && <div className="m78-tree_checked" />}
      <div className="m78-tree_main">
        {renderIdent()}
        <span className={cls('m78-tree_cont', isVirtual && 'ellipsis')}>
          {renderMultiCheck()}
          {renderLabel()}
        </span>
      </div>
      {(props.actions || actions) && (
        <div className="m78-tree_action" {...stopPropagation}>
          {isFunction(actions) ? actions(data) : actions}
          {isFunction(props.actions) ? props.actions(data) : props.actions}
        </div>
      )}
    </div>
  );
}, areEqual);

export default TreeItem;
