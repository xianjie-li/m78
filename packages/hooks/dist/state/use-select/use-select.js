import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
import { SelectManager } from "./select-manager.js";
import { useEffect, useMemo } from "react";
import { useUpdate } from "../../effect/use-update/use-update.js";
import { useUpdateEffect } from "../../effect/use-update-effect/use-update-effect.js";
import { isArray } from "@m78/utils";
import { useFn } from "../../effect/use-fn/use-fn.js";
/**
 * 用于列表的选中项管理, 内置了对于超大数据量的优化(用于m78组件的tree等组件高性能管理选中/展开等)
 * - 具体api见SelectManager
 * - 注意, 由于会实时读取list并更新选中状态, option.list不能传入字面量, 否则会导致递归渲染
 * */ export function useSelect(option) {
    var _ref = option || {}, _autoUpdate = _ref.autoUpdate, autoUpdate = _autoUpdate === void 0 ? true : _autoUpdate, onChange = _ref.onChange, opts = _object_without_properties(_ref, [
        "autoUpdate",
        "onChange"
    ]);
    var list = option === null || option === void 0 ? void 0 : option.list;
    var select = useMemo(function() {
        return new SelectManager(_object_spread_props(_object_spread({}, opts), {
            list: list || []
        }));
    }, []);
    var update = useUpdate();
    var change = useFn(function() {
        onChange === null || onChange === void 0 ? void 0 : onChange(select);
        if (autoUpdate) update();
    });
    useEffect(function() {
        select.changeEvent.on(change);
        return function() {
            return select.changeEvent.off(change);
        };
    }, [
        autoUpdate
    ]);
    useUpdateEffect(function() {
        isArray(list) && select.setList(list);
    }, [
        list
    ]);
    return select;
}
