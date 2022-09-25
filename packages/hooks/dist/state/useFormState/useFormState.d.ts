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
    /**
     * false | 对value执行深度对比，以支持引用类型，你只会在极少的情况下使用到此配置
     * - 默认情况下，传入的value与上一个value全等判断成功时才会同步到本地并触发onChange，大部分时候这都没有问题，但是
     * 如果你内联式的传入`value={[1, 2, 3]}`, 会造成每一次render都触发onChange,
     * 此时你如果通过onChange更新状态则会造成内存泄露, 开启此项可以对引用类型的值进行深对比，从而避免这种情况
     * - 🎉如果循正常用例，将value放到useState等hook中进行管理，是不需要开启这个配置的，因为引用只会在变更时改变
     * - 如果value的层次结构过于复杂或者很大，不要使用此配置，因为大数据的深对比很消耗性能
     * */
    deep?: boolean;
}
/** 便捷的实现统一接口的受控、非受控表单组件, 也可用于任何需要受控、非受控状态的场景 */
export declare function useFormState<T, Ext = any>(
/** 透传消费组件的props，该组件需要实现FormLike接口 */
props: AnyObject, 
/** 默认值，会被value与defaultValue覆盖 */
defaultValue: T, 
/** 其他配置 */
config?: UseFormStateConfig): readonly [T, SetFormState<T, Ext>];
export { useFormState as useControllableValue };
//# sourceMappingURL=useFormState.d.ts.map