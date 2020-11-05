import { BoundWithVisible, PopperDirectionKeys, PopperDirectionInfoWidthVisible } from './types';
interface Options {
    /** 目标方向 */
    direction: PopperDirectionKeys;
    /** 前一个方向 */
    prevDirection: PopperDirectionKeys;
    /** 包含可见信息的所有方向信息 */
    directionInfo: PopperDirectionInfoWidthVisible;
}
/**
 * direction prevDirection directionInfo
 * 选取方向顺序:
 * 前一个方向 ->
 * 指定方向 ->
 * 根据前一个方向获取关联方向 ->
 * 指定方向获取关联方向 ->
 * 关联方向均不可用时, 获取第一个visible方向 ->
 * 无任何visible方向时，获取第一个非hidden方向 ->
 * 使用指定方向
 * */
export declare function selectDirection({ direction, prevDirection, directionInfo, }: Options): [BoundWithVisible, PopperDirectionKeys] | null;
export {};
