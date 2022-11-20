import React from "react";
import { Resource } from "i18next";

export interface M78SeedState {
  /** 黑暗模式 */
  darkMode?: boolean;
  /** 国际化 */
  i18n?: {
    /** 切换到指定语言(需要语言配置了对应的Resource) */
    lng?: string;
    /** 扩展国际化资源 */
    appendResource?: Resource;
  };
  /** empty组件特有配置 */
  empty: {
    /** 全局配置Empty组件的空状态图片 */
    emptyNode?: React.ReactElement;
  };
  picture: {
    /** Picture组件加载图片错误时的默认占位图 */
    errorImg?: string;
  };
}
