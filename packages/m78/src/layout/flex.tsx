import React from "react";
import cls from "clsx";
import { FlexWrapProps, FlexProps } from "./types";

function getClasses(
  mainAlign?: FlexWrapProps["mainAlign"],
  crossAlign?: FlexWrapProps["crossAlign"]
) {
  const styObj: any = {};

  if (mainAlign) {
    styObj[`m78-main-${mainAlign}`] = true;
  }

  if (crossAlign) {
    styObj[`m78-cross-${crossAlign}`] = true;
  }

  return styObj;
}

const _Column = ({
  children,
  style,
  className,
  mainAlign,
  crossAlign,
  innerRef,
  ...ppp
}: FlexWrapProps) => {
  return (
    <div
      {...ppp}
      className={cls(
        "m78 m78-column",
        className,
        getClasses(mainAlign, crossAlign)
      )}
      style={style}
      ref={innerRef}
    >
      {children}
    </div>
  );
};

const _Row = ({
  children,
  style,
  className,
  mainAlign,
  crossAlign = "start",
  innerRef,
  ...ppp
}: FlexWrapProps) => {
  return (
    <div
      {...ppp}
      ref={innerRef}
      className={cls(
        "m78 m78-row",
        className,
        getClasses(mainAlign, crossAlign)
      )}
      style={style}
    >
      {children}
    </div>
  );
};

const _Flex = ({
  flex = 1,
  children,
  order,
  style,
  className,
  align,
  innerRef,
  ...ppp
}: FlexProps) => {
  return (
    <div
      {...ppp}
      ref={innerRef}
      className={cls("m78 m78-flex", className, align && `m78-self-${align}`)}
      style={{ flex, order, ...style }}
    >
      {children}
    </div>
  );
};

_Column.displayName = "Column";
_Row.displayName = "Row";
_Flex.displayName = "Flex";

export { _Column, _Row, _Flex };
