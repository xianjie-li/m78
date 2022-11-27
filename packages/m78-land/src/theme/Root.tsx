import React, { useEffect } from "react";
import "m78/common/init";
import { useColorMode } from "@docusaurus/theme-common";

// 默认实现，你可以自定义
export default function Root({ children }: any) {
  // 没有找到稳定向根节点添加类名的方法, 先用这种形式(不稳定)
  useEffect(() => {
    const root = document.getElementById("__docusaurus");

    if (root) {
      root.classList.add("m78-root");
      root.classList.add("m78");
    }
  }, []);

  return children;
}
