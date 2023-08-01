import { _RCTableContext, RCTableProps } from "./types.js";
import { createTable, TableConfig } from "../table-vanilla/index.js";
import { useEffect } from "react";
import { useDestroy } from "@m78/hooks";
import { _Methods } from "./methods.js";

export function _useLife(ctx: _RCTableContext, methods: _Methods) {
  const { self, state, ref, scrollRef, scrollContRef } = ctx;

  useEffect(init, []);

  useDestroy(destroy);

  /** 初始化 */
  function init() {
    methods.initEmptyNode();
  }

  /** 销毁 */
  function destroy() {
    state.instance.destroy();
  }

  return {};
}
