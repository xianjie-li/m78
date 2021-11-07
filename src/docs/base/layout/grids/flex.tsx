import React from 'react';
import { Grids, GridsItem } from 'm78/layout';
import sty from './style.module.scss';

const Flex = () => {
  return (
    <div>
      <Grids className={sty.layoutWrap} gutter={8} mainAlign="center" crossAlign="end">
        <GridsItem flex={1}>
          <div className={sty.box}>1</div>
        </GridsItem>
        <GridsItem flex={1}>
          <div className={sty.box}>1</div>
        </GridsItem>
        <GridsItem flex={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem flex={1}>
          <div className={sty.box}>1</div>
        </GridsItem>
      </Grids>

      <Grids className={sty.layoutWrap} gutter={8} mainAlign="center" crossAlign="end">
        <GridsItem>
          <div className={sty.box} style={{ width: 150 }}>
            150px
          </div>
        </GridsItem>
        <GridsItem flex={1}>
          <div className={sty.box}>1</div>
        </GridsItem>
        <GridsItem>
          <div className={sty.box} style={{ width: 150 }}>
            150px
          </div>
        </GridsItem>
      </Grids>
    </div>
  );
};

export default Flex;
