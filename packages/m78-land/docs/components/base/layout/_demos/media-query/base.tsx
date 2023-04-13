import React from "react";
import { MediaQuery, MediaQueryContext, MediaQueryMeta } from "m78";
import sty from "./style.module.scss";

const Base = () => {
  function getSize(meta: MediaQueryMeta) {
    if (meta.isSmall()) return "小";
    if (meta.isMedium()) return "中";
    if (meta.isLarge()) return "大";
  }

  function render(meta: MediaQueryMeta) {
    return (
      <div>
        <div>{meta.type}</div>
        <div>{getSize(meta)}</div>
        <div className={sty.desc}>
          <span>xs: {meta.isXS().toString()}</span>
          <span>sm: {meta.isSM().toString()}</span>
          <span>md: {meta.isMD().toString()}</span>
          <span>lg: {meta.isLG().toString()}</span>
          <span>xl: {meta.isXL().toString()}</span>
          <span>xxl: {meta.isXXL().toString()}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={sty.box1}>
        <div className={sty.title}>响应窗口尺寸</div>
        <MediaQuery>{render}</MediaQuery>
      </div>

      <div className={sty.box1}>
        <div className={sty.title}>响应容器尺寸</div>
        <MediaQueryContext>
          <MediaQuery>{render}</MediaQuery>
        </MediaQueryContext>
      </div>
    </div>
  );
};

export default Base;
