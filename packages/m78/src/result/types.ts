import { ComponentBasePropsWithAny, SizeUnion } from "../common/index.js";
import React from "react";

export interface ResultProps extends ComponentBasePropsWithAny {
  /** 尺寸 */
  size?: SizeUnion;
  /** 状态图标 */
  icon?: React.ReactNode;
  /** 标题内容 */
  title?: React.ReactNode;
  /** 明细文本 */
  desc?: React.ReactNode;
  /** 额外内容 */
  extra?: React.ReactNode;
  /** 操作区，一般会传递一组按钮或连接 */
  actions?: React.ReactNode;
}
