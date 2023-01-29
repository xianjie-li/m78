import {
  SelectManager,
  SelectManagerOption,
  SelectManagerValue,
} from "./select-manager.js";
import { useEffect, useMemo } from "react";
import { useUpdate } from "../../effect/use-update/use-update.js";
import { useUpdateEffect } from "../../effect/use-update-effect/use-update-effect.js";
import { isArray } from "@m78/utils";

/**
 * 用于列表的选中项管理, 内置了对于超大数据量的优化(用于m78组件的tree等组件高性能管理选中/展开等)
 * - 具体api见SelectManager
 * - 注意, 由于会实时读取list并更新选中状态, option.list不能传入字面量, 否则会导致递归渲染
 * */
export function useSelect<Item = SelectManagerValue>(
  option?: SelectManagerOption<Item>
) {
  const list = option?.list;

  const select = useMemo(
    () =>
      new SelectManager<Item>({
        ...option,
        list: list || [],
      }),
    []
  );

  const update = useUpdate();

  useEffect(() => {
    select.changeEvent.on(update);

    return () => select.changeEvent.off(update);
  }, []);

  useUpdateEffect(() => {
    isArray(list) && select.setList(list);
  }, [list]);

  return select;
}
