import { Seed, CreateSeedConfig } from "@m78/seed";
import React from "react";
import { AnyObject } from "@m78/utils";

export interface RCSeed<S> extends Seed<S> {
  /** 获取当前state的hook */
  useState: UseState<S>;
  /** 通过render children获取state */
  State: State<S>;
}

/**
 * 创建函数
 * */
export interface RCSeedCreator {
  <S extends AnyObject = AnyObject>(conf?: CreateSeedConfig<S>): RCSeed<S>;
}

export interface UseState<S> {
  <ScopeS = S>(
    /**
     * 从state中选择部分state并返回，如果省略参数，会返回整个state对象
     * - 如果未通过selector选取state，hook会在每一次state变更时更新，选取局部state时只在选取部分变更时更新
     * - 尽量只通过selector返回必要值，以减少hook所在组件的更新次数
     * - 如果选取的依赖值是对象等引用类型值，直接`({ xxx }) => xxx`返回即可，如果类似`state => ({ ...state.xxx })`这样更新引用地址，会造成不必要的更新
     * */
    selector?: (state: S) => ScopeS,
    /**
     * 默认每次state变更时会简单通过`===`比前后的值，如果相等则不会更新hook，你可以通过此函数来增强对比行为，如使用_.isEqual进行深对比
     * */
    equalFn?: (next: ScopeS, prev?: ScopeS) => boolean
  ): ScopeS;
}

/**
 * 泛型组件不能根据selector的返回进行类型推导, 这里该为any类型, 用户通过泛型组件手动声明或在children入参处声明类型
 * */
export type State<S> = {
  <ScopeS = S>(props: {
    /** 同 UseState 的 selector 参数 */
    selector?: (state: S) => ScopeS;
    /** 渲染函数, 接收state并自定义render */
    children: (state: ScopeS) => React.ReactNode;
    /** 同 UseState 的 equalFn 参数 */
    equalFn?: (next: ScopeS, prev?: ScopeS) => boolean;
  }): React.ReactElement | null;
};
