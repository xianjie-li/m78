import { AnyObject } from "@m78/utils";
/**
 * compare props and prev props, return changed props
 *
 * The main use case is to develop react components with the existing js version library
 *
 * return null if equal or first render
 * */
export declare function usePropsChange<T extends Object = AnyObject>(props: T, options?: {
    /** keys will skip */
    omit?: string[] | ((key: string, value: any) => boolean);
    /** keys will use deep equal */
    deepEqual?: string[] | ((key: string, value: any) => boolean);
}): null | T;
//# sourceMappingURL=use-props-change.d.ts.map