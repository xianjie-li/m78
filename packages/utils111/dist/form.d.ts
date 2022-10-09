import { AnyObject } from "./common-type";
/**
 * 收集指定对象内带name属性的所有输入控件(input,select,textarea)的值，并按一定规则整合
 * checkbox: 选中值的value组成的数组，没有的话返回 []
 * radio: 选中项的value，没有value的话作为默认行为浏览器会返回 "on"
 * file: 选择的文件组成的数组，没有的话返回 []
 * 其他: 表单元素的value属性值
 * @param el
 * @returns object - 表单值
 */
export declare function form2obj(el: HTMLElement): AnyObject;
/**
 * 将一个object转为对应键值对的 FormData 对象
 * @param obj
 * @returns fd - FormData对象
 */
export declare function obj2FormData(obj: any): FormData;
//# sourceMappingURL=form.d.ts.map