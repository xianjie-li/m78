import React, { useContext, createContext } from "react";
import { CellColProps, CellRowProps } from "./types.js";
import { _useMediaQuery } from "../media-query/hooks.js";
import { isArray, isNumber } from "@m78/utils";
import cls from "clsx";
import { _getCurrentMqProps } from "./common.js";
import { dumpFn } from "@m78/utils";

const MAX_COLUMN = 12;
/** 每列宽度 */
const ONE_COLUMN = 100 / MAX_COLUMN;

const context = createContext<Omit<CellRowProps, "children">>({});

/** 根据列数获取宽度 */
const getStyleValue = (n?: number) => {
  if (isNumber(n)) return `${n * ONE_COLUMN}%`;
};

/** gutter */
const getPadding = (gutter: CellRowProps["gutter"], isRevers = false) => {
  // 取负数
  const sing = isRevers ? -1 : 1;
  if (isNumber(gutter)) return (gutter / 2) * sing;
  if (isArray(gutter) && gutter.length === 2) {
    return `${(gutter[0] / 2) * sing}px ${(gutter[1] / 2) * sing}px`;
  }
};

function _Cells(props: CellRowProps) {
  const {
    children,
    gutter,
    wrap = true,
    mainAlign,
    crossAlign,
    className,
    style,
    innerRef,
    ...ppp
  } = props;

  return (
    <context.Provider value={props}>
      <div
        {...ppp}
        ref={innerRef}
        className={cls("m78 m78-cell", className)}
        style={style}
      >
        <div
          className={cls(
            "m78-cell_cont",
            wrap && "m78-flex-wrap",
            mainAlign && `m78-main-${mainAlign}`,
            crossAlign && `m78-cross-${crossAlign}`
          )}
          style={{ margin: getPadding(gutter, true) }}
        >
          {children}
        </div>
      </div>
    </context.Provider>
  );
}

function _Cell(props: CellColProps) {
  const {
    children,
    // exclude
    col: a,
    offset: b,
    move: c,
    order: d,
    flex: e,
    align: g,
    hidden: f,
    className: h,
    style: i,
    xs,
    sm,
    md,
    lg,
    xl,
    xxl,
    // exclude
    ...ppp
  } = props;

  // ignore lint
  dumpFn(a, b, c, d, e, f, g, h, i, f, xs, sm, md, xl, xxl, lg);

  const mq = _useMediaQuery();
  const mqMeta = mq.meta;

  const { gutter } = useContext(context);

  if (!mqMeta) return null;

  const current = _getCurrentMqProps(mqMeta, props);

  const { col, offset, move, order, flex, hidden, align, className, style } =
    current;

  return (
    <div
      {...ppp}
      className={cls(
        "m78 m78-cell_col",
        className,
        align && `m78-self-${align}`
      )}
      style={{
        ...style,
        width: getStyleValue(col),
        padding: getPadding(gutter),
        marginLeft: getStyleValue(offset),
        left: getStyleValue(move),
        order,
        flex,
        display: hidden ? "none" : undefined,
      }}
    >
      {children}
    </div>
  );
}

_Cells.displayName = "Cells";
_Cell.displayName = "Cell";

export { _Cells, _Cell };
