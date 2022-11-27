import React from "react";
// 导入原映射
import MDXComponents from "@theme-original/MDXComponents";
import Demo from "../components/demo/demo";

export default {
  // 复用默认的映射
  ...MDXComponents,
  demo: Demo,
};
