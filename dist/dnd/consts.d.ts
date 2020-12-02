/** 在此比例内的区域视为边缘 */
export declare const edgeRatio = 0.24;
/** 禁止拖动的元素tagName */
export declare const ignoreReg: RegExp;
/** 默认props */
export declare const defaultProps: {
    enableDrag: boolean;
    enableDrop: boolean;
};
/** 当独立配置了enableDrag的某一项时，其他方向的默认值 */
export declare const initEnableDragsDeny: {
    left: boolean;
    right: boolean;
    bottom: boolean;
    top: boolean;
    center: boolean;
    regular: boolean;
};
/** enableDrag为true时使用的方向配置 */
export declare const initEnableDragsPass: {
    left: boolean;
    right: boolean;
    bottom: boolean;
    top: boolean;
    center: boolean;
    regular: boolean;
};
/** 初始状态 */
export declare const initStatus: {
    dragOver: boolean;
    dragLeft: boolean;
    dragRight: boolean;
    dragBottom: boolean;
    dragTop: boolean;
    dragCenter: boolean;
    dragging: boolean;
    regular: boolean;
};
/** 提到utils */
export declare const raf: typeof window.requestAnimationFrame;
