import React from 'react';
import { Grids, GridsItem } from 'm78/layout';
import sty from './style.module.scss';

const Order = () => {
  return (
    <div>
      <Grids className={sty.layoutWrap} gutter={8}>
        <GridsItem col={8} move={4}>
          <div className={sty.box}>8</div>
        </GridsItem>
        <GridsItem col={4} move={-8}>
          <div className={sty.box}>4</div>
        </GridsItem>
      </Grids>

      <Grids className={sty.layoutWrap} gutter={8}>
        <GridsItem col={7}>
          <div className={sty.box}>7</div>
        </GridsItem>
        <GridsItem col={5} order={-1}>
          <div className={sty.box}>5</div>
        </GridsItem>
      </Grids>
    </div>
  );
};

export default Order;
