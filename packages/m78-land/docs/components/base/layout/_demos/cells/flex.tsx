import React from "react";
import { Cells, Cell } from "m78/layout";
import sty from "./style.module.scss";

const Flex = () => {
  return (
    <div>
      <Cells
        className={sty.layoutWrap}
        gutter={8}
        mainAlign="center"
        crossAlign="end"
      >
        <Cell flex={1}>
          <div className={sty.box}>1</div>
        </Cell>
        <Cell flex={1}>
          <div className={sty.box}>1</div>
        </Cell>
        <Cell flex={2}>
          <div className={sty.box}>2</div>
        </Cell>
        <Cell flex={1}>
          <div className={sty.box}>1</div>
        </Cell>
      </Cells>

      <Cells
        className={sty.layoutWrap}
        gutter={8}
        mainAlign="center"
        crossAlign="end"
      >
        <Cell>
          <div className={sty.box} style={{ width: 150 }}>
            150px
          </div>
        </Cell>
        <Cell flex={1}>
          <div className={sty.box}>1</div>
        </Cell>
        <Cell>
          <div className={sty.box} style={{ width: 150 }}>
            150px
          </div>
        </Cell>
      </Cells>
    </div>
  );
};

export default Flex;
