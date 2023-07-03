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

/** tuple type */
export type Tuple<T> = [T, T];

/** a number tuple */
export type TupleNumber = Tuple<number>;

/** a string tuple */
export type TupleString = Tuple<string>;

/** T or T[] */
export type ArrayOrItem<T> = T | T[];

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

/** point describing location */
export type Point = TupleNumber;

/** object containing id field */
export interface IdProps {
  id: number;
}

/** object containing data field */
export interface DataProps {
  data: number;
}
