/**
 * 获取指定区间内的随机数(双开区间)
 * @param min - 最小值
 * @param max - 最大值
 * @return - 随机数
 *  */
export declare function getRandRange(min: number, max: number): number;
/**
 * 以指定精度锐化浮点数
 * @param num - 待处理的数字
 * @param precision - 1 | 精度
 * @return - 四舍五入到指定进度的小数
 * */
export declare function decimalPrecision(num: number, precision?: number): number;
/** 将一组数字或类数字相加、非数字视为0 */
export declare function sum(...nums: any[]): number;
/** 将一组数字或类数字相减 */
export declare function subtract(...nums: any[]): number;
/** 将弱数字转为数字，数字会原样返回 */
export declare function weakNumber(arg: any): number | null;
/** 将数值限定到指定区间 */
export declare function clamp(val: any, min: any, max: any): any;
//# sourceMappingURL=number.d.ts.map