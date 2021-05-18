import React, { useContext } from 'react';
import { GridsColProps, GridsRowProps, useMediaQuery } from 'm78/layout';
import { isNumber } from '@lxjx/utils';
import cls from 'clsx';
import { getCurrentMqProps } from './common';

const MAX_COLUMN = 12;
const ONE_COLUMN = 100 / MAX_COLUMN;

const context = React.createContext<Omit<GridsRowProps, 'children'>>({});

const getStyleValue = (n?: number) => {
  if (isNumber(n)) {
    return `${n * ONE_COLUMN}%`;
  }
  return undefined;
};

function Grids(props: GridsRowProps) {
  const { children, wrap = true, mainAlign, crossAlign, gutter, className, style, ...ppp } = props;

  return (
    <context.Provider value={props}>
      <div
        className={cls(
          'm78-grids',
          className,
          wrap && 'm78-flex-wrap',
          mainAlign && `m78-main-${mainAlign}`,
          crossAlign && `m78-cross-${crossAlign}`,
        )}
        style={{
          ...style,
          padding: isNumber(gutter) ? gutter / 2 : undefined,
        }}
      >
        {children}
      </div>
    </context.Provider>
  );
}

function GridsItem(props: GridsColProps) {
  const {
    children,
    className,
    style,
    // exclude
    col: a,
    offset: b,
    move: c,
    order: d,
    flex: e,
    hidden: f,
    align: g,
    xs,
    sm,
    md,
    lg,
    xl,
    xxl,
    // exclude
    ...ppp
  } = props;

  const mqMeta = useMediaQuery();

  const { gutter } = useContext(context);

  if (!mqMeta) return null;

  const current = getCurrentMqProps(mqMeta, props);

  const { col, offset, move, order, flex, hidden, align } = current;

  const _gutter = isNumber(gutter) ? gutter / 2 : undefined;

  return (
    <div
      {...ppp}
      className={cls('m78-grids_col', className, align && `m78-self-${align}`)}
      style={{
        ...style,
        width: getStyleValue(col),
        padding: _gutter,
        marginLeft: getStyleValue(offset),
        left: getStyleValue(move),
        order,
        flex,
        display: hidden ? 'none' : undefined,
      }}
    >
      {children}
    </div>
  );
}

// TODO: MediaQuery支持接收 xs={xx} sm={xx} 配置，并根据生效情况在meta中返回
/* 当前区间没有指定栅格大小时，会取此位置前第一个生效的栅格大小 */
/* 一个类似此函数的帮助函数，从{xs, sm, md}这样的对象中以指定规则取值
 * 因为支持小数点，所以可以只需要12列栅格即可完成非常精细的布局
 * */

Grids.Item = GridsItem;

export { Grids, GridsItem };
