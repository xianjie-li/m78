import React from "react";
import { ComponentBaseProps } from "../common/index.js";
import { Column, Row } from "./index.js";
import clsx from "clsx";

interface DividerProps extends ComponentBaseProps {
  /** false | 是否为垂直分割线 */
  vertical?: boolean;
  /** 分割线厚度 */
  size?: number;
  /** 颜色 */
  color?: string;
  /** 12 | 间距 */
  margin?: number;
  /** 放置于分割线内的文本 */
  children?: React.ReactNode;
  /** 传入children时, 控制其对齐位置 */
  align?: "start" | "center" | "end";
}

export const _Divider = ({
  vertical,
  color,
  margin = 12,
  children,
  style,
  className,
  align,
  size,
}: DividerProps) => {
  const marginStr = vertical ? `0 ${margin}px` : `${margin}px 0`;

  const styleBaseObj: React.CSSProperties = {
    backgroundColor: color,
    margin: marginStr,
    color,
  };

  function renderLine(styleObj?: React.CSSProperties, cls?: string) {
    return (
      <div
        className={clsx("m78 m78-divider", vertical && "__vertical", cls)}
        style={styleObj}
      />
    );
  }

  if (!children) {
    return renderLine(
      {
        ...styleBaseObj,
        ...style,
        [vertical ? "width" : "height"]: size,
      },
      className
    );
  }

  // 带内容的分割线, 平分内容区域

  if (vertical) {
    return (
      <Column
        className={clsx("m78-divider_column", align && `__${align}`, className)}
        style={style}
        crossAlign="center"
      >
        {renderLine(styleBaseObj)}
        <span className="m78-divider_node">{children}</span>
        {renderLine(styleBaseObj)}
      </Column>
    );
  }

  return (
    <Row
      className={clsx("m78-divider_row", align && `__${align}`, className)}
      style={style}
      crossAlign="center"
    >
      {renderLine(styleBaseObj)}
      <span className="m78-divider_node">{children}</span>
      {renderLine(styleBaseObj)}
    </Row>
  );
};

_Divider.displayName = "Divider";
