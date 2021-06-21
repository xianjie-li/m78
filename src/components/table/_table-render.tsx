import React, { useEffect, useRef } from 'react';
import ReactDom from 'react-dom';
import { renderColgroup, renderTbody, renderTfoot, renderThead } from 'm78/table/renders';
import { _Context, _TableColumnInside, TableColumnFixedEnum } from 'm78/table/types';
import ResizeObserver from 'resize-observer-polyfill';
import { AnyObject } from '@lxjx/utils';
import clsx from 'clsx';
import { createEvent, useSelf } from '@lxjx/hooks';

interface Props {
  type?: TableColumnFixedEnum;
  isMain?: boolean;
  containerProps?: AnyObject;
  column: _TableColumnInside[];
  ctx: _Context;
  innerRef?: React.MutableRefObject<HTMLTableElement>;
}

/**
 * 用于表格和左右固定栏渲染，主要目的是监听固定栏宽度来更新主表格的最小宽度，防止栏目宽度不足100%时出现空格
 * */
const _TableRender = ({ type, innerRef, ctx, containerProps, column, isMain }: Props) => {
  const updateEvent = ctx.states.updateEvent;
  const isVirtual = ctx.states.isVirtual;
  const fake = ctx.states.fakeTheadElRef;

  // 容器ref
  const wrapRef = useRef<HTMLDivElement>(null!);

  const self = useSelf({
    // 左侧固定栏尺寸
    left: 0,
    // 右侧固定栏尺寸
    right: 0,
    // 上一次的尺寸
    lastWidth: 0,
  });

  // 主表格设置最小宽度
  updateEvent.useEvent((_type, width) => {
    if (!isMain || !wrapRef.current) return;

    if (_type === TableColumnFixedEnum.left) self.left = width;
    if (_type === TableColumnFixedEnum.right) self.right = width;

    wrapRef.current.style.minWidth = `calc(100% - ${self.left + self.right}px)`;
  });

  // 固定侧栏尺寸变更时通知主表格更新最小宽度
  useEffect(() => {
    if (isMain) return;

    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      if (w !== self.lastWidth) updateEvent.emit(type, w);
      self.lastWidth = w;
    });

    ro.observe(wrapRef.current);

    return () => ro.disconnect();
  }, []);

  const restProps = isVirtual ? containerProps : {};

  return (
    <div ref={wrapRef} className={clsx('m78-table_main', type && `__${type}`)} {...restProps}>
      <table
        ref={innerRef}
        className={isMain ? undefined : clsx('m78-table_fixed-table', type && `__${type}`)}
      >
        {renderColgroup(ctx, column, isMain)}
        {renderThead(ctx, column)}
        {renderTbody(ctx, column, isMain)}
        {renderTfoot(ctx, column)}
      </table>
    </div>
  );
};

export default _TableRender;
