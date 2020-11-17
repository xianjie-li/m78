import React from 'react';
import { ComponentBaseProps, Status } from 'm78/types';
export interface NoticeBarProps extends ComponentBaseProps {
    /** 关闭回调 */
    onClose?(): void;
    /** true | 是否显示关闭按钮 */
    closable?: boolean;
    /** true | 是否显示, 与受控组件的value一样的行为，当传入后，将显示/隐藏状态交由用户处理 */
    show?: boolean;
    /** 提示信息 */
    message: React.ReactNode;
    /** 详细说明文本 */
    desc?: React.ReactNode;
    /** 状态 */
    status?: Status;
    /** 定位到元素最顶部 */
    fixedTop?: boolean;
    /** 替换右侧关闭图标的内容 */
    right?: React.ReactNode;
}
declare const NoticeBar: React.FC<NoticeBarProps>;
export default NoticeBar;
