import React from 'react';
import { Grids, GridsItem } from 'm78/layout';
import sty from './style.module.scss';

const Base = () => {
  return (
    <div>
      <Grids className={sty.layoutWrap} gutter={8}>
        <GridsItem col={6}>
          <div className={sty.box}>6</div>
        </GridsItem>
        <GridsItem col={6}>
          <div className={sty.box}>6</div>
        </GridsItem>

        <GridsItem col={12}>
          <div className={sty.box}>12</div>
        </GridsItem>

        <GridsItem col={4}>
          <div className={sty.box}>4</div>
        </GridsItem>
        <GridsItem col={4}>
          <div className={sty.box}>4</div>
        </GridsItem>
        <GridsItem col={4}>
          <div className={sty.box}>4</div>
        </GridsItem>

        <GridsItem col={2.4}>
          <div className={sty.box}>2.4</div>
        </GridsItem>
        <GridsItem col={2.4}>
          <div className={sty.box}>2.4</div>
        </GridsItem>
        <GridsItem col={2.4}>
          <div className={sty.box}>2.4</div>
        </GridsItem>
        <GridsItem col={2.4}>
          <div className={sty.box}>2.4</div>
        </GridsItem>
        <GridsItem col={2.4}>
          <div className={sty.box}>2.4</div>
        </GridsItem>

        <GridsItem col={3}>
          <div className={sty.box}>3</div>
        </GridsItem>
        <GridsItem col={3}>
          <div className={sty.box}>3</div>
        </GridsItem>
        <GridsItem col={3}>
          <div className={sty.box}>3</div>
        </GridsItem>
        <GridsItem col={3}>
          <div className={sty.box}>3</div>
        </GridsItem>
      </Grids>
    </div>
  );
};

export default Base;
