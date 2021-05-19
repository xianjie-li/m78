import React from 'react';
import sty from './style.module.scss';
import { Grids, GridsItem } from 'm78/layout';

const Offset = () => {
  return (
    <div>
      <Grids className={sty.layoutWrap} gutter={8}>
        <GridsItem col={5}>
          <div className={sty.box}>5</div>
        </GridsItem>
        <GridsItem col={5} offset={2}>
          <div className={sty.box}>5 / 2</div>
        </GridsItem>

        <GridsItem col={3}>
          <div className={sty.box}>3</div>
        </GridsItem>
        <GridsItem col={3} offset={1.5}>
          <div className={sty.box}>3 / 1.5</div>
        </GridsItem>
        <GridsItem col={3} offset={1.5}>
          <div className={sty.box}>3 / 1.5</div>
        </GridsItem>

        <GridsItem col={6} offset={3}>
          <div className={sty.box}>6 / 3</div>
        </GridsItem>
        <GridsItem col={2} offset={-2}>
          <div className={sty.box}>2 / -2</div>
        </GridsItem>
      </Grids>
    </div>
  );
};

export default Offset;
