import { useMemo } from "react";
import { createForm, FormLayoutType } from "../../../form/index.js";
import { Size } from "../../../common/index.js";
import { useFn } from "@m78/hooks";
import { _injector } from "../../table.js";
/** 根据props.filterForm / defaultFilter 等配置决定是否需要创建form实例, 并包含filter表单的通用逻辑 */ export function _useFilterFormAct() {
    var props = _injector.useProps();
    var form = useMemo(function() {
        var f;
        if (props.filterForm) {
            f = props.filterForm;
        } else {
            f = createForm({
                size: Size.small,
                layoutType: FormLayoutType.vertical,
                spacePadding: false,
                values: props.defaultFilter,
                schemas: {
                    schema: props.filterSchema
                }
            });
        }
        return f;
    }, []);
    var query = useFn(function() {
        var ref;
        if (!props.onFilter) return;
        (ref = props.onFilter) === null || ref === void 0 ? void 0 : ref.call(props, form.getValues());
    });
    form.events.submit.useEvent(function() {
        query();
    });
    form.events.reset.useEvent(function() {
        query();
    });
    return {
        form: form
    };
}
