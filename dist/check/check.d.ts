import React from 'react';
import { CheckProps } from './type';
interface ShareMeta {
    focus: boolean;
    checked: boolean;
    disabled: boolean;
}
/**
 * 定制Check样式时会用到的接口
 * @param meta - 定制时会用到的一些组件内部状态
 * @param checkProps - Check组件接收到的prop
 * */
export interface CheckCustom {
    (meta: ShareMeta, checkProps: CheckProps<any>): React.ReactElement;
}
declare const Check: {
    <Val extends unknown = undefined>(_props: CheckProps<Val>): JSX.Element | null;
    Group({ children }: {
        children: React.ReactNode;
    }): JSX.Element;
};
export default Check;
