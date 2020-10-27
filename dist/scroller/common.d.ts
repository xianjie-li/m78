/**
 * 拖动位置超过threshold时，会出现橡皮效果，此函数用于计算出一个合理的弹性值
 * @param overSize - 超出threshold的值
 * @param maxSize - 允许超出的最大值
 * @param minFactor - 0 | 允许的最小弹性系数
 * @param initFactor - 初始弹性系数
 * */
export declare function rubberFactor(overSize: number, maxSize: number, minFactor?: number, initFactor?: number): number;
/**
 * 根据移动的offset和可移动总量计算出一个合理的旋转角度
 * @param offset - 当前距离
 * @param max - 最大移动距离
 * @param allTurn - 可选值的总圈数
 * */
export declare function offset2Rotate(offset: number, max: number, allTurn?: number): number;
/** 表示下拉刷新的所有阶段 */
export declare enum PullDownStatus {
    TIP = 0,
    RELEASE_TIP = 1,
    LOADING = 2,
    ERROR = 3,
    SUCCESS = 4
}
/** 表示上拉加载的所有阶段 */
export declare enum PullUpStatus {
    TIP = 0,
    LOADING = 1,
    NOT_DATA = 2,
    ERROR = 3,
    SUCCESS = 4
}
/** 下拉刷新各阶段的提示文本 */
export declare const pullDownText: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
};
/** 上拉加载各阶段的提示文本 */
export declare const pullUpText: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
};
