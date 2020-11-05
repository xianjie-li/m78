import React from 'react';
import { ComponentBaseProps } from '../types/types';
interface GridProps extends ComponentBaseProps {
    /** 子元素, 必须是一组可以挂在className和style的元素 */
    children: React.ReactElement | React.ReactElement[];
    /** 总列数 */
    count?: number;
    /** 1 | 网格项的宽高比 */
    aspectRatio?: number;
    /** 网格项的高度, 与aspectRatio选用一种 */
    size?: number;
    /** 网格项间的间距, 优先级小于单独设置的 */
    spacing?: number;
    /** 主轴间距 */
    mainSpacing?: number;
    /** 交叉轴间距 */
    crossSpacing?: number;
    /** true | 是否启用边框 */
    border?: boolean;
    /** 'rgba(0, 0, 0, 0.15)' | 边框颜色 */
    borderColor?: string;
    /** true | 当最后一行不能填满时，是否以空项占位 */
    complete?: boolean;
    /** 表格项的类名 */
    contClassName?: string;
    /** 表格项的样式 */
    contStyle?: React.CSSProperties;
}
declare const Grid: {
    (props: GridProps & {
        count: number;
        children: React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>[];
        aspectRatio: number;
        border: boolean;
        borderColor: string;
    }): JSX.Element;
    defaultProps: {
        count: number;
        children: React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>[];
        aspectRatio: number;
        border: boolean;
        borderColor: string;
    };
};
export default Grid;
