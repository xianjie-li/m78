import React from 'react';
import { Grids, GridsItem } from 'm78/layout';
import sty from './style.module.scss';

const MediaQuery = () => {
  return (
    <div>
      <Grids className={sty.layoutWrap} gutter={8} mainAlign="center" crossAlign="end">
        <GridsItem xs={12} md={6} xl={4}>
          <div className={sty.box}>xs:12 md:6 xl:4</div>
        </GridsItem>
        <GridsItem xs={12} md={6} xl={4}>
          <div className={sty.box}>xs:12 md:6 xl:4</div>
        </GridsItem>
        <GridsItem xs={12} md={12} xl={4}>
          <div className={sty.box}>xs:12 md:12 xl:4</div>
        </GridsItem>
      </Grids>

      <div className="color-second mt-24">
        GridsItem的布局属性几乎都支持响应式设置，可以通过传入一个配置对象来设置他们!
        目前支持的属性为`col` `offset` `move` `order` `flex` `hidden` `align` `className` `style`
      </div>
      <Grids className={sty.layoutWrap} gutter={8}>
        <GridsItem
          xs={{ hidden: true }}
          sm={{ col: 12, className: 'border' }}
          md={{ col: 6, style: { backgroundColor: 'pink', height: 120 } }}
          xl={{ col: 4, offset: 2 }}
        >
          <div className={sty.box}>xs:hidden sm:12 md:6 xl:4:offset2</div>
        </GridsItem>
        <GridsItem xs={12} md={6} xl={4}>
          <div className={sty.box}>xs:12 md:6 xl:4</div>
        </GridsItem>
      </Grids>
    </div>
  );
};

export default MediaQuery;
