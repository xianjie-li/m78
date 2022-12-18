export interface UseMountStateConfig {
    /** 默认为 true, 表示在第一次开启时才真正挂载内容, 设置为 false 时, 内容会随组件在第一时间挂载 */
    mountOnEnter?: boolean;
    /** 默认为 false, 表示在关闭后是否保留内容节点, 如果内容频繁切换且需要维护状态, false是更明智的选择, 像 tooltip 这类低创建和销毁成本的功能则可以选择开启 */
    unmountOnExit?: boolean;
}
/**
 * 用于便捷的实现mountOnEnter/unmountOnExit接口
 * - 卸载的准确时机hook内是不能感知的，因为可能中间会存在动画或其他延迟行为，所以需要用户在正确时机调用unmount()通知卸载
 * */
export declare function useMountState(toggle: boolean, { mountOnEnter, unmountOnExit }?: UseMountStateConfig): readonly [boolean, () => void];
//# sourceMappingURL=use-mount-state.d.ts.map