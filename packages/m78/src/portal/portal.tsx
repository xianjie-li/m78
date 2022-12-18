import React, { useMemo } from "react";
import ReactDom from "react-dom";

import { getPortalsNode } from "@m78/utils";

export const _Portal: React.FC<{
  namespace?: string;
  children?: React.ReactNode;
}> = ({ children, namespace }) => {
  const dom = useMemo(() => {
    return getPortalsNode(namespace, {
      className: "m78-root m78",
    });
  }, [namespace]);
  return ReactDom.createPortal(children, dom);
};

_Portal.displayName = "Portal";
