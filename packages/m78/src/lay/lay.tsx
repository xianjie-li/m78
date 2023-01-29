import React from "react";
import { Row, Tile } from "../layout/index.js";
import { IconKeyboardArrowRight } from "@m78/icons/icon-keyboard-arrow-right.js";
import classNames from "clsx";
import { LayProps, LayStyle } from "./types.js";

function _Lay({
  arrow,
  disabled,
  size,
  itemStyle = LayStyle.none,
  effect = true,
  active,
  trailing,
  crossAlign = "center",
  className,
  style,
  status,
  highlight,
  ...ppp
}: LayProps) {
  return (
    <Tile
      {...ppp}
      style={style}
      className={classNames(
        "m78-lay",
        className,
        disabled && "__disabled",
        effect && "__effect",
        size && `__${size}`,
        active && "__active",
        itemStyle && `__${itemStyle}`,
        status && `__status`, // 减少css选择器层级
        status && `__${status}`,
        highlight && `__highlight`
      )}
      trailing={
        (trailing || arrow) && (
          <Row crossAlign="center">
            {trailing}
            {arrow && <IconKeyboardArrowRight className="m78-lay_arrow" />}
          </Row>
        )
      }
      crossAlign={crossAlign}
    />
  );
}

_Lay.displayName = "Lay";

export { _Lay };
