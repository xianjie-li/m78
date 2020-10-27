import React from 'react';
import { ComponentBaseProps } from '../types/types';
export interface ArticleBoxProps extends ComponentBaseProps {
    /** 合法的html字符串 */
    html?: string;
    /** 可以传入react节点代替html */
    content?: React.ReactNode;
    /** 水印内容，不传时无水印 */
    watermark?: React.ReactNode;
}
declare const ArticleBox: React.FC<ArticleBoxProps>;
export default ArticleBox;
