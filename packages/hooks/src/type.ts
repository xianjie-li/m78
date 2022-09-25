/** state类hook通用初始值类型 */
export type StateInitState<T> = (() => T) | T;

/** 通用setState，接收对象 */
export interface SetState<T> {
  (patch: Partial<T> | ((prevState: T) => Partial<T>)): void;
}

/** 通用setState，接收常规值 */
export interface SetStateBase<T> {
  (patch: T | ((prevState: T) => T)): void;
}

/** useSetState通用返回 */
export type UseSetStateTuple<T> = [
  /** 当前状态 */
  T,
  /** 设置状态 */
  SetState<T>
];

/** useState通用返回 */
export type UseStateTuple<T> = [
  /** 当前状态 */
  T,
  /** 设置状态 */
  SetStateBase<T>
];
