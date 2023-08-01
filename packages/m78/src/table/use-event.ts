import { _RCTableContext } from "./types.js";
import { useFn } from "@m78/hooks";
import { useEffect } from "react";
import { TableCell, TableMutationEvent } from "../table-vanilla/index.js";
import { notify } from "../notify/index.js";

// 将部分table实例事件直接暴露为props, 并对某些事件进行处理
export function _useEvent(ctx: _RCTableContext) {
  const { state, setState, props } = ctx;

  const error = useFn((msg: string) => {
    props.onError?.(msg);

    notify.warning(msg);
  });

  const click = useFn((cell: TableCell, event: Event) => {
    props.onClick?.(cell, event);
  });

  const select = useFn(() => {
    props.onSelect?.();

    setState({
      selectedRows: state.instance.getSelectedRows(),
    });
  });

  const mutation = useFn((event: TableMutationEvent) => {
    props.onMutation?.(event);

    setState({
      renderID: Math.random(),
    });
  });

  useEffect(() => {
    if (!state.instance) return;

    state.instance.event.error.on(error);
    state.instance.event.click.on(click);
    state.instance.event.select.on(select);
    state.instance.event.mutation.on(mutation);

    return () => {
      state.instance.event.error.off(error);
      state.instance.event.click.off(click);
      state.instance.event.select.off(select);
      state.instance.event.mutation.off(mutation);
    };
  }, [state.instance]);
}
