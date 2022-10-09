/** any object */
export interface AnyObject {
    [key: string]: any;
}
/** any function */
export interface AnyFunction {
    (...arg: Array<any>): any;
}
/** empty function (no arguments, no returns) */
export interface EmptyFunction {
    (): void;
}
/** a number tuple */
export declare type TupleNumber = [number, number];
/** size */
export interface Size {
    width: number;
    height: number;
}
/** describe bound of object */
export interface Bound {
    left: number;
    top: number;
    bottom: number;
    right: number;
}
/** describe bound of the object */
export interface BoundSize {
    left: number;
    top: number;
    width: number;
    height: number;
}
/** object containing id field */
export interface IdProps {
    id: number;
}
/** object containing data field */
export interface DataProps {
    data: number;
}
//# sourceMappingURL=common-type.d.ts.map