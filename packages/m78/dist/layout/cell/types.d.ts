import { ComponentBaseProps, ComponentBasePropsWithAny } from "../../common";
import { FlexWrapProps } from "../types";
import { TupleNumber } from "@m78/utils";
import { ReactNode } from "react";
/**
 * CellCol的媒体查询配置
 * - 所有属性都支持在断点中以对象形式设置，如xs={{ col: 5, move: 2 }}
 * */
export interface CellColMediaQueryProps extends ComponentBaseProps {
    /** 占用栅格列数 1 ~ 12 */
    col?: number;
    /** 向左或向右偏移指定列数的距离, 影响文档流 */
    offset?: number;
    /** 向左或向右移动指定列数的距离, 不会影响原有文档流 */
    move?: number;
    /** 控制顺序 */
    order?: number;
    /** 手动指定该列的flex值 */
    flex?: string | number;
    /** 该项在交叉轴的对齐方式 */
    align?: FlexWrapProps["crossAlign"];
    /** 是否隐藏, 此属性与其他属性的继承顺序是相反的 */
    hidden?: boolean;
}
/** 表示列数或一个CellColMediaQueryProps配置 */
export declare type CellColNumberOrMediaQueryProps = number | CellColMediaQueryProps;
export interface CellRowProps extends FlexWrapProps {
    /** 间隔, 为数字时控制4个方向, 两个时分别控制纵横 */
    gutter?: number | TupleNumber;
    /** true | 是否允许换行 */
    wrap?: boolean;
}
export interface CellColProps extends CellColMediaQueryProps, ComponentBasePropsWithAny {
    /** 内容 */
    children?: ReactNode;
    /** 处于特定媒体类型下的配置 */
    xs?: CellColNumberOrMediaQueryProps;
    sm?: CellColNumberOrMediaQueryProps;
    md?: CellColNumberOrMediaQueryProps;
    lg?: CellColNumberOrMediaQueryProps;
    xl?: CellColNumberOrMediaQueryProps;
    xxl?: CellColNumberOrMediaQueryProps;
}
//# sourceMappingURL=types.d.ts.map