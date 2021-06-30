import React from 'react';
import cls from 'clsx';
import { If, Switch } from 'm78/fork';
import { LoadingOutlined } from 'm78/icon';
import { isFunction } from '@lxjx/utils';
import { stopPropagation } from 'm78/util';
import { areEqual } from 'react-window';
import useTreeItem from './_use-tree-item';
import { highlightKeyword } from './common';
import { ItemProps, TreeBasePropsMix } from './types';

const TreeItem = React.memo(({ data, share, className, style, size }: ItemProps) => {
  const { treeState, props, isVirtual } = share;
  const { state } = treeState;
  const { itemHeight, identWidth } = size;
  const { indicatorLine } = props;

  const originDs = data.origin;

  const itemState = useTreeItem({
    data,
    props: props as TreeBasePropsMix,
    treeState,
  });

  const actions = originDs.actions;

  const iconStyle = { height: itemHeight, width: identWidth };

  const identUnitStyle = { width: identWidth };

  function renderIdentList() {
    if (!data.parents?.length) return null;

    return data.parents.map((parent, identInd) => {
      // 当前层最后一个
      const currentLast = indicatorLine && itemState.isLast && identInd + 1 === data.zIndex;

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
              {!currentLast && flag && <span className="m78-tree_line" />}
              {currentLast && <span className="m78-tree_turn-line" />}
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
          <If when={itemState.isLoading}>
            <span className="m78-tree_icon color" style={iconStyle}>
              <LoadingOutlined />
            </span>
          </If>
          <If when={itemState.isTwig || itemState.isLoadTwig}>
            <span
              className={cls('m78-tree_icon', {
                __open: itemState.isOpen,
                __empty: itemState.isEmptyTwig && !itemState.isLoadTwig,
              })}
              style={iconStyle}
            >
              {itemState.renderExpansionIcon()}
            </span>
          </If>
          <If>
            <span className="m78-tree_icon" style={iconStyle}>
              {originDs.icon || props.icon || (
                <span className="m78-dot" style={{ width: 3, height: 3 }} />
              )}
            </span>
          </If>
        </Switch>
      </div>
    );
  }

  function renderLabel() {
    if (state.keyword) {
      return (
        <span
          dangerouslySetInnerHTML={{ __html: highlightKeyword(originDs.label, state.keyword) }}
        />
      );
    }

    return <span>{originDs.label}</span>;
  }

  return (
    <div
      className={cls('m78-tree_item', className, {
        __active: itemState.isChecked,
        __disabled: itemState.isDisabled,
        // __dragging: snapshot?.isDragging,
        // __combine: snapshot?.combineTargetFor,
      })}
      onClick={() => {
        itemState.toggleHandle();
        itemState.isSCheck && itemState.valueCheckHandle();
      }}
      title={itemState.isEmptyTwig ? '空节点' : ''}
      style={{
        height: itemHeight,
        ...style,
      }}
    >
      {itemState.isSCheck && itemState.isChecked && <div className="m78-tree_checked" />}
      <div className="m78-tree_main">
        {renderIdent()}
        <span className={cls('m78-tree_cont', isVirtual && 'ellipsis')}>
          {itemState.renderMultiCheck()}
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
