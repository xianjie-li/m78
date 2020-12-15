import React from 'react';
import { FlexWrapProps } from 'm78/layout';
/**
 * 传入onClick时, 会附加点击反馈效果
 * */
interface TileProps extends Omit<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, 'title'> {
    /** 主要内容 */
    title?: React.ReactNode;
    /** 次要内容 */
    desc?: React.ReactNode;
    /** 前导内容 */
    leading?: React.ReactNode;
    /** 尾随内容 */
    trailing?: React.ReactNode;
    /** 纵轴的对齐方式 */
    crossAlign?: FlexWrapProps['crossAlign'];
}
declare const Tile: ({ className, title, desc, leading, trailing, crossAlign, ...ppp }: TileProps) => JSX.Element;
export default Tile;
