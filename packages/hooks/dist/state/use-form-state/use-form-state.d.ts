import { AnyObject } from "@m78/utils";
/**
 * 表单组件的统一接口
 * @type <T> - value类型
 * */
export interface FormLike<T> {
    value?: T;
    onChange?: (value: T) => void;
    defaultValue?: T;
}
/**
 * 表单组件的统一接口， 包含额外参数
 * @type <T> - value类型
 * @type <Ext> - onChange接收的额外参数的类型
 * */
export interface FormLikeWithExtra<T, Ext = any> {
    value?: T;
    onChange?: (value: T, extra: Ext) => void;
    defaultValue?: T;
}
export interface SetFormState<T, Ext = any> {
    (patch: T | ((prev: T) => T), extra?: Ext): void;
}
export interface UseFormStateConfig {
    /** 'value' | 自定义获取value的key */
    valueKey?: string;
    /** 'defaultValue' | 自定义获取defaultValue的key */
    defaultValueKey?: string;
    /** 'onChange' | 自定义onChange的key */
    triggerKey?: string;
}
/**
 * 便捷的实现统一接口的受控、非受控表单组件, 也可用于任何需要受控、非受控状态的场景
 * @param props - 透传消费组件的props，该组件需要实现FormLike接口
 * @param defaultValue - 默认值，会作为value或defaultValue的回退值
 * @param config - 其他配置
 * */
export declare function useFormState<T, Ext = any>(props: AnyObject, defaultValue: T, config?: UseFormStateConfig): readonly [any, SetFormState<T, Ext>];
//# sourceMappingURL=use-form-state.d.ts.map