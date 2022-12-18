import React from "react";
import clsx from "clsx";
import { ComponentBasePropsWithAny } from "../common/index.js";

interface Props extends ComponentBasePropsWithAny {
  width: number;
  height: number;
}

export const _Arrow = ({ width, height, children, ...props }: Props) => {
  // 提升清晰度
  const w = width;
  const h = height;

  const c1x = w * 0.32;
  const c1y = h * 0.92;

  const c2x = w * 0.4;
  const c2y = h * 0.8;

  return (
    <svg
      {...props}
      style={{
        ...props.style,
        width,
        height,
      }}
      className={clsx("m78-overlay_arrow", props.className)}
      version="1.1"
      baseProfile="full"
      width={w}
      height={h}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="m78-overlay_arrow-graphical"
        d={`M 0 ${h} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${w / 2} 0 C ${
          w - c2x
        } ${c2y}, ${w - c1x} ${c1y}, ${w} ${h}`}
      />
      {children}
    </svg>
  );
};
