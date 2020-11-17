import React from 'react';
import { getDateCountDown } from '@lxjx/utils';
import { ComponentBaseProps } from 'm78/types';
interface ExtCls {
    /** 字符"xx天xx时xx分"中的xx所在包裹元素的额外类名 */
    textClassName?: string;
    /** 字符"xx天xx时xx分"中的天、时、分等描述文字的额外类名 */
    timeClassName?: string;
}
declare type TimeMeta = ReturnType<typeof getDateCountDown> & ExtCls;
export interface CountDownProps extends ExtCls, ComponentBaseProps {
    /** 目标时间 */
    date?: string | Date;
    /** 替换默认的序列化方法，返回字符串会替换默认的时间字符，调用triggerFinish()可以清除倒计时计时器 */
    format?(meta: TimeMeta, triggerFinish: () => void): string;
    /** 每次时间字符改变时触发 */
    onChange?(meta: TimeMeta): void;
    /** 更新频率，默认1000ms */
    frequency?: number;
}
declare const CountDown: React.FC<CountDownProps>;
export default CountDown;
