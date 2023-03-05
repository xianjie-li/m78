import { _Context, _FieldContext } from "./types.js";
import { _UseFieldMethods } from "./use-field-methods.js";
import { isFunction, stringifyNamePath, triggerHighlight } from "@m78/utils";

export function _useFieldLifeCircle(
  ctx: _Context,
  fieldCtx: _FieldContext,
  methods: _UseFieldMethods
) {
  const { form } = ctx;

  const { name, setState, wrapRef } = fieldCtx;

  const { getProps } = methods;

  // 监听变更, 更新组件
  form.events.update.useEvent(
    form.notifyFilter(
      name,
      () => {
        setState({
          schema: form.getSchema(name),
          renderKey: Math.random(),
        });
      },
      getProps("deps")
    )
  );

  // 错误时, 高亮并 focus 第一个错误项对应的表单
  form.events.fail.useEvent((errors, isValueChangeTrigger) => {
    // 值变更导致的错误不触发高亮反馈
    if (isValueChangeTrigger) return;

    const first = errors[0];

    if (!first) return;
    const sName = stringifyNamePath(name);

    if (sName === first.name) {
      triggerHighlight(wrapRef.current);

      const inp: HTMLElement | null = wrapRef.current.querySelector(
        "input,select,textarea"
      );

      if (inp && isFunction(inp.focus)) inp.focus();
    }
  });
}
