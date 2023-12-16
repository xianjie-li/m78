import { NamePath } from "@m78/utils";
import { FormErrorTemplateInterpolate, FormSchema, FormSchemaWithoutName, FormValidator } from "../types.js";
/** 去除无效项, 并处理empty后返回验证器数组 */
export declare function _fmtValidator(validator: FormSchema["validator"], isEmpty: boolean): FormValidator[];
/** 是否为ErrorTemplateInterpolate对象 */
export declare function _isErrorTemplateInterpolate(obj: any): obj is FormErrorTemplateInterpolate;
/** 根据schema配置和传入值检测是否有schema配置之外的值存在, 返回额外值的key字符串数组 */
export declare function _getExtraKeys(name: NamePath, schema: FormSchema | FormSchemaWithoutName, value: any): string[];
//# sourceMappingURL=common.d.ts.map