import React from 'react';
export interface MaskProps extends React.PropsWithoutRef<JSX.IntrinsicElements['div']> {
    /** 1 | 最大行数 */
    line?: number;
    /** 兼容模式时默认适合亮色主题，通过此项设置为暗色 */
    dark?: boolean;
    /** 强制启用兼容模式 */
    forceCompat?: boolean;
    /** 禁用 */
    disabled?: boolean;
}
declare const Ellipsis: React.FC<MaskProps>;
export default Ellipsis;
