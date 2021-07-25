import React, { useMemo } from 'react';
import cls from 'clsx';
import { If, Switch } from 'm78/fork';
import { LoadingOutlined } from 'm78/icon';
import { isFunction } from '@lxjx/utils';
import { stopPropagation } from 'm78/util';
import { areEqual } from 'react-window';
import { DND, DragBonus } from 'm78/dnd';
import useTreeItem from './_use-tree-item';
import { highlightKeyword } from './common';
import { ItemProps, TreeBasePropsMix } from './_types';

/** 默认的props.customIconRender */
const defIconRender = (arg: any) => arg;

const TreeItem = React.memo(({ data, share, className, style, size }: ItemProps) => {
  const { treeState, props, isVirtual } = share;
  const { state } = treeState;
  const { itemHeight, identWidth } = size;
  const { indicatorLine, customIconRender = defIconRender } = props;

  const originDs = data.origin;

  const itemState = useTreeItem({
    data,
    props: props as TreeBasePropsMix,
    treeState,
  });

  /** 父级是否存在icon, 第0级元素固定返回true */
  const parentHasIcon = useMemo(() => {
    if (props.twigIcon || data.zIndex === 0) return true;
    if (!data.parents?.length) return false;
    return !!data.parents[data.parents.length - 1].origin.icon;
  }, []);

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
            {(originDs.icon || props.twigIcon) && (
              <span className="m78-tree_icon" style={iconStyle}>
                {customIconRender(originDs.icon || props.twigIcon, data)}
              </span>
            )}
          </If>
          {/* 如果是节点、并且包含节点图标，在父级没有图标的情况下使用节点图标替换占位点，以优化显示 */}
          <If>
            <If when={(!originDs.icon && !props.icon) || parentHasIcon}>
              <span className="m78-tree_icon" style={iconStyle}>
                <span className="m78-dot" style={{ width: 3, height: 3 }} />
              </span>
            </If>
            <If when={originDs.icon || props.icon}>
              <span className="m78-tree_icon" style={iconStyle}>
                {customIconRender(originDs.icon || props.icon, data)}
              </span>
            </If>
          </If>
        </Switch>
      </div>
    );
  }

  function renderLabel() {
    if (state.keyword) {
      return (
        <div
          className="ellipsis"
          dangerouslySetInnerHTML={{ __html: highlightKeyword(originDs.label, state.keyword) }}
        />
      );
    }

    return <div className="ellipsis">{originDs.label}</div>;
  }

  function renderChild(dragBonus?: DragBonus) {
    const dragStatus = dragBonus?.status;

    const dT = dragStatus?.dragTop;
    const dB = dragStatus?.dragBottom;

    return (
      <div
        ref={dragBonus?.innerRef}
        className={cls('m78-tree_item', className, {
          __active: itemState.isChecked,
          'm78-tree_disabled': itemState.isDisabled || dragStatus?.dragging,
          'm78-tree_drag-combine': dragStatus?.dragOver && !dT && !dB,
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
        {dT && (
          <div
            className="m78-dnd-box_top m78-tree_drag-top-node"
            style={{
              left: data.parents?.length ? data.parents.length * iconStyle.width : undefined,
            }}
          />
        )}
        {dB && (
          <div
            className="m78-dnd-box_bottom m78-tree_drag-bottom-node"
            style={{
              left: data.parents?.length ? data.parents.length * iconStyle.width : undefined,
            }}
          />
        )}
        {itemState.isSCheck && itemState.isChecked && <div className="m78-tree_checked" />}
        <div className="m78-tree_main">
          {renderIdent()}
          <div className={cls('m78-tree_cont', isVirtual && 'ellipsis')}>
            {itemState.renderMultiCheck()}
            {renderLabel()}
          </div>
        </div>
        {(props.actions || actions) && (
          <div className="m78-tree_action" {...stopPropagation}>
            {isFunction(actions) ? actions(data) : actions}
            {isFunction(props.actions) ? props.actions(data) : props.actions}
          </div>
        )}
      </div>
    );
  }

  if (props.draggable) {
    return <DND {...itemState.dndProps}>{renderChild}</DND>;
  }

  return renderChild();
}, areEqual);

export default TreeItem;
