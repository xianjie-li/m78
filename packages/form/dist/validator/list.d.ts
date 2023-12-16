import { FormValidator } from "../types.js";
export declare enum ListValidatorType {
    contain = "contain",
    equal = "equal"
}
interface ListValidatorOpt {
    /** 两个列表的覆盖类型, contain - 包含  equal - 完全相等  */
    type: ListValidatorType;
    /** 如果项是对象等特殊类型, 可以通过此项提取对应的值, 如:  item => item.id, 不影响list中的选项 */
    collector?: (item: any) => any;
    /** 用于对比的项 */
    list: any[];
}
export declare const listValidatorKey = "VerifyList";
/**
 * 检测两个集合的覆盖类型, 比如数组值是否包含另list中的所有项, 是否与list完全相等
 * */
export declare function list(opt: ListValidatorOpt): FormValidator;
export {};
//# sourceMappingURL=list.d.ts.map