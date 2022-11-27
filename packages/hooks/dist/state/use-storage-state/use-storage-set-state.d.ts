import { StateInitState, UseSetStateTuple, UseStorageStateOptions } from "../../index.js";
import { AnyObject } from "@m78/utils";
/**
 * useSetState的storage版本
 * */
export declare const useStorageSetState: <T extends AnyObject>(key: string, initState?: StateInitState<T>, options?: UseStorageStateOptions) => UseSetStateTuple<T>;
//# sourceMappingURL=use-storage-set-state.d.ts.map