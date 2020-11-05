import React from 'react';
import { FlatMetas } from 'm78/tree/types';
import cls from 'classnames';
import { If } from 'm78/fork';
import { CaretRightOutlined } from 'm78/icon';

interface ItemProps {
  open: boolean;
  data: FlatMetas;
}

const TreeItem = ({ data }: ItemProps) => {
  const hasChildren = !!data.children?.length;
  const isLast = data.siblings[data.siblings.length - 1] === data;

  return (
    <div className="m78-tree_item">
      <div className="m78-tree_main">
        <div className="m78-tree_ident">
          {Array.from({ length: data.zIndex }).map((_, identInd) => {
            const currentLast = isLast && identInd + 1 === data.zIndex;

            return (
              <span
                className={cls('m78-tree_ident-unit', {
                  __line: !currentLast,
                  __turnLine: currentLast,
                })}
                key={identInd}
              />
            );
          })}

          <If when={!hasChildren}>
            <span className="m78-tree_icon">
              <span className="m78-dot" />
            </span>
          </If>

          <If when={hasChildren}>
            <span className="m78-tree_icon">
              <CaretRightOutlined />
            </span>
          </If>
        </div>
        <span className="m78-tree_cont">{data.label}</span>
      </div>
      <div className="m78-tree_action">操作</div>
    </div>
  );
};

export default TreeItem;
