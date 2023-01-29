import React from "react";

import { IconInfo } from "@m78/icons/icon-info.js";
import { IconCheckCircle } from "@m78/icons/icon-check-circle.js";
import { IconError } from "@m78/icons/icon-error.js";
import { Status } from "../types/index.js";

export function StatusIconInfo() {
  return <IconInfo className="color" />;
}

export function StatusIconSuccess() {
  return <IconCheckCircle className="color-success" />;
}

export function StatusIconWarning() {
  return <IconError className="color-warning" />;
}

export function StatusIconError() {
  return <IconError className="color-error" />;
}

export const statusIconMap = {
  [Status.info]: <StatusIconInfo />,
  [Status.success]: <StatusIconSuccess />,
  [Status.warning]: <StatusIconWarning />,
  [Status.error]: <StatusIconError />,
};
