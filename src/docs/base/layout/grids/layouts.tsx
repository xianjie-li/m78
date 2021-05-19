import React from 'react';
import { Grids, GridsItem } from 'm78/layout';
import sty from './style.module.scss';

const Layouts = () => {
  return (
    <div>
      <Grids className={sty.layoutWrap} gutter={8} mainAlign="between">
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
      </Grids>

      <Grids className={sty.layoutWrap} gutter={8} mainAlign="evenly">
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
      </Grids>

      <Grids className={sty.layoutWrap} gutter={8} mainAlign="around">
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
      </Grids>

      <Grids className={sty.layoutWrap} gutter={8} mainAlign="center">
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
      </Grids>

      <Grids className={sty.layoutWrap} gutter={8} mainAlign="start">
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
      </Grids>

      <Grids className={sty.layoutWrap} gutter={8} mainAlign="end">
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
      </Grids>

      <Grids
        className={sty.layoutWrap}
        style={{ height: 120 }}
        gutter={8}
        mainAlign="center"
        crossAlign="start"
      >
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
      </Grids>
      <Grids
        className={sty.layoutWrap}
        style={{ height: 120 }}
        gutter={8}
        mainAlign="center"
        crossAlign="center"
      >
        <GridsItem col={2} align="end">
          <div className={sty.box}>end</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2} align="start">
          <div className={sty.box}>start</div>
        </GridsItem>
      </Grids>
      <Grids
        className={sty.layoutWrap}
        style={{ height: 120 }}
        gutter={8}
        mainAlign="center"
        crossAlign="end"
      >
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
        <GridsItem col={2}>
          <div className={sty.box}>2</div>
        </GridsItem>
      </Grids>
    </div>
  );
};

export default Layouts;
