import React from "react";

import { IconInfo } from "@m78/icons/info.js";
import { IconSuccess } from "@m78/icons/success.js";
import { IconCloseOne } from "@m78/icons/close-one.js";
import { IconAttention } from "@m78/icons/attention.js";
import { Status } from "../types/index.js";
import { IIconProps } from "@m78/icons/runtime";

export function StatusIconInfo(props: IIconProps) {
  return (
    <IconInfo
      fill={["#333", "var(--m78-color)"]}
      {...props}
      theme="multi-color"
    />
  );
}

export function StatusIconSuccess(props: IIconProps) {
  return (
    <IconSuccess
      fill={["#333", "var(--m78-color-success)"]}
      {...props}
      theme="multi-color"
    />
  );
}

export function StatusIconWarning(props: IIconProps) {
  return (
    <IconAttention
      fill={["#333", "var(--m78-color-warning)"]}
      {...props}
      theme="multi-color"
    />
  );
}

export function StatusIconError(props: IIconProps) {
  return (
    <IconCloseOne
      fill={["#333", "var(--m78-color-error)"]}
      {...props}
      theme="multi-color"
    />
  );
}

export const statusIconMap = {
  [Status.info]: StatusIconInfo,
  [Status.success]: StatusIconSuccess,
  [Status.warning]: StatusIconWarning,
  [Status.error]: StatusIconError,
};
