import React from 'react';
export interface MaskProps extends React.PropsWithoutRef<JSX.IntrinsicElements['div']> {
    /** 1 | 最大行数 */
    line?: number;
    /** 强制启用兼容模式 */
    forceCompat?: boolean;
    /** 禁用 */
    disabled?: boolean;
}
declare const Ellipsis: React.FC<MaskProps>;
export default Ellipsis;
