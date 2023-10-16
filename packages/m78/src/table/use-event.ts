import { useFn } from "@m78/hooks";
import { useEffect } from "react";
import {
  TableCell,
  TableMutationEvent,
  TableReloadLevel,
  TableReloadOptions,
} from "../table-vanilla/index.js";
import { notify } from "../notify/index.js";
import { _useStateAct } from "./state.act.js";
import { _injector } from "./table.js";
import { _getTableCtx } from "./common.js";

// 将部分table实例事件直接暴露为props, 并对某些事件进行处理
export function _useEvent() {
  const { state, setState } = _injector.useDeps(_useStateAct);
  const props = _injector.useProps();

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

  // 数据变更时, 重新计算行数等
  const dataChange = useFn(() => {
    setState({
      rowCount: _getTableCtx(state.instance)?.allRowKeys.length || 0,
    });
  });

  const mutation = useFn((event: TableMutationEvent) => {
    props.onMutation?.(event);

    setState({
      renderID: Math.random(),
    });
  });

  const reload = useFn((opt: TableReloadOptions) => {
    if (
      opt.level === TableReloadLevel.full ||
      opt.level === TableReloadLevel.index
    ) {
      dataChange();
    }
  });

  useEffect(() => {
    if (!state.instance) return;

    dataChange();

    state.instance.event.error.on(error);
    state.instance.event.click.on(click);
    state.instance.event.select.on(select);
    state.instance.event.mutation.on(mutation);
    state.instance.event.reload.on(reload);

    return () => {
      state.instance.event.error.off(error);
      state.instance.event.click.off(click);
      state.instance.event.select.off(select);
      state.instance.event.mutation.off(mutation);
      state.instance.event.reload.off(reload);
    };
  }, [state.instance]);
}
