import { Cells, Cell, AspectRatio } from "m78/layout";
import React from "react";

import css from "./grid.module.scss";

const Grid = () => {
  return (
    <Cells className={css.grid}>
      <Cell md={12 / 5} sm={12 / 4} xs={12 / 3}>
        <AspectRatio className={css.gridItem}>一</AspectRatio>
      </Cell>
      <Cell md={12 / 5} sm={12 / 4} xs={12 / 3}>
        <AspectRatio className={css.gridItem}>二</AspectRatio>
      </Cell>
      <Cell md={12 / 5} sm={12 / 4} xs={12 / 3}>
        <AspectRatio className={css.gridItem}>三</AspectRatio>
      </Cell>
      <Cell md={12 / 5} sm={12 / 4} xs={12 / 3}>
        <AspectRatio className={css.gridItem}>四</AspectRatio>
      </Cell>
      <Cell md={12 / 5} sm={12 / 4} xs={12 / 3}>
        <AspectRatio className={css.gridItem}>五</AspectRatio>
      </Cell>
      <Cell md={12 / 5} sm={12 / 4} xs={12 / 3}>
        <AspectRatio className={css.gridItem}>六</AspectRatio>
      </Cell>
      <Cell md={12 / 5} sm={12 / 4} xs={12 / 3}>
        <AspectRatio className={css.gridItem}>七</AspectRatio>
      </Cell>
    </Cells>
  );
};

export default Grid;
