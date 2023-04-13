import React from "react";
import { Cell, Cells } from "m78";
import sty from "./style.module.scss";

const Base = () => {
  return (
    <div>
      <Cells className={sty.layoutWrap} gutter={8}>
        <Cell col={6}>
          <div className={sty.box}>6</div>
        </Cell>
        <Cell col={6}>
          <div className={sty.box}>6</div>
        </Cell>

        <Cell col={12}>
          <div className={sty.box}>12</div>
        </Cell>

        <Cell col={4}>
          <div className={sty.box}>4</div>
        </Cell>
        <Cell col={4}>
          <div className={sty.box}>4</div>
        </Cell>
        <Cell col={4}>
          <div className={sty.box}>4</div>
        </Cell>

        <Cell col={2.4}>
          <div className={sty.box}>2.4</div>
        </Cell>
        <Cell col={2.4}>
          <div className={sty.box}>2.4</div>
        </Cell>
        <Cell col={2.4}>
          <div className={sty.box}>2.4</div>
        </Cell>
        <Cell col={2.4}>
          <div className={sty.box}>2.4</div>
        </Cell>
        <Cell col={2.4}>
          <div className={sty.box}>2.4</div>
        </Cell>

        <Cell col={3}>
          <div className={sty.box}>3</div>
        </Cell>
        <Cell col={3}>
          <div className={sty.box}>3</div>
        </Cell>
        <Cell col={3}>
          <div className={sty.box}>3</div>
        </Cell>
        <Cell col={3}>
          <div className={sty.box}>3</div>
        </Cell>
      </Cells>
    </div>
  );
};

export default Base;
