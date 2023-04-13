import React from "react";
import { Cells, Cell } from "m78";
import sty from "./style.module.scss";

const Layouts = () => {
  return (
    <div>
      <h4>主轴</h4>
      <div className="mb-8 mt-24">between</div>
      <Cells className={sty.layoutWrapBorder} gutter={8} mainAlign="between">
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
      </Cells>

      <div className="mb-8 mt-24">evenly</div>
      <Cells className={sty.layoutWrapBorder} gutter={8} mainAlign="evenly">
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
      </Cells>

      <div className="mb-8 mt-24">around</div>
      <Cells className={sty.layoutWrapBorder} gutter={8} mainAlign="around">
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
      </Cells>

      <div className="mb-8 mt-24">center</div>
      <Cells className={sty.layoutWrapBorder} gutter={8} mainAlign="center">
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
      </Cells>

      <div className="mb-8 mt-24">start</div>
      <Cells className={sty.layoutWrapBorder} gutter={8} mainAlign="start">
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
      </Cells>

      <div className="mb-8 mt-24">end</div>
      <Cells className={sty.layoutWrapBorder} gutter={8} mainAlign="end">
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
      </Cells>

      <h4 className="mt-32">交叉轴</h4>
      <div className="mb-8 mt-24">start</div>
      <Cells
        className={sty.layoutWrapBorder}
        style={{ height: 120 }}
        gutter={8}
        mainAlign="center"
        crossAlign="start"
      >
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
      </Cells>

      <div className="mb-8 mt-24">每一个cell都可以单独设置align</div>
      <Cells
        className={sty.layoutWrapBorder}
        style={{ height: 120 }}
        gutter={8}
        mainAlign="center"
        crossAlign="center"
      >
        <Cell col={2} align="end">
          <div className={sty.box} />
        </Cell>
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
        <Cell col={2} align="start">
          <div className={sty.box} />
        </Cell>
      </Cells>

      <div className="mb-8 mt-24">end</div>
      <Cells
        className={sty.layoutWrapBorder}
        style={{ height: 120 }}
        gutter={8}
        mainAlign="center"
        crossAlign="end"
      >
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
        <Cell col={2}>
          <div className={sty.box} />
        </Cell>
      </Cells>
    </div>
  );
};

export default Layouts;
