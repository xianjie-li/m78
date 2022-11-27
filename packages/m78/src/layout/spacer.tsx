import React from "react";
import cls from "clsx";
import { isArray } from "@m78/utils";
import { ComponentBasePropsWithAny } from "../common/index.js";

interface SpacerProps extends ComponentBasePropsWithAny {
  /** 宽度 */
  width?: number;
  /** 16 | 高度,  */
  height?: number;
  /** 如果子项传入一个列表，会在每一个子项间设置间距 */
  children?: React.ReactElement[];
}

/** pad space */
const _Spacer = ({ width, height, children, ...props }: SpacerProps) => {
  let w: number | undefined;
  let h: number | undefined;

  if (width && !height) {
    w = width;
  }

  if (height && !width) {
    h = height;
  }

  if (!h && !w) {
    h = 16;
  }

  if (children && isArray(children)) {
    const child = children.reduce((prev, item, ind) => {
      prev.push(item);
      if (ind !== children.length - 1) {
        prev.push(
          <_Spacer key={ind + Math.random()} width={width} height={height} />
        );
      }
      return prev;
    }, [] as React.ReactElement[]);

    return child as any;
  }

  return (
    <div
      {...props}
      className={cls("m78 m78-spacer", !!w && "__inline")}
      style={{ width: w, height: h }}
    />
  );
};

_Spacer.displayName = "Spacer";

export { _Spacer };
