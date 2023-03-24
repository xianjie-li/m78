import { _Context, _FieldContext, FormFieldProps, FormListCustomRenderArgs, FormListProps, FormSchema, FormSchemaWithoutName } from "./types.js";
import { _UseFieldMethods } from "./use-field-methods.js";
export declare function _listImpl(ctx: _Context): void;
/** FormListCustomRenderArgs.render核心逻辑实现 */
export declare function _listRenderImpl(ctx: _Context, props: FormFieldProps): FormListCustomRenderArgs["render"];
/** 实现内置list布局 */
export declare function _listLayoutRenderImpl(ctx: _Context, filedCtx: _FieldContext, methods: _UseFieldMethods, schema: FormSchema | FormSchemaWithoutName | null): (args: FormListCustomRenderArgs, render: NonNullable<FormListProps["layoutRender"]>) => JSX.Element;
//# sourceMappingURL=list.d.ts.map