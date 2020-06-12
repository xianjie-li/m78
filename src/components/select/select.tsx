import React from 'react';

import Input from '@lxjx/fr/lib/input';
import Popper from '@lxjx/fr/lib/popper';
import Spin from '@lxjx/fr/lib/spin';
import Empty from '@lxjx/fr/lib/empty';
import Button from '@lxjx/fr/lib/button';
import {CloseCircleOutlined, CheckOutlined} from '@lxjx/fr/lib/icon';

import cls from 'classnames';

import {PopperPropsCustom} from '../popper/builtInComponent';
import {SelectOptionItem, SelectProps} from './type';

function CustomPopper(props: PopperPropsCustom) {
  const { content } = props;
  return <div className="fr-popper_content fr-select_popper">{content}</div>;
}

function Select<ValType = string>(props: SelectProps<ValType>) {
  const {
    className,
    listMaxHeight = 320,
    listItemHeight = 36,
    multiple,
    options = [],
    loading,
  } = props;

  function renderItem(item: SelectOptionItem<ValType>, index: number) {
    const label = item.label || item.value;
    const value = item.value || item.label;

    if (!label && item.type !== 'divider') {
      return null;
    }

    const height = item.type === 'divider' ? 1 : listItemHeight;

    return (
      <div
        key={(label as any) || index}
        className={cls('fr-select_item', {
          'fr-hb-b': !!item.type,
          __title: item.type === 'title',
          __divider: item.type === 'divider',
        })}
        style={{height}}
      >
        <span className="ellipsis">{label}</span>
      </div>
    );
  }

  function renderList() {
    return (
      <div className="fr-select_list" style={{maxHeight: listMaxHeight, width: 200}}>
        {loading && <Spin full size="small" text={null}/>}
        {/* <Empty size="small" desc="暂无内容" /> */}
        {options.map(renderItem)}
      </div>
    );
  }

  function renderPrefix() {
    return (
      <div
        onClick={e => {
          // e.stopPropagation();
          // e.preventDefault();
          // e.nativeEvent.stopPropagation();
          // console.log(2);
        }}
        className="fr-select_tags"
      >
        <Button size="small" md>
          标签1标签1标签1
          <span className="fr-select_close-btn" title="删除">
            <CloseCircleOutlined/>
          </span>
        </Button>
        <Button size="small">
          标签2
          <span className="fr-select_close-btn" title="删除">
            <CloseCircleOutlined/>
          </span>
        </Button>
        <Button size="small">
          标签2
          <span className="fr-select_close-btn" title="删除">
            <CloseCircleOutlined/>
          </span>
        </Button>
        <Button size="small">
          <span className="ellipsis">标签2标签2标签2标签2标签2标签2</span>
          <span className="fr-select_close-btn" title="删除">
            <CloseCircleOutlined/>
          </span>
        </Button>
        <Button size="small">
          标签2
          <span className="fr-select_close-btn" title="删除">
            <CloseCircleOutlined/>
          </span>
        </Button>
      </div>
    );
  }

  return (
    <Popper
      show
      offset={4}
      className={cls(className)}
      content={renderList()}
      direction="bottomStart"
      trigger="click"
      customer={CustomPopper}
    >
      <Input
        // TODO: 多选包含标签时上边距
        style={{padding: multiple ? 10 : '0 10px'}}
        className="fr-select __multiple"
        placeholder="请输入内容"
        prefix={renderPrefix()}
      />
    </Popper>
  );
}

export default Select;
