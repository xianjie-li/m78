import { NamePath } from "@m78/utils";
import { AsyncValidator, ErrorTemplateInterpolate, Schema, SchemaWithoutName, Validator } from "./types.js";
/** 根schema的默认name */
export declare const SOURCE_ROOT_NAME = "M78_VERIFY_ROOT_NAME";
/** 格式化并返回验证器数组 */
export declare function fmtValidator(validator: Schema["validator"], isEmpty: boolean): (Validator | AsyncValidator)[];
/** 是否为ErrorTemplateInterpolate对象 */
export declare function isErrorTemplateInterpolate(obj: any): obj is ErrorTemplateInterpolate;
/** 根据schema配置和传入值检测是否有schema配置之外的值存在, 返回额外值的key字符串数组 */
export declare function getExtraKeys(name: NamePath, schema: Schema | SchemaWithoutName, value: any): string[];
//# sourceMappingURL=common.d.ts.map