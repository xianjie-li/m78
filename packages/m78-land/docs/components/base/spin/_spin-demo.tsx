import React from "react";
import { Spin } from "m78/spin";
import { FullSize } from "m78/common";

const IconDemo = () => (
  <div>
    <Spin size={FullSize.small} />
    <Spin className="ml-12" />
    <Spin size={FullSize.large} className="ml-12" />
    <Spin size={FullSize.big} className="ml-12" />
    <Spin size={FullSize.small} text="加载中" />

    <div className="mt-12">
      <Spin size={FullSize.small} inline text="加载中" />
      <Spin size={FullSize.small} inline text="自定义文本" className="ml-12" />
    </div>
  </div>
);

export default IconDemo;
