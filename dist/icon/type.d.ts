import { ComponentBasePropsWithAny } from '../types/types';
export interface IconProps extends ComponentBasePropsWithAny {
    /** 颜色 */
    color?: string;
    /** 大小通过字号跳转，与{ fontSize: number | string }等效 */
    size?: string | number;
    /** 是否添加旋转动画 */
    spin?: boolean;
}
