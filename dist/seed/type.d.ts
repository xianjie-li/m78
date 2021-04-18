import React from 'react';
import { ButtonPropsWithHTMLButton } from 'm78/button';
import { AuthKeys, Seed, CreateSeedConfig, Validators, ValidMeta, AuthConfig } from '@m78/seed/types';
import { AnyObject } from '@lxjx/utils';
declare module '@m78/seed' {
    interface Action extends ButtonPropsWithHTMLButton {
    }
}
/** 扩展seed api */
export interface ExpandSeed<D, V> extends Seed<D, V> {
    /** 权限检测组件 */
    Auth: React.FC<AuthProps<D, V>>;
    /** 创建带权限检测的高阶组件 */
    withAuth: <P>(conf: Omit<AuthProps<D, V>, 'children'>) => (Component: React.ComponentType<P>) => React.FC<P>;
    /** 权限验证hook */
    useAuth: UseAuth<D, V>;
    /** 获取当前deps的hook */
    useState: UseState<D>;
    /** 通过render children获取deps */
    State: State<D>;
}
/** 扩展seed create api */
export interface ExpandCreate {
    <D extends AnyObject = AnyObject, V extends Validators<D> = Validators<D>>(conf: CreateSeedConfig<D, V>): ExpandSeed<D, V>;
}
export interface UseAuth<D, V> {
    (keys: AuthKeys<V>, config?: {
        /** 是否启用 */
        disabled?: boolean;
    } & AuthConfig<D>): /** 所有未通过验证器返回的ValidMeta，如果为null则表示验证通过 */ ValidMeta[] | null;
}
export interface UseState<D> {
    <ScopeDep = any>(
    /**
     * 从deps中选择部分deps并返回，如果省略，会返回整个deps对象
     * - 如果未通过selector选取deps，hook会在每一次deps变更时更新，选取局部deps时只在选取部分变更时更新
     * - 尽量只通过selector返回必要值，以减少hook所在组件的更新次数
     * - 如果选取的依赖值是对象等引用类型值，直接`deps => deps.xxx`返回即可，如果类似`deps => ({ ...deps.xxx })`这样更新引用地址，会造成不必要的更新
     * */
    selector?: (deps: D) => ScopeDep, 
    /**
     * 每次deps变更时会简单通过`===`比前后的值，如果相等则不会更新hook，你可以通过此函数来增强对比行为，如使用_.isEqual进行深对比
     * - 如果在selector中正确保留了引用，很少会直接用到此参数
     * - 即使传入了自定义对比函数，依然会先执行 `===` 对比
     * */
    equalFn?: (next: ScopeDep, prev?: ScopeDep) => boolean): ScopeDep;
}
export interface State<D> {
    (props: {
        children: (deps: D) => React.ReactNode;
    }): React.ReactElement | null;
}
export declare enum AuthTypeEnum {
    feedback = "feedback",
    hidden = "hidden",
    popper = "popper"
}
export interface AuthProps<D, V> {
    /**
     * 权限验证通过后显示的内容
     * * 当type为tooltip时，必须传入单个子元素，并且保证其能正常接收事件
     * */
    children: React.ReactElement | (() => React.ReactElement);
    /**
     * 待验证的权限key组成的数组
     * * 只要有一个权限未验证通过，后续验证就会被中断，所以key的传入顺序最好按优先级从左到右，如: ['login', 'isVip']
     * * 可以通过二维数组来组合两个条件['key1', ['key2', 'key3']], 组合的条件表示逻辑 `or` */
    keys: AuthKeys<V>;
    /** 'feedback' | 反馈方式，占位节点、隐藏、气泡提示框, 当type为popper时，会自动拦截子元素的onClick事件, 同时，也需要确保子节点符合<Popper />组件的子节点规则 */
    type?: 'feedback' | 'hidden' | 'popper' | AuthTypeEnum;
    /** 传递给验证器的额外参数 */
    extra?: any;
    /**
     * 定制无权限时的反馈样式
     * @param rejectMeta - 未通过的权限的具体信息
     * @param props - 组件接收的原始props
     * @return - 返回用于显示的反馈节点
     * */
    feedback?: (rejectMeta: ValidMeta, props: AuthProps<D, V>) => React.ReactNode;
    /** 是否禁用，禁用时直接显示子节点 */
    disabled?: boolean;
    /** 局部验证器 */
    validators?: Validators<D>;
    /** 自定义显示的403 icon */
    icon?: React.ReactNode;
}
