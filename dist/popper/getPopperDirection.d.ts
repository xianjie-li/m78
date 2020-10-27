import React from 'react';
import { Size, Bound, PopperDirectionInfo } from './types';
/**
 * 根据popper尺寸，目标的位置信息计算气泡位置
 * @param popperSize - 包含气泡宽高信息的对象
 * @param target - 目标, 可以是描述位置尺寸的Bound对象、dom节点、指向dom节点的ref
 * @param options
 * @param options.offset - 0 | 偏移位置
 * @return - 包含所有方向气泡位置<Bound>的对象, 这些位置对于的是整个页面左上角开始
 * */
export declare function getPopperDirection(popperSize: Size, target: Bound | React.RefObject<HTMLElement> | HTMLElement, options?: {
    offset: number;
}): PopperDirectionInfo;
