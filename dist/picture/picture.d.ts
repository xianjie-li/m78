import React from 'react';
import { ComponentBaseProps } from 'm78/types';
interface PictureProps extends ComponentBaseProps, React.PropsWithoutRef<JSX.IntrinsicElements['span']> {
    /** 图片的地址 */
    src?: string;
    /** 同 img alt */
    alt?: string;
    /** 使用指定的图片替换默认的错误占位图 */
    errorImg?: string;
    /** 使用指定的文本节点替换默认的错误占位图 */
    errorNode?: React.ReactNode;
    /** 挂载到生成的img上的className */
    imgClassName?: string;
    /** 挂载到生成的img上的style */
    imgStyle?: React.CSSProperties;
    /** 默认提供了imgClassName、imgStyle、alt、src几个最常用的参数，其他需要直接传递给图片的props通过此项传递 */
    imgProps?: React.PropsWithRef<JSX.IntrinsicElements['img']>;
}
declare const Picture: React.FC<PictureProps>;
export default Picture;
