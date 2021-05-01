import { ComponentBaseProps } from 'm78/types';
interface DividerProps extends ComponentBaseProps {
    /** false | 设置为垂直分割线 */
    vertical?: boolean;
    /** 100%(横向) / 0.5(纵向) | 分割线尺寸 */
    width?: number;
    /** 0.5(横向) / 1.2em(纵向) | 分割线尺寸 */
    height?: number;
    /** 颜色 */
    color?: string;
    /** 12 | 间距 */
    margin?: number;
}
declare const Divider: ({ vertical, width, height, color, margin }: DividerProps) => JSX.Element;
export default Divider;
