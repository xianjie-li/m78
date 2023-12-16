import { FormValidator } from "../types.js";
interface Opt {
    max?: number;
    min?: number;
    length?: number;
}
export declare const stringValidatorKey = "VerifyString";
/**
 * string验证器
 * */
export declare const string: (option?: Opt) => FormValidator;
export {};
//# sourceMappingURL=string.d.ts.map