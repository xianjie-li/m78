import { Cell, Cells } from "m78";
import React from "react";

import sty from "./style.module.scss";

const Sort = () => {
  return (
    <div>
      <div className="mt-24">offset</div>
      <Cells className={sty.layoutWrap} gutter={8}>
        <Cell col={5}>
          <div className={sty.box}>5</div>
        </Cell>
        <Cell col={5} offset={2}>
          <div className={sty.box}>5 / 2</div>
        </Cell>

        <Cell col={3}>
          <div className={sty.box}>3</div>
        </Cell>
        <Cell col={3} offset={1.5}>
          <div className={sty.box}>3 / 1.5</div>
        </Cell>
        <Cell col={3} offset={1.5}>
          <div className={sty.box}>3 / 1.5</div>
        </Cell>

        <Cell col={6} offset={3}>
          <div className={sty.box}>6 / 3</div>
        </Cell>
        <Cell col={2} offset={-2}>
          <div className={sty.box}>2 / -2</div>
        </Cell>
      </Cells>

      <div className="mt-24">move</div>
      <Cells className={sty.layoutWrap} gutter={8}>
        <Cell col={8} move={4}>
          <div className={sty.box}>8</div>
        </Cell>
        <Cell col={4} move={-8}>
          <div className={sty.box}>4</div>
        </Cell>
      </Cells>

      <div className="mt-24">order</div>
      <Cells className={sty.layoutWrap} gutter={8}>
        <Cell col={7}>
          <div className={sty.box}>7</div>
        </Cell>
        <Cell col={5} order={-1}>
          <div className={sty.box}>5</div>
        </Cell>
      </Cells>
    </div>
  );
};

export default Sort;
