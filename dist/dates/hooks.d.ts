import moment, { unitOfTime } from 'moment';
import React from 'react';
import { ShareMetas, TimeValue } from './type';
/** 获取更新当前选择器数据和位置的一些操作函数 */
export declare function useDateUIController({ state, setState }: ShareMetas): {
    changeDate: (cType: 2 | 1, number?: number, dateType?: unitOfTime.Base) => void;
    prev: () => void;
    next: () => void;
    prevY: () => void;
    nextY: () => void;
    onCurrentChange: (mmt: moment.Moment) => void;
    toYear: () => void;
    toMonth: () => void;
    toDate: () => void;
    toTime: () => void;
};
/** 外部化的一些事件处理器 */
export declare function useHandlers({ hasTime, setValue, getCurrentTime, self, type, state, setState, nowM, props }: ShareMetas, { toTime }: ReturnType<typeof useDateUIController>): {
    onCheck: (dString: string, mmt: moment.Moment) => void;
    onCheckTime: ({ h, m, s }: TimeValue, isEnd?: boolean | undefined) => void;
    onCheckMonth: (dString: string, mmt: moment.Moment) => void;
    onCheckYear: (dString: string, mmt: moment.Moment) => void;
    onItemActive: (mmt?: moment.Moment | undefined) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onShow: () => void;
    reset: () => void;
    onHide: () => void;
};
