import { PopperDirectionInfo, PopperDirectionInfoWidthVisible } from './types';
/**
 * 将PopperDirectionInfo的每个方向进行检测并转换为PopperDirectionInfoWidthVisible，返回转换后的原对象
 * */
export declare function patchVisible(directionInfo: PopperDirectionInfo, wrapEl?: HTMLElement): PopperDirectionInfoWidthVisible;
