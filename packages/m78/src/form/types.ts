import { Verify, Config, Schema, RejectMeta } from "@m78/verify";
import { AnyFunction, EmptyFunction, NamePath, CustomEvent } from "@m78/utils";

export interface FormConfig extends Config {
  /** 默认值 */
  defaultValue: any;
  /** 描述表单值结构的对象 */
  schema: FormSchemaWithoutName;
  /** 自定义内部的事件创建器(通常不需要关注, 用于实现ui层时扩展事件订阅器用法) */
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

  /** 执行验证, 若验证通过则触发submit事件, 验证失败时与verify一样reject VerifyError类型 */
  submit(): Promise<void>;

  /** 执行校验, 未通过时promise会reject包含VerifyError类型的错误 */
  verify: (name?: NamePath) => Promise<void>;

  /**
   * 获取指定list的数据, 若未在schema中配置为list则返回null, 若根schema设置为list, 可传入ROOT_SCHEMA_NAME来获取
   * */
  getList<Item = any>(
    name: NamePath
  ): Array<{
    /** 列表项的唯一key */
    key: string;
    /** 列表项的数据 */
    item: Item;
  }> | null;

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
  dynamic?: (
    form: FormInstance
  ) => Omit<FormSchemaWithoutName, "dynamic" | "name" | "list"> | void;
  /** 如果对象为嵌套结构(数组、对象)，对其执行嵌套验证 */
  schema?: FormSchema[];
  /** 验证值为array或object时, 所有 数组项/对象值 必须与此Schema匹配, 如果该值的类型不为array或object，此配置会被忽略 */
  eachSchema?: FormSchemaPartial;
  /**
   * 设置该项为list项, 设置后可使用list系列的api对其子项进行新增/删除/排序等操作
   * - 限制: 不能将eachSchema下的任意级子项设置为list, 若用于root项, 其子级不能再包含list项, list项通过getList(ROOT_SCHEMA_NAME)获取
   * */
  list?: boolean;
}

export type FormSchemaWithoutName = Omit<FormSchema, "name">;

export type FormSchemaPartial = Omit<FormSchema, "name" | "list">;

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
  /** 记录所有开启了list的schema */
  listNames: NamePath[];
  /** 为所有配置为list的schema项记录每一项的key信息 */
  listData: {
    [key: string]: string[];
  };
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

  /** 获取当前schema并处理dynamic, 更新invalid/list等 */
  getFormatterSchemas(): [FormSchemaWithoutName, NamePath[]];

  /** 根据当前记录的ctx.listNames同步listData配置, 确保所有项都被标注了key */
  syncLists(): void;

  /** 设置值, 可传入参数跳过列表状态同步 */
  setValuesInner(values: any, skipListSync?: boolean): void;

  /** 设置值, 可传入参数跳过列表状态同步 */
  setValueInner(name: NamePath, val: any, skipListSync?: boolean): void;
}
