import React from "react";
import {
  AspectRatio,
  Cell,
  Cells,
  MediaQuery,
  MediaQueryContext,
} from "../../src/layout";

import css from "./style.module.scss";

const LayoutExample = () => {
  return (
    <div>
      <div
        style={{ position: "relative", maxWidth: 600, border: "1px solid red" }}
      >
        <MediaQueryContext>
          <MediaQuery>
            {(meta, value) => {
              return (
                <div>
                  {/* @ts-ignore */}
                  <div>当前值: {value || "-"} | 窗口信息:</div>
                  <pre>{JSON.stringify(meta, null, 4)}</pre>
                  {meta && (
                    <div>
                      <div>isXS: {meta.isXS().toString()}</div>
                      <div>isSM: {meta.isSM().toString()}</div>
                      <div>isMD: {meta.isMD().toString()}</div>
                      <div>isLG: {meta.isLG().toString()}</div>
                      <div>isXL: {meta.isXL().toString()}</div>
                      <div>isXXL: {meta.isXXL().toString()}</div>
                      <div>isSmall: {meta.isSmall().toString()}</div>
                      <div>isMedium: {meta.isMedium().toString()}</div>
                      <div>isLarge: {meta.isLarge().toString()}</div>
                    </div>
                  )}
                </div>
              );
            }}
          </MediaQuery>
        </MediaQueryContext>

        <Cells gutter={[24, 40]}>
          <Cell col={4}>
            <div className={css.box}>4</div>
          </Cell>
          <Cell col={4}>
            <div className={css.box}>4</div>
          </Cell>
          <Cell col={4}>
            <div className={css.box}>4</div>
          </Cell>
          <Cell col={8}>
            <div className={css.box}>8</div>
          </Cell>
          <Cell col={4}>
            <div className={css.box}>4</div>
          </Cell>
          <Cell flex="1">
            <div className={css.box}>flex1</div>
          </Cell>
        </Cells>
      </div>

      <Cells className={css.grid}>
        <Cell md={4} xs={3}>
          <AspectRatio className={css.gridItem}>一</AspectRatio>
        </Cell>
        <Cell md={4} xs={3}>
          <AspectRatio className={css.gridItem}>二</AspectRatio>
        </Cell>
        <Cell md={4} xs={3}>
          <AspectRatio className={css.gridItem}>三</AspectRatio>
        </Cell>
        <Cell md={4} xs={3}>
          <AspectRatio className={css.gridItem}>四</AspectRatio>
        </Cell>
        <Cell md={4} xs={3}>
          <AspectRatio className={css.gridItem}>五</AspectRatio>
        </Cell>
        <Cell md={4} xs={3}>
          <AspectRatio className={css.gridItem}>六</AspectRatio>
        </Cell>
        <Cell md={4} xs={3}>
          <AspectRatio className={css.gridItem}>七</AspectRatio>
        </Cell>
      </Cells>
    </div>
  );
};

export default LayoutExample;
