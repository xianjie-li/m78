import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { TableSort } from "../types.js";
import clsx from "clsx";
var SortBtn = function(param) {
    var sort = param.sort;
    return /*#__PURE__*/ _jsxs("span", {
        className: "m78-table_sort-icon",
        children: [
            /*#__PURE__*/ _jsx("span", {
                className: clsx("m78-table_sort-icon_t", sort === TableSort.asc && "__active")
            }),
            /*#__PURE__*/ _jsx("span", {
                className: clsx("m78-table_sort-icon_b", sort === TableSort.desc && "__active")
            })
        ]
    });
};
export default SortBtn;
