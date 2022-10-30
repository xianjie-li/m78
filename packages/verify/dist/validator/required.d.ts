import { Validator } from "../types";
export declare const requiredValidatorKey = "verifyRequired";
/**
 * 是否是verify认定的空值
 * */
export declare const isVerifyEmpty: (value: any) => boolean;
/**
 * 必需项，值不能为 undefined, null ,'', NaN, [], {}, 空白字符 中的任意一项
 * */
export declare const required: () => Validator;
//# sourceMappingURL=required.d.ts.map