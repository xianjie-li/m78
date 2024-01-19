import {
  AnyFunction,
  AnyObject,
  CustomEvent,
  EmptyFunction,
  NameItem,
  NamePath,
} from "@m78/utils";

// @docusaurus/tsconfig@latest @docusaurus/core@latest @docusaurus/module-type-aliases@latest @docusaurus/preset-classic@latest @docusaurus/theme-common@latest  @docusaurus/theme-live-codeblock@latest @docusaurus/types@latest
//
export type { NamePath } from "@m78/utils";

/** Form 创建配置 */
export interface FormConfig {
  /**
   * false | 当其中一项验证失败后，停止后续字段的验证
   *
   * 对于嵌套验证器, 父级验证失败后会始终跳过子级
   * */
  verifyFirst?: boolean;
  /** 描述表单值结构的对象 */
  schemas: FormSchemaWithoutName;
  /** 默认值 */
  values?: any;
  /** 创建verify实例时为false, 否则为true | 值变更时是否自动触发verify */
  autoVerify?: boolean;
  /**
   * 语言包配置，错误模板可以是字符，也可以是接收Meta返回字符的函数
   * - 传入的配置对象会与默认语言配置深合并，所以如果只更改了部分错误模板，不会影响到其他模板
   * - 模板字符串会被注入以下变量, 通过{name}进行插值，如果插值语法和原有字符冲突，使用\\{name}来避免插值
   *    - name:  Schema.name
   *    - label: 对应Schema.label, 未传时与 name 相同，用于展示字段名时应始终使用此值
   *    - value: 字段值, 应只在验证值为基础类型时使用
   *    - type: 表示value类型的字符串
   * - 在特定的验证器中还会注入额外的插值，具体可以查看对应验证器的文档
   * */
  languagePack?: AnyObject;
  /** true | 配置是否忽略怪异值(schema中未声明的值), 关闭后未声明的值会产生错误 */
  ignoreStrangeValue?: boolean;
  /** 自定义内部的事件创建器(通常不需要关注, 用于实现ui层时扩展事件订阅器用法) */
  eventCreator?: AnyFunction;
}

/** 错误模板值允许的类型/验证器支持的返回类型 */
export type FormErrorTemplateType = string | ((meta: FormVerifyMeta) => string);

/** 错误模板插值对象, 也可作为验证器返回来扩展模板变量 */
export interface FormErrorTemplateInterpolate {
  /** 模板对象 */
  errorTemplate: FormErrorTemplateType;
  /** 要额外插入模板中的模板变量 */
  interpolateValues: AnyObject;
}

/**
 * 验证器 - 一个异步函数，接受三种返回值类型。
 * 第二和第三种用法用于自定义错误消息模板，通常只涉及验证器作者关注。
 * 1. 返回字符串：表示错误并将其作为反馈文本返回。字符串中可使用基本模板变量（参见 Config.languagePack）。
 * 2. 返回函数：函数接收 Meta，如果校验失败，按照第一种返回规则返回字符串，表示错误。通常用于 languagePack，很少使用。
 * 3. 包含错误模板和插值的 ErrorTemplateInterpolate 对象。用于在扩展 languagePack 并需要为自定义验证器添加插值时使用模板插值。
 *
 * 一些注意事项：
 * - 如果验证器内部发生异常，将捕获该异常，并使用 Error.message 作为反馈文本。
 * - 默认情况下，传递给验证器的所有值都是非空的。只有配置了 checkEmpty = true 的验证器才会接受并检测空值。
 */
export interface FormValidator {
  (meta: FormVerifyMeta):
    | Promise<void | FormErrorTemplateType | FormErrorTemplateInterpolate>
    | void
    | FormErrorTemplateType
    | FormErrorTemplateInterpolate;

  /** 可选的验证器标识，用于辅助识别 */
  key?: string;
  /** 默认情况下，如果待验证的值为空，则验证器将直接跳过。启用此选项可强制对空值进行验证 */
  checkEmpty?: boolean;
}

