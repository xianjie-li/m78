import { createRoot } from "react-dom/client";
import React from "react";

/**
 * 简单的挂载一个组件
 * */
export function render(ele: React.ReactElement) {
  const root = createRoot(document.getElementById("root")!);
  root.render(ele);
}
