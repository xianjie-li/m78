import { BoundSize } from "@m78/utils";

/** 表示一个选区 */
export interface Range extends BoundSize {
  id: string;
}

/**
 * 用于快速查找选区, 以选区的x/y轴位置作为存储key:
 * y_1000: [range1, range2, range3]
 * x_500: [range1, range2, range3]
 * */
interface SelectRange {
  [key: string]: Range[];
}

/** 实现矩形合并算法, 给定一组矩形选区, 将所有可合并为单个矩形的选区进行合并 */
export class _Ranger {
  ranges: Range[] = [];

  /**
   * 添加一个选区
   * - 若新增选区被某个选区覆盖, 则跳过
   * */
  add(range: Range) {}

  /**
   * 移除一个选区
   * - 移除选覆盖已有选区, 将所有涉及的已有选区拆分
   * - 移除选区与某个选区完全相同, 移除已有选区
   * */
  remove(range: Range) {}
}
