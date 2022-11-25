import React from "react";
import cls from "clsx";
import { ComponentBasePropsWithAny } from "../common";

interface AspectRatioProps extends ComponentBasePropsWithAny {
  /** 1 | 网格项的宽高比 */
  ratio?: number;
  /** 内容 */
  children?: React.ReactNode;
}

export const _AspectRatio = ({
  ratio = 1,
  children,
  className,
  style,
  ...props
}: AspectRatioProps) => {
  return (
    <div
      {...props}
      className={cls("m78 m78-aspect-ratio", className)}
      style={style}
    >
      <div
        className="m78-aspect-ratio_scaffold"
        style={{ paddingTop: `${ratio * 100}%` }}
      />
      {children}
    </div>
  );
};

_AspectRatio.displayName = "AspectRatio";
