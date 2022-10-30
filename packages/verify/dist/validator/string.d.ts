import { Validator } from "../types";
interface Opt {
    max?: number;
    min?: number;
    length?: number;
}
export declare const stringValidatorKey = "verifyString";
/**
 * string验证器
 * */
export declare const string: (option?: Opt) => Validator;
export {};
//# sourceMappingURL=string.d.ts.map