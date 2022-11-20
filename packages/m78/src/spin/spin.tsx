import React from "react";
import cls from "clsx";

import { useDelayToggle } from "@m78/hooks";
import { Transition } from "../transition";

import { SpinProps } from "./types";
import { SpinIcon } from "./spin-icon";

export const Spin: React.FC<SpinProps> = ({
  size,
  inline,
  text = "",
  full,
  open = true,
  className,
  minDuration = 300,
  offset,
  ...props
}) => {
  const innerShow = useDelayToggle(open, minDuration);

  return (
    <Transition
      {...props}
      open={innerShow}
      type="fade"
      mountOnEnter
      unmountOnExit
      className={cls(className, "m78 m78-spin", {
        [`__${size}`]: !!size,
        __inline: inline,
        __full: full,
      })}
    >
      <div className="m78-spin_inner" style={{ top: offset }}>
        <SpinIcon className="m78-spin_unit" />
        {text && (
          <span className="m78-spin_text">
            {text}
            <span className="m78-spin_ellipsis" />
          </span>
        )}
      </div>
    </Transition>
  );
};
