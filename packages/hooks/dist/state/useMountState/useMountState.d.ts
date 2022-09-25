export interface UseMountStateConfig {
    /** true | 如果为true，在第一次启用时才真正挂载内容 */
    mountOnEnter?: boolean;
    /** false | 在关闭时卸载内容 */
    unmountOnExit?: boolean;
}
/**
 * 用于便捷的实现mountOnEnter/unmountOnExit接口
 * - 卸载的准确时机hook内是不能感知的，因为可能中间会存在动画或其他延迟行为，所以需要用户在正确时机调用unmount()通知卸载
 * */
export declare function useMountState(toggle: boolean, { mountOnEnter, unmountOnExit }?: UseMountStateConfig): readonly [boolean, () => void];
//# sourceMappingURL=useMountState.d.ts.map