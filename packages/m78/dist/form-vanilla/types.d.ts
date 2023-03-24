import { Verify, Config, Schema, RejectMeta } from "@m78/verify";
import { AnyFunction, EmptyFunction, NamePath, CustomEvent } from "@m78/utils";
export interface FormConfig extends Config {
    /** 描述表单值结构的对象 */
    schemas: FormSchemaWithoutName;
    /** {} | 默认值 */
    defaultValue?: any;
    /** 自定义内部的事件创建器(通常不需要关注, 用于实现ui层时扩展事件订阅器用法) */
    eventCreator?: AnyFunction;
    /** true | 值变更时是否自动触发verify */
    autoVerify?: boolean;
}
export interface FormInstance {
    /** 指定值是否与默认值相同 */
    getChanged(name: NamePath): boolean;
    /** 表单当前值是否与默认值相同 */
    getFormChanged(): boolean;
    /** 指定值是否被操作过 */
    getTouched(name: NamePath): boolean;
    /** 设置指定值touched为false */
    setTouched(name: NamePath, touched: boolean): void;
    /** 表单是否被操作过 */
    getFormTouched(): boolean;
    /** 设置整个表单的touched状态 */
    setFormTouched(touched: boolean): void;
    /** 获取当前数据 */
    getValues<T = any>(): T;
    /** 获取指定name的值 */
    getValue<T = any>(name: NamePath): T;
    /** 设置所有值 */
    setValues(values: any): void;
    /** 获取指定name的值 */
    setValue(name: NamePath, val: any): void;
    /** 获取当前的默认值 */
    getDefaultValues<T = any>(): T;
    /** 重新设置当前的默认值, 设置后, 下一次reset会使用此值 */
    setDefaultValues(values: any): void;
    /**
     * 获取变更的值, 没有变更时返回null
     * - 如果values本身是一个基础类型值, 则会在与默认值不同时直接返回
     * - 只有根级别的字段会参与对比, 如果根字段发生了变更, 其子级字段会一同返回
     * - values是对象是, 会将defaultValue中存在但被删除的字段设置为初始值(字符串为"", 其他类型为null)
     * */
    getChangedValues(): any | null;
    /** 获取对dynamic进行处理进行处理后的schema副本 */
    getSchemas(): FormSchemaWithoutName;
    /** 重新设置当前schemas */
    setSchemas(schema: FormSchemaWithoutName): void;
    /** 获取指定的schema */
    getSchema(name: NamePath): FormSchema | FormSchemaWithoutName | null;
    /** 获取错误信息 */
    getErrors(name: NamePath): RejectMeta;
    /** 重置表单状态 */
    reset(): void;
    /** 执行验证, 若验证通过则触发submit事件, 验证失败时与verify一样reject VerifyError类型 */
    submit(): Promise<void>;
    /** 执行校验, 未通过时promise会reject包含VerifyError类型的错误 */
    verify: (name?: NamePath) => Promise<void>;
    /** 获取表单配置 */
    getConfig(): FormConfig;
    /**
     * 获取指定list的数据, 若未在schema中配置为list则返回null. 根schema设置为list时, 可传入`[]`来获取
     * */
    getList<Item = any>(name: NamePath): Array<FormListItem<Item>> | null;
    /** 为list新增一项或多项, index为起始位置, 默认追加到结尾. 若name不是有效list或其他原因导致失败会将返回false */
    listAdd(name: NamePath, items: any | any[], index?: number): boolean;
    /** 移除list指定索引的元素 */
    listRemove(name: NamePath, index: number): boolean;
    /** 移动list的指定原素到另一位置 */
    listMove(name: NamePath, from: number, to: number): boolean;
    /** 交换list的两个元素 */
    listSwap(name: NamePath, from: number, to: number): boolean;
    /** 事件 */
    events: {
        /** 字段值或状态变更时, 这里是更新ui状态的理想位置 */
        update: CustomEvent<FormNamesNotify>;
        /** 字段值改变事件. 此外, update也会包含了change的触发时机 */
        change: CustomEvent<FormNamesNotify>;
        /** 提交事件 */
        submit: CustomEvent<EmptyFunction>;
        /** 验证失败的回调, 由 setValue 触发自动校验时, isValueChangeTrigger 为 true */
        fail: CustomEvent<(errors: RejectMeta, isValueChangeTrigger?: boolean) => void>;
        /** 重置事件 */
        reset: CustomEvent<EmptyFunction>;
    };
    /**
     * 创建用于update/change事件回调的过滤器, 帮助识别变更是否与当前name关联,
     * 传入deps时, 会在deps中指定的name触发事件时触发
     * */
    notifyFilter: (name: NamePath, notify: FormNamesNotify, deps?: NamePath[]) => FormNamesNotify;
    /** 内部使用的`@m78/verify` 实例 */
    verifyInstance: Verify;
}
/**
 * 用于update/change事件的回调
 * @param name 触发变更的name, 不传时表示更新所有字段
 * @param relation 为true时表示应该更新与当前name关联的值(父级/子级)
 * */
