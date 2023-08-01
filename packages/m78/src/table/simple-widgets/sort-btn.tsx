import React from "react";
import { TableSort, TableSortUnion } from "../types.js";
import clsx from "clsx";

const SortBtn = ({ sort }: { sort?: TableSortUnion }) => {
  return (
    <span className="m78-table_sort-icon">
      <span
        className={clsx(
          "m78-table_sort-icon_t",
          sort === TableSort.asc && "__active"
        )}
      />
      <span
        className={clsx(
          "m78-table_sort-icon_b",
          sort === TableSort.desc && "__active"
        )}
      />
    </span>
  );
};

export default SortBtn;
