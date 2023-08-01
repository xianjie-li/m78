import React, { useEffect } from "react";
import { _RCTableContext } from "../types.js";
import { useSetState } from "@m78/hooks";

export function _CountText({ ctx }: { ctx: _RCTableContext }) {
  const { state: ctxState } = ctx;

  const [state, setState] = useSetState({
    rows: 0,
    selected: 0,
  });

  useEffect(() => {
    if (!ctxState.instance) return;

    const selectHandle = () => {
      setState({
        selected: ctxState.instance.getSelectedRows().length,
      });
    };

    ctxState.instance.event.select.on(selectHandle);

    return () => {
      ctxState.instance.event.select.off(selectHandle);
    };
  }, [ctxState.instance]);

  return <div className="color-second fs-12">共500行 / 选中5行</div>;
}
