import { _FormContext, _FieldContext, FormFieldProps, FormListCustomRenderArgs, FormListProps, FormSchema, FormSchemaWithoutName } from "./types.js";
import { _UseFieldMethods } from "./use-field-methods.js";
export declare function _listImpl(ctx: _FormContext): void;
/** FormListCustomRenderArgs.render核心逻辑实现 */
export declare function _listRenderImpl(ctx: _FormContext, props: FormFieldProps): FormListCustomRenderArgs["render"];
/** 实现内置list布局 */
export declare function _listLayoutRenderImpl(ctx: _FormContext, filedCtx: _FieldContext, methods: _UseFieldMethods, schema: FormSchema | FormSchemaWithoutName | null): (args: FormListCustomRenderArgs, render: NonNullable<FormListProps["layoutRender"]>) => JSX.Element;
//# sourceMappingURL=list.d.ts.map