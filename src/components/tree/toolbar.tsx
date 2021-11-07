import React, { useMemo } from 'react';
import { Button } from 'm78/button';
import { Select } from 'm78/select';
import { DownOutlined } from 'm78/icon';
import { Input } from 'm78/input';
import { useFn } from '@lxjx/hooks';
import { If } from 'm78/fork';
import { filterIncludeDisableChildNode, isMultipleCheck, isTruthyArray } from './common';
import { Share } from './_types';
import functions from './functions';
import { keywordChangeHandle } from './private-functions';

const OPEN_ALL = 'OPEN_ALL';
const FOLD_ALL = 'FOLD_ALL';

const Toolbar = ({ treeState, props, toolbar }: Share) => {
  const { valChecker, list, state } = treeState;
  const nodes = state.nodes;
  const conf = toolbar!;

  const isM = isMultipleCheck(props);

  const isDisabled = props.disabled;

  /** 生成展开选项 */
  const expansionOpt = useMemo(() => {
    if (!nodes) return [];

    const base = [
      {
        label: '全部展开',
        value: OPEN_ALL,
      },
      {
        label: '全部折叠',
        value: FOLD_ALL,
      },
    ];

    Array.from({ length: nodes.zList.length }).forEach((_, ind) => {
      base.push({
        label: `展开到${ind + 1}级`,
        value: String(ind),
      });
    });

    return base;
  }, [nodes]);

  /** 展开控制 */
  const expansionHandle = useFn(val => {
    if (val === OPEN_ALL) {
      functions.openAll(treeState);
      return;
    }

    if (val === FOLD_ALL) {
      functions.openToZ(treeState, 0);
      return;
    }

    functions.openToZ(treeState, Number(val));
  });

  /** 全选处理 */
  const checkAllHandle = useFn(() => {
    if (!isTruthyArray(list)) return;

    valChecker.setChecked(filterIncludeDisableChildNode(list));
  });

  return (
    <div className="m78-tree_toolbar">
      <div className="m78-tree_toolbar-left">
        <If when={isM && conf.check}>
          <Button
            size="small"
            text
            color={valChecker.allChecked ? 'primary' : undefined}
            onClick={checkAllHandle}
            disabled={isDisabled}
          >
            全选
          </Button>
          <Button size="small" text onClick={valChecker.unCheckAll} disabled={isDisabled}>
            取消全部
          </Button>
        </If>

        <If when={conf.fold}>
          {() => (
            <Select
              arrow
              value=""
              options={expansionOpt}
              onChange={expansionHandle}
              disabled={isDisabled}
            >
              <Button size="small" text disabled={isDisabled}>
                展开
                <DownOutlined className="color-second" style={{ fontSize: 8 }} />
              </Button>
            </Select>
          )}
        </If>

        <If when={isM && conf.checkCount}>
          <span className="color-second ml-8">
            共{valChecker.checked.length}/{list.length}项
          </span>
        </If>

        {props.toolbarExtra}
      </div>

      <If when={conf.search}>
        <div className="m78-tree_toolbar-right">
          <Input
            placeholder="关键词搜索"
            disabled={isDisabled}
            size="small"
            onChange={val => keywordChangeHandle(treeState, val)}
          />
        </div>
      </If>
    </div>
  );
};

export default Toolbar;
