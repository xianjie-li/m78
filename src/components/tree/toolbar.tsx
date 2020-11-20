import React, { useMemo } from 'react';
import Button from 'm78/button';
import Select from 'm78/select';
import { DownOutlined } from 'm78/icon';
import Input from 'm78/input';
import { useFn } from '@lxjx/hooks';
import { If } from 'm78/fork';
import { filterIncludeDisableChildNode, isMultipleCheck, isTruthyArray } from './common';
import { Share } from './types';
import { useMethods } from './methods';

const OPEN_ALL = 'OPEN_ALL';
const FOLD_ALL = 'FOLD_ALL';

const Toolbar = ({
  valCheck,
  list,
  nodes,
  methods,
  props,
  toolbar,
}: Share & { methods: ReturnType<typeof useMethods> }) => {
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
      methods.openAll();
      return;
    }

    if (val === FOLD_ALL) {
      methods.openToZ(0);
      return;
    }

    methods.openToZ(Number(val));
  });

  /** 全选处理 */
  const checkAllHandle = useFn(() => {
    if (!isTruthyArray(list)) return;

    valCheck.setChecked(filterIncludeDisableChildNode(list));
  });

  return (
    <div className="m78-tree_toolbar">
      <div className="m78-tree_toolbar-left">
        <If when={isM && conf.check}>
          <Button
            size="small"
            link
            color={valCheck.allChecked ? 'primary' : undefined}
            onClick={checkAllHandle}
            disabled={isDisabled}
          >
            全选
          </Button>
          <Button size="small" link onClick={valCheck.unCheckAll} disabled={isDisabled}>
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
              <Button size="small" link disabled={isDisabled}>
                展开
                <DownOutlined className="color-second" style={{ fontSize: 8 }} />
              </Button>
            </Select>
          )}
        </If>

        <If when={isM && conf.checkCount}>
          <span className="color-second ml-8">
            共{valCheck.checked.length}/{list.length}项
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
            onChange={methods.keywordChangeHandle}
          />
        </div>
      </If>
    </div>
  );
};

export default Toolbar;
