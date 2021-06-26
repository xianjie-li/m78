import React from 'react';
import clsx from 'clsx';
import { LoadingOutlined } from 'm78/icon';
import { useTreeItem, TreeValueType } from 'm78/tree';
import { areEqual } from 'react-window';
import { Check } from 'm78/check';
import { SizeEnum } from 'm78/types';
import { _Context, _TableColumnInside, TableTreeNode } from './_types';
import { getInitTableMeta, handleRowHover } from './_functions';
import Cell from './_cell';

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
const _BodyRowItem = ({ data, index, ctx, columns, props }: Props) => {
  const {
    states: { tableElRef },
    treeState,
  } = ctx;

  const itemState = useTreeItem({
    data,
    treeState,
    props: props as any,
  });

  const isOdd = index % 2 === 0;

  function renderIdentList() {
    if (!data.parents?.length) return null;

    return data.parents.map((parent, ind) => {
      return <span key={ind} className="m78-table_prefix-item" />;
    });
  }

  // 加载、展开按钮、节点空格
  function renderPrefixMain() {
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

    const z = treeState.state.nodes?.zList.length;

    // 大于1级时显示点占位符
    if (z && z > 1) {
      return (
        <span className="m78-table_prefix-item m78-tree_icon">
          <span className="m78-dot" /> {}
        </span>
      );
    }
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
    if (ind !== 0) return null;

    return (
      <>
        {renderIdentList()}
        {renderPrefixMain()}
        {itemState.renderMultiCheck()}
        {renderSingleCheck()}
      </>
    );
  }

  return (
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
            {...getInitTableMeta(ctx, {
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
  );
};

export default React.memo(_BodyRowItem, areEqual);
