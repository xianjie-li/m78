/// <reference types="react" />
/**
 *  实现类似getDerivedStateFromProps的效果，接收prop并将其同步为内部状态，
 *  当prop改变, 对prop和内部state执行深对比,对比结果为false时，会更新内部值 (基础类型使用 === 进行对比，性能更高，当必须使用引用类型时，尽量保持结构简单，减少对比次数)
 *  @param prop - 需要派生为state的prop
 * */
export declare function useDerivedStateFromProps<T>(prop: T): readonly [T, import("react").Dispatch<import("react").SetStateAction<T>>];
//# sourceMappingURL=use-derived-state-from-props.d.ts.map