/** 在验证各个阶段传递验证信息的对象, 比如作为验证器参数, 或是包含在验证失败的错误信息中 */
export interface FormVerifyMeta {
  /** schema.name的字符串表示 */
  name: string;
  /** 当前项name */
  namePath: NamePath;
  /** 对应 schema.label, 未传时与 name 相同，用于展示字段名时应始终使用此值 */
  label: string;
  /** 被验证的值 */
  value: any;
  /** 所有值, 该字段是原对象的引用, 可能会在验证后被其他代码更改 */
  values: any;
  /** 当前项的schema */
  schema: FormSchema;
  /** 该次验证的schema */
  rootSchema: FormSchemaWithoutName;
  /** 值是否为empty, 即 undefined, null ,'', NaN, [], {}, 空白字符 中的任意一种 */
  isEmpty: boolean;
  /** 如果在嵌套结构中, 此项为其父级的name */
  parentNamePath?: NamePath;
  /** 根据name获取其value */
  getValueByName: (name: NamePath) => any;
  /** 当前form配置 */
  config: FormConfig & {
    languagePack: AnyObject;
  };

  /** 其他扩展字段 */
  [key: string]: any;
}

/** 验证失败时的反馈对象 */
export interface FormRejectMetaItem extends FormVerifyMeta {
  /** 验证失败的提示 */
  message: string;
}

/** 包含验证错误信息的数组, 每一项都表示一个验证错误 */
export type FormRejectMeta = FormRejectMetaItem[];

/** Form 实例 */
export interface FormInstance extends FormVerifyInstancePartial {
  /** 指定值是否与默认值相同 */
  getChanged(name: NamePath): boolean;

  /** 表单当前值是否与默认值相同 */
  getFormChanged(): boolean;

  /** 指定值是否被操作过 */
  getTouched(name: NamePath): boolean;

  /** 设置指定值touched状态 */
  setTouched(name: NamePath, touched: boolean): void;

  /** 表单是否被操作过 */
  getFormTouched(): boolean;

  /** 设置整个表单的touched状态 */
  setFormTouched(touched: boolean): void;

  /** 设置所有值 */
  setValues(values: any): void;

  /** 设置指定name的值 */
  setValue(name: NamePath, val: any): void;

  /** 获取当前数据, 获取的数据会根据当前的schema进行处理并过滤掉valid为false的值 */
  getValues<T = any>(): T;

  /** 获取当前的默认值 */
  getDefaultValues<T = any>(): T;

  /** 重新设置当前的默认值, 设置后, 下一次reset会使用此值 */
  setDefaultValues(values: any): void;

  /**
   * 获取变更的值, 没有变更时返回null
   * - 如果values本身是一个基础类型值, 则会在与默认值不同时直接返回
   * - 只有根级别的字段会参与对比, 如果根字段发生了变更, 其子级字段会一同返回
   * - values是对象时, 会将defaultValue中存在但被删除的字段返回为初始值(字符串为"", 其他类型为null)
   * */
  getChangedValues(): any | null;

  /** 获取错误信息, 注意: 此方法不会自动执行验证, 仅用于获取最后一次验证后的结果 */
  getErrors(name?: NamePath): FormRejectMeta;

  /** 重置表单状态 */
  reset(): void;

  /** 对当前values执行校验, 校验失败时, 数组首项为失败信息组成的的数组, 校验失败时为null, 第二项为参与验证的数据, 验证成功后会触发submit事件: */
  submit(): Promise<[FormRejectMeta | null, any]>;

  /**
   * 对当前values执行校验, 校验失败时, 数组首项为失败信息组成的的数组, 校验失败时为null, 第二项为参与验证的数据
   *
   * 若传入extraMeta, 会将其扩展到该次验证的 FormVerifyMeta 中, 然后你可以在验证器/验证错误信息等位置对其进行访问
   * */
  verify(
    name?: NamePath,
    extraMeta?: AnyObject
  ): Promise<[FormRejectMeta | null, any]>;

  /**
   * debounce版本的verify, 处理高频调用时可以使用, cb会在成功或失败时触发, 失败时包含错误信息
   *
   * 注意: 由于防抖机制, 连续调用时, 大部分验证都会被忽略, 所以cb不是必定触发的, 通常只有第一次和最后一次调用触发
   * */
  debounceVerify: (
    name?: NamePath,
    cb?: (error?: FormRejectMeta) => void
  ) => void;

  /**
   * 获取指定list的数据, 若未在schema中配置为list则返回null. 根schema设置为list时, 可传入`[]`来获取
   * */
  getList<Item = any>(name: NamePath): Array<FormListItem<Item>> | null;

