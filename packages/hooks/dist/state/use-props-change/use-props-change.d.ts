import { AnyObject } from "@m78/utils";
/**
 * compare props and prev props, return changed props
 *
 * The main use case is to develop react components with the existing js version library
 *
 * return null if equal or first render
 * */
export declare function usePropsChange<T extends Object = AnyObject>(props: T, options?: {
    /** only verify specified keys, not affected by exclude and skipReferenceType */
    include?: string[] | ((key: string, value: any) => boolean);
    /** skip specified keys check */
    exclude?: string[] | ((key: string, value: any) => boolean);
    /** use deep equal for specified keys */
    deepEqual?: string[] | ((key: string, value: any) => boolean);
    /** skip reference type check */
    skipReferenceType?: boolean;
}): null | T;
//# sourceMappingURL=use-props-change.d.ts.map