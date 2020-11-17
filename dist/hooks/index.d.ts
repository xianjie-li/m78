/**
 * 将转入的开关状态在指定延迟后转为本地状态并在变更后同步
 * */
export declare function useDelayDerivedToggleStatus(toggle: boolean, delay?: number, options?: {
    /** 禁用延迟功能 */
    disabled?: boolean;
    /** 当数组值改变时，更新state */
    deps?: any[];
    /** 额外的延迟时间，用于对动画等消费的时间进行修正 */
    extraDelay?: number;
    /** true | 启用入场延迟 */
    leading?: boolean;
    /** false | 启用离场延迟 */
    trailing?: boolean;
}): boolean;
/**
 * 用于便捷的实现mountOnEnter/unmountOnExit接口
 * monkeySet会在何时的情况下才进行更新，可以在直接调用而不用编写验证代码
 * */
export declare function useMountInterface(init: boolean, { mountOnEnter, unmountOnExit }: {
    mountOnEnter?: boolean | undefined;
    unmountOnExit?: boolean | undefined;
}): readonly [boolean, (isMount: boolean) => void];
