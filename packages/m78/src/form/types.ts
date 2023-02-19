import { Verify, Config, Schema, RejectMeta } from "@m78/verify";
import { AnyFunction, EmptyFunction, NamePath, CustomEvent } from "@m78/utils";
import React from "react";

export interface FormConfig extends Config {
  /** 默认值 */
  defaultValue: any;
  /** 描述表单值结构的对象 */
  schema: FormSchemaWithoutName;
  /** 自定义内部的事件创建器(很少需要用到) */
  eventCreator?: AnyFunction;
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

  /** 重新设置当前的默认值, 设置后, 下一次reset调用会使用此值 */
  setDefaultValues(values: any): void;

  /** 获取当前schema副本并对dynamic进行处理 */
  getSchemas(): FormSchemaWithoutName;

  /** 重新设置当前schemas */
  setSchemas(schema: FormSchemaWithoutName): void;

  /** 获取指定的schema */
  getSchema(name: NamePath): FormSchema | FormSchemaWithoutName | null;

  /** 获取错误信息 */
  getErrors(name: NamePath): RejectMeta;

  /** 重置表单状态 */
  reset(): void;

  /** 执行验证, 若验证通过则触发submit事件 */
  submit(): Promise<void>;

  /** 执行校验, 未通过时promise会reject包含错误信息的数组 */
  verify: (name?: NamePath) => Promise<void>;

  /** 事件 */
  events: {
    /** 字段值或状态变更时, 这里是更新ui状态的理想位置 */
    update: CustomEvent<FormNamesNotify>;
    /** 字段值改变事件. 此外, update也会在change之后触发 */
    change: CustomEvent<FormNamesNotify>;
    /** 提交事件 */
    submit: CustomEvent<EmptyFunction>;
    /** 验证失败的回调 */
    fail: CustomEvent<(errors: RejectMeta) => void>;
    /** 重置事件 */
    reset: CustomEvent<EmptyFunction>;
  };

  /** 创建用于update/change事件回调的过滤器, 帮助识别变更是否与当前name关联 */
  notifyFilter: (name: NamePath, notify: FormNamesNotify) => FormNamesNotify;

  /** 内部使用的`@m78/verify` 实例 */
  verifyInstance: Verify;
}

/**
 * 用于update/change事件的回调
 * @param name 触发变更的name, 不传是时应更新所有字段
 * @param relation 为true时表示应该更新与当前name关联的值
 * */
export type FormNamesNotify = (name?: NamePath, relation?: boolean) => void;

export interface FormSchema extends Schema {
  /** valid为false时, 该schema不会参与验证, 并且提交时会排除掉schema指向的值 */
  valid?: boolean;
  /** 动态设置其他参数 */
  dynamic?: (form: FormInstance) => Omit<FormSchemaWithoutName, "dynamic">;
  /** 如果对象为嵌套结构(数组、对象)，对其执行嵌套验证 */
  schema?: FormSchema[];
  /** 验证值为array或object时, 所有 数组项/对象值 必须与此Schema匹配, 如果该值的类型不为array或object，此配置会被忽略 */
  eachSchema?: FormSchemaWithoutName;
}

export type FormSchemaWithoutName = Omit<FormSchema, "name">;

/** 需要存储的一些值状态 */
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
  /** 当前配置 */
  config: FormConfig;
  /** 当前schema */
  schema: FormSchemaWithoutName;
  /** form实例, 此时实例只能在实例方法间使用, 因为它是不完整的 */
  instance: FormInstance;
  /** 暂时锁定更新notify, 锁定期间不触发更新 */
  lockNotify: boolean;
  /** debounce版本的verify */
  debounceVerify: FormInstance["verify"];
  /** 获取当前schemas和所有valid为false的值 */
  getSchemasAndInvalid(): [FormSchemaWithoutName, NamePath[]];
}

export interface FormSchema {
  hidden?: boolean;
  disabled?: boolean;
}

export interface FormFieldProps {
  name: NamePath;
  children: (form: FormInstance) => React.ReactNode;
  onChange: () => void;
}

export interface FormValueRenderProps {
  name: NamePath;

  children(value: any): React.ReactNode;
}

export interface FormListProps {
  name: NamePath;
  children: (form: FormInstance, list: any, listOper: any) => React.ReactNode;
}

export interface FormRenderArgs {
  form: FormInstance;
  schema: FormSchema;
}
