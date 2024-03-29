import React, { useMemo } from "react";
import { _Row } from "./flex.js";
import cls from "clsx";
import { TileProps } from "./types.js";
import { isTruthyOrZero } from "@m78/utils";

const _Tile = ({
  className,
  title,
  desc,
  leading,
  trailing,
  crossAlign,
  innerRef,
  overflowVisible,
  children,
  foot,
  ...ppp
}: TileProps) => {
  const _title = useMemo(() => {
    if (isTruthyOrZero(title)) return title;
    return children;
  }, [title, children]);

  return (
    <_Row
      {...ppp}
      innerRef={innerRef}
      className={cls("m78-tile", className)}
      crossAlign={crossAlign}
    >
      {leading && <div className="m78-tile_leading">{leading}</div>}
      <div
        className="m78-tile_main"
        style={{ overflow: overflowVisible ? undefined : "hidden" }}
      >
        {_title && <div className="m78-tile_cont">{_title}</div>}
        {desc && <div className="m78-tile_desc">{desc}</div>}
      </div>
      {trailing && <div className="m78-tile_trailing">{trailing}</div>}
      {foot && <div className="m78-tile_foot">{foot}</div>}
    </_Row>
  );
};

_Tile.displayName = "Tile";

export { _Tile };
