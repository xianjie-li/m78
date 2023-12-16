import { FormValidator } from "../types.js";
export declare const requiredValidatorKey = "VerifyRequired";
/**
 * 是否是verify认定的空值
 * */
export declare const isVerifyEmpty: (value: any) => boolean;
/**
 * 必需项，值不能为 undefined, null ,'', NaN, [], {}, 空白字符 中的任意一项
 * */
export declare const required: () => FormValidator;
//# sourceMappingURL=required.d.ts.map