  /** 为list新增一项或多项, index为添加到的索引位置, 默认追加到结尾. 若name不是有效list或其他原因导致失败会将返回false */
  listAdd(name: NamePath, items: any | any[], index?: number): boolean;

  /** 移除list指定索引的元素 */
  listRemove(name: NamePath, index: number): boolean;

  /** 移动list的指定元素到另一位置 */
  listMove(name: NamePath, from: number, to: number): boolean;

  /** 交换list的两个元素 */
  listSwap(name: NamePath, from: number, to: number): boolean;

  /** 事件 */
  events: {
    /** 字段值或状态变更时, 这里是更新ui状态的理想位置 */
    update: CustomEvent<FormNamesNotify>;
    /** 字段值改变事件. update事件包含了change的触发场景 */
    change: CustomEvent<FormNamesNotify>;
    /** 提交事件 */
    submit: CustomEvent<(values: any) => void>;
    /** 验证失败的回调, 由 setValue 触发自动校验时, isValueChangeTrigger 为 true */
    fail: CustomEvent<
      (errors: FormRejectMeta, isValueChangeTrigger?: boolean) => void
    >;
    /** 重置事件 */
    reset: CustomEvent<EmptyFunction>;
  };

  /**
   * 创建用于update/change事件回调的过滤器, 帮助识别变更是否与当前name关联,
   * 传入deps时, 会在deps中指定的name触发事件时触发
   * */
  notifyFilter: (
    name: NamePath,
    notify: FormNamesNotify,
    deps?: NamePath[]
  ) => FormNamesNotify;
}

/** 在form/verify实例中共享的api */
interface FormVerifyInstancePartial {
  /** 获取Form创建配置 */
  getConfig(): FormConfig;

  /** 获取指定name的值, 获取的值为对应的原始引用, 请勿作查询以外的操作 */
  getValue<T = any>(name: NamePath): T;

  /**
   * 获取对dynamic/valid/list等特殊项进行处理进行处理后的完整schema副本
   *
   * - 不可在 dynamic 函数中调用
   * */
  getSchemas(): FormSchemaWithoutName;

  /**
   * 获取对dynamic/valid/list等特殊项进行处理进行处理后的指定schema副本
   *
   * 如果在dynamic中调用并且获取的schema包含当前schema本身(直接获取或作为子项获取), 会导致递归, 可通过 skipChildren或withoutProcess选项处理
   * */
  getSchema(
    name: NamePath,
    opt?: {
      /** true | 不处理子项 */
      skipChildren?: boolean;
      /** 返回原始的schema配置, 不对eachSchema/dynamic等特殊配置进行处理 */
      withoutProcess?: boolean;
    }
  ): FormSchema | null;

  /**
   * 类似getSchemas(), 但会获取更多信息, 比如 invalidNames, 未来可能会增加更多
   * */
  getSchemasDetail(): {
    /** 与getSchemas()返回一致, 处理特殊选项后的schema */
    schemas: FormSchemaWithoutName;
    /** 所有invalid项的name */
    invalidNames: NamePath[];
  };

  /** 重新设置当前schemas */
  setSchemas(schema: FormSchemaWithoutName): void;
}

/** 验证实例 */
export interface FormVerifyInstance extends FormVerifyInstancePartial {
  /**
   * 对当前values执行校验, 校验失败时, 数组首项为失败信息组成的的数组, 校验失败时为null, 第二项为参与验证的数据
   *
   * 注意, 验证后, 需使用返回的data进行后续操作, 它是对schema.valid等项进行过滤处理后的数据
   *
   * 若传入extraMeta, 会将其扩展到该次验证的 FormVerifyMeta 中, 然后你可以在验证器/验证错误信息等位置对其进行访问
   * */
  check(
    values: any,
    extraMeta?: AnyObject
  ): Promise<[FormRejectMeta | null, any]>;
}

/**
 * 用于update/change事件的回调
 * @param name 触发变更的name, 不传时表示更新所有字段
 * @param relation 为true时表示应该更新与当前name关联的值(父级/子级)
 * */
export type FormNamesNotify = (name?: NamePath, relation?: boolean) => void;

