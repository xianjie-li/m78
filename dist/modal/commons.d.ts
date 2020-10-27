import { TupleNumber } from './types';
/** 根据alignment值获取x, y值 */
export declare function calcAlignment(alignment: TupleNumber, screenMeta: TupleNumber): number[];
export declare const LAST_X_KEY = "FR_LAST_CLICK_POSITION_X";
export declare const LAST_Y_KEY = "FR_LAST_CLICK_POSITION_Y";
export declare function getLastXKey(): any;
export declare function getLastYKey(): any;
/**
 * 记录点击位置
 * */
export declare function registerPositionSave(): void;
