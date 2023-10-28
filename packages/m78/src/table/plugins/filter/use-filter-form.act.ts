import { RCTableProps } from "../../types.js";
import { useMemo } from "react";
import {
  createForm,
  FormInstance,
  FormLayoutType,
} from "../../../form/index.js";
import { Size } from "../../../common/index.js";
import { useFn } from "@m78/hooks";
import { _injector } from "../../table.js";

/** 根据props.filterForm / defaultFilter 等配置决定是否需要创建form实例, 并包含filter表单的通用逻辑 */
export function _useFilterFormAct() {
  const props = _injector.useProps();

  const form = useMemo(() => {
    let f: FormInstance;

    if (props.filterForm) {
      f = props.filterForm;
    } else {
      f = createForm({
        size: Size.small,
        layoutType: FormLayoutType.vertical,
        spacePadding: false,
        defaultValue: props.defaultFilter,
        schemas: {
          schema: props.filterSchema,
        },
      });
    }

    return f;
  }, []);

  const query = useFn(() => {
    if (!props.onFilter) return;
    props.onFilter?.(form.getValues());
  });

  form.events.submit.useEvent(() => {
    query();
  });

  form.events.reset.useEvent(() => {
    query();
  });

  return { form };
}
