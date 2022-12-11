import React from "react";
import ReactDom from "react-dom";

import { getPortalsNode } from "@m78/utils";

export const _Portal: React.FC<{
  namespace?: string;
  children?: React.ReactNode;
}> = ({ children, namespace }) =>
  ReactDom.createPortal(children, getPortalsNode(namespace));

_Portal.displayName = "Portal";
