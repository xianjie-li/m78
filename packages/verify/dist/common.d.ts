import { AsyncValidator, ErrorTemplateInterpolate, Schema, Validator } from "./types";
/** 根schema的默认name */
export declare const SOURCE_ROOT_NAME = "M78_VERIFY_ROOT_NAME";
/** 格式化并返回验证器数组 */
export declare function fmtValidator(validator: Schema["validator"], isEmpty: boolean): (Validator | AsyncValidator)[];
/** 是否为ErrorTemplateInterpolate对象 */
export declare function isErrorTemplateInterpolate(obj: any): obj is ErrorTemplateInterpolate;
//# sourceMappingURL=common.d.ts.map