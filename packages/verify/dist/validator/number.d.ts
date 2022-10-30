import { Validator } from "../types";
interface Opt {
    max?: number;
    min?: number;
    size?: number;
    /** 只能是整形 */
    integer?: boolean;
    /** 允许字符数字 */
    allowNumberString?: boolean;
}
export declare const numberValidatorKey = "verifyNumber";
/**
 * 数字验证器
 * */
export declare const number: (option?: Opt) => Validator;
export {};
//# sourceMappingURL=number.d.ts.map