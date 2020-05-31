import React from 'react';

import Input from '@lxjx/fr/lib/input';
import Popper from '@lxjx/fr/lib/popper';
import Spin from '@lxjx/fr/lib/spin';
import Empty from '@lxjx/fr/lib/empty';
import Button from '@lxjx/fr/lib/button';
import { CloseCircleOutlined } from '@lxjx/fr/lib/icon';

import cls from 'classnames';

import { PopperPropsCustom } from '../popper/builtInComponent';
import { SelectProps } from './type';

function CustomPopper(props: PopperPropsCustom) {
  const { content } = props;
  return <div className="fr-popper_content fr-select_popper">{content}</div>;
}

const Select: React.FC<SelectProps> = props => {
  const { className, listMaxHeight = 260 } = props;

  function renderList() {
    return (
      <div className="fr-select_list" style={{ maxHeight: listMaxHeight, width: 200 }}>
        {/* <Spin full size="small" text={null} /> */}
        {/* <Empty size="small" desc="暂无内容" /> */}
        <div className="fr-select_item __title fr-hb-b">
          <span className="ellipsis">选项二</span>
        </div>
        <div className="fr-select_item">
          <span className="ellipsis">选项一</span>
        </div>
        <div className="fr-select_item __active">
          <span className="ellipsis">选项二</span>
        </div>
        <div className="fr-select_item __title fr-hb-b">
          <span className="ellipsis">选项二</span>
        </div>
        <div className="fr-select_item">
          <span className="ellipsis">选项三</span>
        </div>
        <div className="fr-select_item">
          <span className="ellipsis">选项四选项四选项四选项四选项四选项四</span>
        </div>
        <div className="fr-select_item">
          <span className="ellipsis">选项三</span>
        </div>
        <div className="fr-select_item __divider fr-hb-b" />
        <div className="fr-select_item">
          <span className="ellipsis">选项三</span>
        </div>
        <div className="fr-select_item __disabled">
          <span className="ellipsis">选项三</span>
        </div>
        <div className="fr-select_item">
          <span className="ellipsis">选项三</span>
        </div>
        <div className="fr-select_item">
          <span className="ellipsis">选项三</span>
        </div>
        <div className="fr-select_item">
          <span className="ellipsis">选项三</span>
        </div>
        <div className="fr-select_item">
          <span className="ellipsis">选项三</span>
        </div>
        <div className="fr-select_item">
          <span className="ellipsis">选项三</span>
        </div>
      </div>
    );
  }

  function renderPrefix() {
    return (
      <div
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          e.nativeEvent.stopPropagation();
          console.log(2);
        }}
        className="fr-select_tags"
      >
        <Button size="small">
          标签1
          <span className="fr-select_close-btn" title="删除">
            <CloseCircleOutlined />
          </span>
        </Button>
        <Button size="small">
          标签2
          <span className="fr-select_close-btn" title="删除">
            <CloseCircleOutlined />
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
      <Input className="fr-select" placeholder="请输入内容" prefix={renderPrefix()} />
    </Popper>
  );
};

export default Select;
