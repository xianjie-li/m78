import { SetState, StateInitState } from "../../index.js";
import { AnyObject } from "@m78/utils";
/**
 * 实现类似react类组件的setState Api
 * @param initState - 初始状态
 * @return tuple
 * @return tuple[0] - 当前状态
 * @return tuple[1] - 类似类组件的setState，不支持回调
 *
 * - 如果新状态对象第一层的所有值与之前相等, 则不会重新触发render
 * */
export declare const useSetState: <T extends AnyObject>(initState?: StateInitState<T>) => [T, SetState<T>];
//# sourceMappingURL=use-set-state.d.ts.map