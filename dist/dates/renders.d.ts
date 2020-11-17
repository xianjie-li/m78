/// <reference types="react" />
import { ShareMetas } from './type';
import { useDateUIController, useHandlers } from './hooks';
/**  渲染选择结果 */
export declare function staticRenderCheckedValue({ self, hasTime, type, value, props }: ShareMetas, { toTime }: ReturnType<typeof useDateUIController>): JSX.Element | undefined;
/** 日期选择 */
export declare function staticRenderDate({ self, state, nowM, props }: ShareMetas, { onCurrentChange, prevY, prev, toYear, toMonth, nextY, next, }: ReturnType<typeof useDateUIController>, { onCheck, onItemActive }: ReturnType<typeof useHandlers>): JSX.Element;
/** 月份选择 */
export declare function staticRenderMonth({ self, state, nowM, props }: ShareMetas, { prevY, toYear, nextY }: ReturnType<typeof useDateUIController>, { onCheckMonth, onItemActive }: ReturnType<typeof useHandlers>): JSX.Element;
/** 年份选择 */
export declare function staticRenderYear({ self, state, nowM, props }: ShareMetas, { changeDate }: ReturnType<typeof useDateUIController>, { onCheckYear, onItemActive }: ReturnType<typeof useHandlers>): JSX.Element;
export declare function staticRenderTime({ props, self, getCurrentTime }: ShareMetas, { onCheckTime }: ReturnType<typeof useHandlers>): JSX.Element;
export declare function staticRenderTabs({ self, state, type, hasTime, props }: ShareMetas, { toYear, toMonth, toDate, toTime }: ReturnType<typeof useDateUIController>): JSX.Element;
export declare const renderPresetDates: ({ type, hasTime, setValue, props }: ShareMetas) => JSX.Element | undefined;
