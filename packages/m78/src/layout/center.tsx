import React from "react";
import cls from "clsx";
import { ComponentBasePropsWithAny } from "../common";

interface CenterProps extends ComponentBasePropsWithAny {
  /** false | 挂载到父节点上, 为true时，将尺寸固定到与父元素一致(需要保证父元素position不是static), 为false时，需要通过className或style执行设置尺寸 */
  attach?: boolean;
  /** 需要居中的单个子元素 */
  children?: React.ReactElement | string;
}

export const _Center = ({
  children,
  attach,
  className,
  style,
  ...props
}: CenterProps) => {
  return (
    <div
      {...props}
      className={cls("m78 m78-center", className, style)}
      style={{ position: attach ? "absolute" : undefined, ...style }}
    >
      {children}
    </div>
  );
};

_Center.displayName = "Center";
