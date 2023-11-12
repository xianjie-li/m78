import React from "react";
import { ResultProps } from "./types.js";
import clsx from "clsx";

export const _Result = ({
  className,
  icon,
  title,
  desc,
  extra,
  actions,
  size,
  ...pp
}: ResultProps) => {
  return (
    <div
      {...pp}
      className={clsx("m78 m78-result", size && `__${size}`, className)}
    >
      {icon && <div className="m78-result_icon">{icon}</div>}
      {title && <div className="m78-result_title">{title}</div>}
      {desc && <div className="m78-result_desc">{desc}</div>}
      {extra && <div className="m78-result_extra">{extra}</div>}
      {actions && <div className="m78-result_actions">{actions}</div>}
    </div>
  );
};

_Result.displayName = "Result";
