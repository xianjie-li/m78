import React from 'react';
import { Direction } from 'm78/util';
import { ScrollerProps, ScrollerRef } from './types';
export declare const defaultProps: {
    soap: number;
    threshold: number;
    rubber: number;
    hideScrollbar: boolean;
    webkitScrollBar: boolean;
    progressBar: boolean;
    scrollFlag: boolean;
    direction: Direction;
    pullUpThreshold: number;
    pullDownTips: boolean;
};
declare const Scroller: React.ForwardRefExoticComponent<ScrollerProps & React.RefAttributes<ScrollerRef>>;
export default Scroller;
