import { FormValidator } from "../types.js";
interface Opt {
    /** 最大长度 */
    max?: number;
    /** 最小长度 */
    min?: number;
    /** 指定长度 */
    length?: number;
}
export declare const arrayValidatorKey = "VerifyArray";
/**
 * 数组验证器
 * */
export declare const array: (option?: Opt) => FormValidator;
export {};
//# sourceMappingURL=array.d.ts.map