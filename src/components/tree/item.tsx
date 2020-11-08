import React from 'react';
import cls from 'classnames';
import { If } from 'm78/fork';
import { CaretRightOutlined } from 'm78/icon';
import { useFn } from '@lxjx/hooks';
import { isFunction } from '@lxjx/utils';
import { stopPropagation } from 'm78/util';
import Check from 'm78/check';
import {
  filterIncludeDisableChildNode,
  highlightKeyword,
  isCheck,
  isMultipleCheck,
  isTruthyArray,
} from './common';
import { FlatMetas, ItemProps } from './types';

const openRotateClassName = 'm78-tree_open-icon';

const TreeItem = ({ data, share, methods, className, style, size }: ItemProps) => {
  const { openCheck, valCheck, props, isVirtual, state } = share;
  const { itemHeight, identWidth } = size;
  const { indicatorLine, expansionIcon, checkStrictly } = props;

  const value = data.value;
  const actions = data.actions;

  /** 是否展开 */
  const isOpen = openCheck.isChecked(value);

  /** 是否选中 */
  const isChecked = valCheck.isChecked(value);

  /** 单选多选类型检测 */
  const isSCheck = isCheck(props);
  const isMCheck = isMultipleCheck(props) && !isSCheck /* 权重低于单选 */;

  const isDisabled = props.disabled || valCheck.isDisabled(value);

  /** 是否包含children */
  const hasChildren = !!data.children?.length;

  /** 是否是同级中最后一项 */
  const isLast =
    indicatorLine /* 不显示时跳过检测 */ && data.siblings[data.siblings.length - 1] === data;

  const iconStyle = { height: itemHeight, width: identWidth };

  const identUnitStyle = { width: identWidth };

  /** 处理值选中逻辑 */
  const valueCheckHandle = useFn(() => {
    if (isDisabled) return;

    if (isSCheck) {
      if (!hasChildren || props.checkTwig) {
        valCheck.setChecked([value]);
      }
    }

    if (isMCheck) {
      /** 选中树枝节点 */
      if (hasChildren && checkStrictly) {
        if (isChecked || checkIsPartial()) {
          // 取消当前节点和所有子节点选中
          valCheck.unCheckList(methods.getSelfAndDescendants(data));
        } else {
          // 选中当前节点和所有子节点中不包含禁用子节点的节点
          const ls = methods.getSelfAndDescendantsItem(data);

          valCheck.checkList(filterIncludeDisableChildNode(ls));
        }

        // 更新所有父节点的选中状态
        setTimeout(() => {
          methods.syncParentsChecked(data);
        });

        return;
      }

      // 启用关联时，选中同时需要更新所有父节点状态
      checkStrictly
        ? methods.syncParentsChecked(data, !isChecked) // 兄弟节点全选、反选时同步所有父级
        : valCheck.toggle(value);
    }
  });

  /** 处理展开关闭逻辑 */
  const toggleHandle = useFn(() => {
    if (isDisabled) return;

    const child = data.children;

    // 单选时共享此事件
    isSCheck && valueCheckHandle();

    if (!isTruthyArray(child)) return;

    if (isOpen) {
      // 已选中，移除当前级和所有子级
      openCheck.unCheckList(methods.getSelfAndDescendants(data));
    } else if (props.accordion) {
      // 手风琴开启，选中当前级和所有父级
      openCheck.setChecked(methods.getSelfAndParents(data));
    } else {
      // 正常单项选中
      openCheck.check(value);
    }
  });

  /** 检测是否半选 */
  function checkIsPartial() {
    // 当前项已选中
    if (isChecked || !checkStrictly) return false;

    // 查询子项
    const des = data.descendantsValues;

    if (!isTruthyArray(des)) return false;

    return des!.some(valCheck.isChecked);
  }

  function renderIdent(parent: FlatMetas, identInd: number) {
    // 当前层最后一个
    const currentLast = indicatorLine && isLast && identInd + 1 === data.zIndex;

    const child = parent.children;

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

  return (
    <div
      className={cls('m78-tree_item', className, {
        __active: isChecked,
        __disabled: isDisabled,
      })}
      style={{ [isVirtual ? 'height' : 'minHeight']: itemHeight, ...style }}
      onClick={toggleHandle}
    >
      {isSCheck && isChecked && <div className="m78-tree_checked" />}
      <div className="m78-tree_main">
        <div className="m78-tree_ident">
          {data.parents && data.parents.map(renderIdent)}

          <If when={!hasChildren}>
            <span className="m78-tree_icon" style={iconStyle}>
              {data.icon || props.icon || (
                <span className="m78-dot" style={{ width: 3, height: 3 }} />
              )}
            </span>
          </If>

          <If when={hasChildren}>
            <span className={cls('m78-tree_icon', isOpen && '__open')} style={iconStyle}>
              {renderExpansionIcon()}
            </span>
          </If>
        </div>
        <span className={cls('m78-tree_cont', isVirtual && 'ellipsis')}>
          <span {...stopPropagation}>
            {isMCheck && (
              <Check
                type="checkbox"
                partial={checkIsPartial()}
                checked={isChecked}
                disabled={isDisabled}
                onChange={valueCheckHandle}
              />
            )}
          </span>
          {renderLabel()}
        </span>
      </div>
      {actions && (
        <div className="m78-tree_action" {...stopPropagation}>
          {isFunction(actions) ? actions(data) : actions}
        </div>
      )}
    </div>
  );
};

export default TreeItem;