export declare type FormNamesNotify = (name?: NamePath, relation?: boolean) => void;
/** 描述schema的单个项 */
export interface FormSchema extends Schema {
    /** valid为false时, 该schema不会参与验证, 并且提交时会排除掉schema指向的值, 不可用于list项的第一级子项(应使用list相关api操作) */
    valid?: boolean;
    /** 动态设置其他参数 */
    dynamic?: (form: FormInstance) => Omit<FormSchemaWithoutName, "dynamic" | "name" | "list"> | void;
    /** 类型为数组、对象时, 对其结构进行验证 */
    schema?: FormSchema[];
    /** 验证值为array或object时, 子级的所有 数组项/对象值 必须与此Schema匹配, 如果该值的类型不为array或object，此配置会被忽略 */
    eachSchema?: FormSchemaPartial;
    /**
     * 设置该项为list项, 设置后可使用list系列的api对其子项进行新增/删除/排序等操作,
     * 若用于root项, 通过getList([])可获取根schema
     * */
    list?: boolean;
}
export interface FormListItem<Item = any> {
    /** 列表项的唯一key */
    key: string;
    /** 列表项的数据 */
    item: Item;
}
/** 不包含name的schema */
export declare type FormSchemaWithoutName = Omit<FormSchema, "name">;
/** 去除了部分配置的schema */
export declare type FormSchemaPartial = Omit<FormSchema, "name" | "list">;
/** 需要存储的一些内部值状态 */
export interface _State {
    name: NamePath;
    touched?: boolean;
    errors?: RejectMeta;
}
/** 用于记录值某些状态的内部对象 */
export interface _Store {
    [key: string]: _State;
}
export interface _Context {
    /** 默认值 */
    defaultValue: any;
    /** 当前values */
    values: any;
    /** 存储一些字段状态 */
    state: _Store;
    /** 为所有配置为list的schema项记录每一项的key信息 */
    listState: {
        [key: string]: {
            keys: string[];
            name: NamePath;
        };
    };
    /** 当前配置 */
    config: FormConfig;
    /** 当前schema */
    schema: FormSchemaWithoutName;
    /** form实例, 此时实例只能在实例方法间使用, 因为它是不完整的 */
    instance: FormInstance;
    /** 暂时锁定更新notify, 锁定期间不触发更新 */
    lockNotify: boolean;
    /** 暂时锁定更新notify, 锁定期间不触发更新 */
    lockListState: boolean;
    /** debounce版本的verify */
    debounceVerify: (name?: NamePath) => void;
    /** 用于帮助识别是否为setValue触发的 verify 调用 */
    isValueChangeTrigger: boolean;
    /** 获取当前schema并处理dynamic, 更新invalid等 */
    getFormatterSchemas(): [FormSchemaWithoutName, NamePath[]];
}
//# sourceMappingURL=types.d.ts.map