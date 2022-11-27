import { SelectManager } from "./select-manager.js";
import { useEffect, useMemo } from "react";
import { useUpdate } from "../../effect/use-update/use-update.js";
import { useUpdateEffect } from "../../effect/use-update-effect/use-update-effect.js";
/**
 * 用于列表的选中项管理, 内置了对于超大数据量的优化(用于m78组件的tree等组件高性能管理选中/展开等)
 * - 具体api见SelectManager
 * - 注意, 由于会实时读取list并更新选中状态, option.list不能传入字面量, 否则会导致递归渲染
 * */ export function useSelect(option) {
    var select = useMemo(function() {
        return new SelectManager(option);
    }, []);
    var update = useUpdate();
    useEffect(function() {
        select.changeEvent.on(update);
        return function() {
            return select.changeEvent.off(update);
        };
    }, []);
    useUpdateEffect(function() {
        select.setList(option.list);
    }, [
        option.list
    ]);
    return select;
}
