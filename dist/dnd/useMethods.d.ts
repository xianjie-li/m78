import { Handler } from 'react-use-gesture/dist/types';
import { ChangeHandle, Share, EnableInfos } from './types';
export declare function useMethods(share: Share): {
    changeHandle: ChangeHandle;
    scrollParentsHandle: () => void;
    dragHandle: Handler<"drag">;
    enableDropInfo: EnableInfos;
};
export declare type UseMethodsReturns = ReturnType<typeof useMethods>;
