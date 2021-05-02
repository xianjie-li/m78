import React, { useContext } from 'react';
import { Tile } from 'm78/layout';
import { Ellipsis } from 'm78/ellipsis';
import { RightOutlined } from '@ant-design/icons';
import classNames from 'clsx';
import {
  ListViewItemProps,
  ListViewItemStyleEnum,
  ListViewProps,
  ListViewTitleProps,
} from './types';
import context from './context';

const Provider = context.Provider;

function InternalListView(props: ListViewProps) {
  const {
    children,
    border,
    size,
    effect = true,
    column,
    itemStyle = ListViewItemStyleEnum,
  } = props;

  const hasColumn = column && column > 1;
  const isBorderItem = itemStyle === ListViewItemStyleEnum.border;
  const isSplitItem = itemStyle === ListViewItemStyleEnum.splitLine;

  return (
    <Provider value={props}>
      <div
        className={classNames('m78-list-view', size && `__${size}`, {
          __border: border,
          __effect: effect,
          '__item-border': isBorderItem,
          '__split-line': isSplitItem && !hasColumn,
        })}
      >
        {children}
      </div>
    </Provider>
  );
}

function InternalListViewItem({
  title,
  desc,
  leading,
  trailing,
  arrow,
  crossAlign = 'center',
  titleEllipsis = 1,
  descEllipsis = 2,
  disabled,
  ...ppp
}: ListViewItemProps) {
  const { column } = useContext(context);

  const hasColumn = column && column > 1;

  return (
    <Tile
      style={{ width: hasColumn ? `calc(${100 / column!}% - 8px)` : undefined }}
      className={classNames('m78-list-view_item', disabled && '__disabled')}
      title={titleEllipsis ? <Ellipsis line={titleEllipsis}>{title}</Ellipsis> : title}
      desc={desc && <Ellipsis line={descEllipsis}>{desc}</Ellipsis>}
      leading={leading}
      trailing={
        (trailing || arrow) && (
          <span>
            <span>{trailing}</span>
            {arrow && <RightOutlined className="m78-list-view_item_arrow" />}
          </span>
        )
      }
      crossAlign={crossAlign}
      {...ppp}
    />
  );
}

function InternalListViewTitle({ subTile, children }: ListViewTitleProps) {
  return (
    <div className={classNames('m78-list-view_title', subTile && '__sub-title')}>{children}</div>
  );
}

InternalListView.displayName = 'ListView';
InternalListViewItem.displayName = 'ListViewItem';
InternalListViewTitle.displayName = 'ListViewTitle';

export { InternalListViewItem, InternalListView, InternalListViewTitle };
