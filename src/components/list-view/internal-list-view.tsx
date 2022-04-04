import React, { useContext } from 'react';
import { Tile } from 'm78/layout';
import { Ellipsis } from 'm78/ellipsis';
import { RightOutlined } from '@ant-design/icons';
import classNames from 'clsx';
import { ListViewItemProps, ListViewItemStyle, ListViewProps, ListViewTitleProps } from './types';
import context from './context';

const Provider = context.Provider;

function InternalListView(props: ListViewProps) {
  const {
    children,
    border,
    size,
    effect = true,
    column,
    itemStyle = ListViewItemStyle,
    className,
    style,
  } = props;

  const hasColumn = column && column > 1;
  const isBorderItem = itemStyle === ListViewItemStyle.border;
  const isSplitItem = itemStyle === ListViewItemStyle.splitLine;

  return (
    <Provider value={props}>
      <div
        className={classNames('m78 m78-list-view', className, size && `__${size}`, {
          __border: border,
          __effect: effect,
          '__item-border': isBorderItem,
          '__split-line': isSplitItem && !hasColumn,
          __column: hasColumn,
        })}
        style={style}
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
  className,
  style,
  innerRef,
  ...ppp
}: ListViewItemProps) {
  const { column } = useContext(context);

  const hasColumn = column && column > 1;

  return (
    <Tile
      innerRef={innerRef}
      style={{ width: hasColumn ? `calc(${100 / column!}% - 8px)` : undefined, ...style }}
      className={classNames('m78 m78-list-view_item', className, disabled && '__disabled')}
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

function InternalListViewTitle({
  subTile,
  children,
  desc,
  className,
  style,
  ...ppp
}: ListViewTitleProps) {
  return (
    <div
      {...ppp}
      className={classNames('m78 m78-list-view_title', className, subTile && '__sub-title')}
      style={style}
    >
      <div>{children}</div>
      {desc && <div className="m78-list-view_title-desc">{desc}</div>}
    </div>
  );
}

InternalListView.displayName = 'ListView';
InternalListViewItem.displayName = 'ListViewItem';
InternalListViewTitle.displayName = 'ListViewTitle';

export { InternalListViewItem, InternalListView, InternalListViewTitle };
