import React from 'react';
import { getInitTableMeta, handleRowHover } from 'm78/table/functions';
import clsx from 'clsx';
import Cell from 'm78/table/_cell';
import { Button } from 'm78/button';
import { CaretRightOutlined, LoadingOutlined } from 'm78/icon';
import { If, Toggle } from 'm78/fork';
import { renderExpandNode } from 'm78/table/renders';
import { _Context, _TableColumnInside, TableTreeNode } from 'm78/table/types';
import { useTreeItem } from 'm78/tree/use-tree-item';
import { Share, TreeBasePropsMix, TreeValueType } from 'm78/tree';
import { areEqual } from 'react-window';
import { stopPropagation } from 'm78/util';
import { Check } from 'm78/check';
import { SizeEnum } from 'm78/types';
import item from 'm78/tree/item';

interface Props {
  data: TableTreeNode;
  index: number;
  ctx: _Context;
  /** 是否是主表格(非左右固定列表格) */
  isMainTable: boolean;
  /** 要渲染的列 */
  columns: _TableColumnInside[];
  /** 列主键值 */
  valueKey: TreeValueType;
  props: _Context['props'];
}

/** 表格体的一行 */
const _BodyRowItem = ({ data, index, ctx, isMainTable, columns, valueKey, props }: Props) => {
  const {
    states: { expandChecker, tableElRef },
    treeState,
  } = ctx;

  const { valChecker } = treeState;

  const ds = data.origin;

  const itemState = useTreeItem({
    data,
    treeState,
    props: props as any,
  });

  const expandNode = renderExpandNode(ctx, data, index);

  const isOdd = index % 2 === 0;

  const isExpanded = expandChecker.isChecked(valueKey);

  function renderIdentList() {
    if (!data.parents?.length) return null;

    return data.parents.map((parent, ind) => {
      return <span key={ind} className="m78-table_prefix-item" />;
    });
  }

  // 加载、展开按钮、节点空格
  function renderPrefixMain() {
    /* TODO: loading测试 */
    if (itemState.isLoading) {
      return (
        <span className="m78-table_prefix-item">
          <LoadingOutlined />
        </span>
      );
    }

    if (itemState.isTwig || itemState.isLoadTwig) {
      return (
        <span
          title={itemState.isEmptyTwig ? '空节点' : ''}
          className={clsx('m78-table_prefix-item __effect m78-tree_icon', {
            __open: itemState.isOpen,
            __empty: itemState.isEmptyTwig && !itemState.isLoadTwig,
          })}
          onClick={itemState.toggleHandle}
        >
          {itemState.renderExpansionIcon()}
        </span>
      );
    }

    return (
      <span className="m78-table_prefix-item m78-tree_icon">
        <span className="m78-dot" />
      </span>
    );
  }

  function renderSingleCheck() {
    if (itemState.isSCheck && (!itemState.isTwig || props.checkTwig)) {
      return (
        <span>
          <Check
            size={SizeEnum.small}
            type="radio"
            checked={itemState.isChecked}
            disabled={itemState.isDisabled}
            onChange={itemState.valueCheckHandle}
          />
        </span>
      );
    }
  }

  function renderPrefix(ind: number) {
    const isFirstColumn = ind === 0;

    if (!isFirstColumn) return null;

    return (
      <>
        {renderIdentList()}
        {renderPrefixMain()}
        {itemState.renderMultiCheck()}
        {renderSingleCheck()}
        {expandNode && (
          <Button
            className={clsx('m78-table_expand-icon', {
              __open: isExpanded,
            })}
            size="small"
            text
            onClick={e => {
              e.stopPropagation();
              if (expandChecker.isChecked(valueKey)) {
                expandChecker.setChecked([]);
              } else {
                expandChecker.setChecked([valueKey]);
              }
            }}
          >
            <span>
              <CaretRightOutlined />
            </span>
          </Button>
        )}
      </>
    );
  }

  return (
    <React.Fragment>
      <tr
        className={clsx('m78-table_body-row', {
          __odd: isOdd,
        })}
        onMouseEnter={e => handleRowHover(ctx, index, e)}
        onMouseLeave={e => handleRowHover(ctx, index, e)}
      >
        {columns.map(column => {
          return (
            <Cell
              key={column.index}
              tableElRef={tableElRef}
              prefix={renderPrefix(column.index)}
              {...getInitTableMeta({
                column,
                record: data.origin,
                colIndex: column.index,
                rowIndex: index,
              })}
              treeNode={data}
              ctx={ctx}
            />
          );
        })}
      </tr>
      <If when={isMainTable && expandNode && isExpanded}>{expandNode}</If>
    </React.Fragment>
  );
};

export default React.memo(_BodyRowItem, areEqual);
