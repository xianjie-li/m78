import React from "react";
import { Cells, Cell } from "m78";
import sty from "./style.module.scss";

const MediaQuery = () => {
  return (
    <div>
      <Cells
        className={sty.layoutWrap}
        gutter={8}
        mainAlign="center"
        crossAlign="end"
      >
        <Cell xs={12} md={6} xl={4}>
          <div className={sty.box}>xs:12 md:6 xl:4</div>
        </Cell>
        <Cell xs={12} md={6} xl={4}>
          <div className={sty.box}>xs:12 md:6 xl:4</div>
        </Cell>
        <Cell xs={12} md={12} xl={4}>
          <div className={sty.box}>xs:12 md:12 xl:4</div>
        </Cell>
      </Cells>

      <div className="color-second mt-24 mb-12">
        Cell的布局属性几乎都支持响应式设置，可以通过传入一个配置对象来设置他们!
        目前支持的属性为`col` `offset` `move` `order` `flex` `hidden` `align`
        `className` `style`
      </div>
      <Cells className={sty.layoutWrap} gutter={8}>
        <Cell
          xs={{ hidden: true }}
          sm={{ col: 12, className: "border" }}
          md={{ col: 6, style: { backgroundColor: "pink", height: 120 } }}
          xl={{ col: 4, offset: 2 }}
        >
          <div className={sty.box}>
            <div>
              <div>xs:hidden sm:12 md:6 xl:4:offset2 </div>
              <div>小屏下无粉色背景</div>
            </div>
          </div>
        </Cell>
        <Cell xs={12} md={6} xl={4}>
          <div className={sty.box}>xs:12 md:6 xl:4</div>
        </Cell>
      </Cells>
    </div>
  );
};

export default MediaQuery;