/** 描述values结构的单个项 */
export interface FormSchema {
  /** 对应values中的key, 也用于从values中取值 */
  name: NameItem;
  /** 用于验证显示的字段名, 不传时取name的字符串表示 */
  label?: string;
  /**
   * 验证器或验证器数组。
   * - 如果待验证的值是空值，验证器的执行将被跳过，类似于其他库中的“可选字段”概念，只有字段存在值才进行校验，不存在则跳过。可以使用 `[required(), ...]` 将字段标记为必传。
   * - 如果同一组中前一个验证器异常，将停止执行后续验证器。
   * - 验证器的执行顺序与数组中的顺序相关，因此应该将更容易出错的验证器/非异步验证器放在前面。
   * - 在数组中传入的 `undefined`/`null` 值将被忽略。
   */
  validator?: FormValidator | (FormValidator | null | undefined)[];
  /** valid为false时, 该schema不会参与验证, 并且提交时会排除掉schema指向的值, 不可用于list项的第一级子项(应使用list相关api操作) */
  valid?: boolean;
  /** 动态设置其他参数 */
  dynamic?: (args: {
    /** 当前的验证实例 */
    form: FormVerifyInstance;
    /** 当前schema对应的name, 在eachSchema等包含不确定name路径的场景很有意义 */
    namePath: NameItem[];
  }) => FormSchemaWithout<"dynamic" | "name" | "list"> | void;
  /** 类型为数组、对象时, 对其结构进行验证 */
  schema?: FormSchema[];
  /** 验证值为array或object时, 子级的所有 数组项/对象值 必须与此Schema匹配, 如果该值的类型不为array或object，此配置会被忽略 */
  eachSchema?: FormSchemaWithout<"name" | "list">;
  /**
   * 设置该项为list项, 设置后可使用list系列的api对其子项进行新增/删除/排序等操作,
   * 若用于root项, 通过getList([])可获取根schema
   * */
  list?: boolean;
  /** 对值进行验证前进行转换, 不影响原始值, 仅用于验证 */
  transform?: (value: any) => any;
}

/** 表示List的一项 */
export interface FormListItem<Item = any> {
  /** 列表项的唯一key */
  key: string;
  /** 列表项的数据 */
  item: Item;
}

/** 不包含特定key的schema */
export type FormSchemaWithout<ExcludeKeys extends keyof FormSchema> = Omit<
  FormSchema,
  ExcludeKeys
>;

/** 不包含name的schema */
export type FormSchemaWithoutName = FormSchemaWithout<"name">;

/** 需要存储的一些内部值状态 */
export interface _State {
  name: NamePath;
  touched?: boolean;
  errors?: FormRejectMeta;
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
  /** 用于帮助识别是否为setValue触发的 verify 调用 */
  isValueChangeTrigger: boolean;
  /** 是否处于verify模式 */
  verifyOnly: boolean;

  /** 额外返回invalidNames的getSchemas */
  getFormatterSchemas(): [FormSchemaWithoutName, NamePath[]];

  /** 返回invalidNames的getSchema, 配置说明见 getSchema */
  getFormatterSchema(
    name: NamePath,
    skipChildren?: boolean,
    withoutProcess?: boolean
  ): [FormSchema | null, NamePath[]];

  /**
   * 返回与getFormatterSchema相同的schema和移除invalid项后的values
   *
   * 若未传入values, 则使用ctx.values, 返回的values为副本
   * */
  getFormatterValuesAndSchema(values?: any): [FormSchemaWithoutName, any];

  /**
   * 对Schema上的dynamic/eachSchema/validator进行处理, namePath为当前schema的name, skipEachSchema为true或当前项的valid=false时, 不处理eachSchema
   *
   * 处理流程:
   * - 处理当前 schema 的 dynamic 选项, 并用 dynamic 返回的选项合并到当前schema
   * - 处理eachSchema, 根据当前对应值的类型(数组/对象)为当前schema生成schema子配置
   * - 克隆validator, 并确保其为一个数组
   *
   * 该方法直接对原对象进行读写, 处理后的schema不再包含dynamic/eachSchema配置
   * */
  schemaSpecialPropsHandle(
    schema: FormSchemaWithoutName | FormSchema,
    namePath: NameItem[],
    skipEachSchema?: boolean
  ): void;

  /** 执行静态schema验证, schemas必须是经过schemaSpecialPropsHandle处理后的, 不包含eachSchema/dynamic 等配置 */
  schemaCheck(
    values: any,
    schemas: FormSchemaWithoutName,
    extraMeta?: AnyObject
  ): Promise<[FormRejectMeta | null, any]>;
}
