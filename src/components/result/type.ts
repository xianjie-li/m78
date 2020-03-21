import React from 'react';

export type ResultTypes =
  | 'success'
  | 'error'
  | 'warning'
  | 'waiting'
  | 'notFound'
  | 'serverError'
  | 'notAuth';

export interface ResultProps {
  /** true | 组件开关，任意falsy或truthy值 */
  show?: boolean;
  /** 'success' | 类型 */
  type?: ResultTypes;
  /** '操作成功' | 标题 */
  title?: string;
  /** 描述 */
  desc?: string;
  /** 子元素会作为说明区域显示 */
  children?: React.ReactNode;
  /** 操作区，一般会传递一组按钮或连接 */
  actions?: React.ReactNode;
  /** false | 浮动模式，脱离文档流全屏进行展示 */
  fixed?: boolean;
}
