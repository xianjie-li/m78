import { SelectManager, SelectManagerOption } from "./select-manager";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { useFn } from "../../effect/useFn/useFn";
import { useUpdateEffect } from "../../effect/useUpdateEffect/useUpdateEffect";
import { useUpdate } from "../../effect/useUpdate/useUpdate";

export * from "./select-manager";

/**
 * 用于列表的选中项管理, 内置了对于超大数据量的优化
 * - 具体api见SelectManager
 * - 注意, 由于会实时读取list并更新选中状态, option.list不能传入字面量, 否则会导致递归渲染
 * */
export function useSelect(option: SelectManagerOption) {
  const select = useMemo(() => new SelectManager(option), []);

  const update = useUpdate();

  useEffect(() => {
    select.changeEvent.on(update);

    return () => select.changeEvent.off(update);
  }, []);

  useUpdateEffect(() => {
    select.setList(option.list);
  }, [option.list]);

  return select;
}
