import { SelectManager, SelectManagerOption, isArray } from "@m78/utils";
import { useEffect, useMemo } from "react";
import { useUpdate } from "../../effect/use-update/use-update.js";
import { useUpdateEffect } from "../../effect/use-update-effect/use-update-effect.js";
import { useFn } from "../../effect/use-fn/use-fn.js";

export interface UseSelectOption<Item = any, Opt = any>
  extends Partial<SelectManagerOption<Item, Opt>> {
  /** true | 选中状态变更时, 自动重绘 */
  autoUpdate?: boolean;
  /** 选中状态变更时触发 */
  onChange?: (select: SelectManager<Item, Opt>) => void;
}

/**
 * 用于列表的选中项管理, 内置了对于超大数据量的优化(用于m78组件的tree等组件高性能管理选中/展开等)
 * - 具体api见SelectManager
 * - 注意, 由于会实时读取list并更新选中状态, option.list不能传入字面量, 否则会导致递归渲染
 * */
export function useSelect<Item = any, Opt = any>(
  option?: UseSelectOption<Item, Opt>
) {
  const { autoUpdate = true, onChange, ...opts } = option || {};
  const list = option?.list;

  const select = useMemo(
    () =>
      new SelectManager<Item>({
        ...opts,
        list: list || [],
      }),
    []
  );

  const update = useUpdate();

  const change = useFn(() => {
    onChange?.(select);
    if (autoUpdate) update();
  });

  useEffect(() => {
    select.changeEvent.on(change);

    return () => select.changeEvent.off(change);
  }, [autoUpdate]);

  useUpdateEffect(() => {
    isArray(list) && select.setList(list);
  }, [list]);

  return select;
}
