import React from 'react';
import cls from 'classnames';
import { If } from 'm78/fork';
import { CaretRightOutlined } from 'm78/icon';
import { useFn } from '@lxjx/hooks';
import { isNonEmptyArray } from 'm78/tree/common';
import { isArray } from '@lxjx/utils';
import { FlatMetas, Share } from './types';
import { useMethods } from './useMethods';

interface ItemProps {
  open: boolean;
  data: FlatMetas;
  share: Share;
  methods: ReturnType<typeof useMethods>;
}

const TreeItem = ({ open, data, share }: ItemProps) => {
  const { openCheck } = share;

  const hasChildren = !!data.children?.length;

  const isLast = data.siblings[data.siblings.length - 1] === data;

  const value = data.value;

  const isTopLevel = data.zIndex === 0;

  const realOpen = open || isTopLevel;

  /** 开启或关闭该节点，关闭时，会将该节点下所有展开节点一并关闭 */
  const toggleHandler = useFn(() => {
    const child = data.children;
    if (!isNonEmptyArray(child)) return;

    if (openCheck.isChecked(value)) {
      const all = [data.value];

      if (isArray(data.descendantsValues)) {
        all.push(...data.descendantsValues);
      }

      openCheck.unCheckList(all);
    } else {
      openCheck.check(value);
    }
  });

  return (
    <If when={realOpen}>
      {() => (
        <div className="m78-tree_item" onClick={toggleHandler}>
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
                  <span className="m78-dot" style={{ width: 3, height: 3 }} />
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
      )}
    </If>
  );
};

export default TreeItem;
