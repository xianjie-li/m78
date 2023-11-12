import React from "react";
import { Row, Tile } from "../layout/index.js";
import { IconRight } from "@m78/icons/right.js";
import classNames from "clsx";
import { LayProps, LayStyle } from "./types.js";
import { statusIconMap } from "../common/index.js";

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
  let leading = ppp.leading;

  if (leading === undefined) {
    const StatusIcon = statusIconMap[status!];

    if (StatusIcon) {
      leading = <StatusIcon />;
    }
  }

  return (
    <Tile
      {...ppp}
      leading={leading}
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
            {arrow && <IconRight className="m78-lay_arrow" />}
          </Row>
        )
      }
      crossAlign={crossAlign}
    />
  );
}

_Lay.displayName = "Lay";

export { _Lay };
