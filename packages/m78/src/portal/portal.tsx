import React, { useMemo } from "react";
import ReactDom from "react-dom";

import { getPortalsNode } from "@m78/utils";

const testEnv = process.env.NODE_ENV === "test";

export const _Portal = ({
  children,
  namespace,
}: {
  namespace?: string;
  children?: React.ReactNode;
}) => {
  const dom = useMemo(() => {
    return getPortalsNode(namespace, {
      className: "m78-root m78",
    });
  }, [namespace]);

  if (testEnv) return children as React.ReactElement;

  return ReactDom.createPortal(children, dom) as React.ReactElement;
};

_Portal.displayName = "Portal";
