import {
  FormConfig as VanillaFormConfig,
  FormInstance as VanillaFormInstance,
  FormNamesNotify as VanillaFormNamesNotify,
  FormSchema as VanillaFormSchema,
} from "../form-vanilla/index.js";
import React from "react";
import { EmptyFunction, NamePath } from "@m78/utils";
import { CustomEventWithHook, SetState } from "@m78/hooks";
import { RejectMeta } from "@m78/verify";
import { SizeUnion } from "../common/index.js";

/** 要剔除的原Config属性 */
export const _omitConfigs = [
  "eventCreator",
  "languagePack",
  "extendLanguagePack",
  "verifyFirst",
  "ignoreStrangeValue",
] as const;

type OmitType = typeof _omitConfigs[number];

/** 支持的布局类型 */
export enum FormLayoutType {
  horizontal = "horizontal",
  vertical = "vertical",
  tile = "tile",
}

export type FormLayoutTypeKeys = keyof typeof FormLayoutType;

export type FormLayoutTypeUnion = FormLayoutTypeKeys | FormLayoutType;

export type FormRegisterConfig = FormKeyCustomer & {
  component: React.ReactElement;
};

export interface FormConfig
  extends Omit<VanillaFormConfig, OmitType | "schemas">,
    FormProps {
  /* # # # # # # # 重写 # # # # # # # */
  /** 描述表单值结构的对象 */
  schemas?: FormSchemaWithoutName;
  /** 需要注册的组件, 可以直接是一个组件或包含配置项的对象 */
  components?: Record<string, FormRegisterConfig | React.ReactElement>;
}

export interface FormSchema
  extends Omit<
      VanillaFormSchema,
      "label" | "dynamic" | "schema" | "eachSchema"
    >,
    FormCommonProps {
  /* # # # # # # # 重写 # # # # # # # */
  /** 动态设置其他参数 */
  dynamic?: (
    form: FormInstance
  ) => Omit<FormSchemaWithoutName, "dynamic" | "name" | "list" | "deps"> | void;
  /** 类型为数组、对象时, 对其结构进行验证 */
  schema?: FormSchema[];
  /** 验证值为array或object时, 子级的所有 数组项/对象值 必须与此Schema匹配, 如果该值的类型不为array或object，此配置会被忽略 */
  eachSchema?: FormSchemaPartial;
}

/** 不包含name的schema */
export type FormSchemaWithoutName = Omit<FormSchema, "name">;

/** 去除了部分配置的schema */
export type FormSchemaPartial = Omit<FormSchema, "name" | "list">;

export interface FormInstance
  extends Omit<
    VanillaFormInstance,
    "getSchemas" | "setSchemas" | "getSchema" | "events" | "getConfig"
  > {
  /* # # # # # # # 重写 # # # # # # # */
  /** 获取对dynamic进行处理进行处理后的schema副本 */
  getSchemas(): FormSchemaWithoutName;

  /** 重新设置当前schemas */
  setSchemas(schema: FormSchemaWithoutName): void;

  /** 获取指定的schema */
  getSchema(name: NamePath): FormSchema | FormSchemaWithoutName | null;

  /** 获取表单配置 */
  getConfig(): FormConfig;

  /** 事件 */
  events: {
    /** 字段值或状态变更时, 这里是更新ui状态的理想位置 */
    update: CustomEventWithHook<VanillaFormNamesNotify>;
    /** 字段值改变事件. 此外, update也会包含了change的触发时机 */
    change: CustomEventWithHook<VanillaFormNamesNotify>;
    /** 提交事件 */
    submit: CustomEventWithHook<EmptyFunction>;
    /** 验证失败的回调, 由 setValue 触发自动校验时, isValueChangeTrigger 为 true */
    fail: CustomEventWithHook<
      (errors: RejectMeta, isValueChangeTrigger?: boolean) => void
    >;
    /** 重置事件 */
    reset: CustomEventWithHook<EmptyFunction>;
  };

  /* # # # # # # # 新增 # # # # # # # */
  /** 用于表示并绑定到表单字段 */
  Field: (props: FormFieldProps) => React.ReactElement;
  /** 渲染列表 */
  List: <Item = any>(props: FormListProps<Item>) => React.ReactElement;
}

/** FormProps中的所有key, 用于在分别根据Field/schema/config获取配置时检测是否可安全获取 */
export const _formPropsKeys = [
  "layoutType",
  "fieldCustomer",
  "bubbleFeedback",
  "maxWidth",
  "size",
  "disabled",
  "className",
  "style",
];

/** 样式相关的一些配置, 支持在 config/schema/field 中传入, 优先级从右到左 */
export interface FormProps {
  /** 布局类型 */
  layoutType?: FormLayoutTypeUnion;
  /** 自定义字段的默认样式, 也可以用于自定义value/onChange绑定等 */
  fieldCustomer?: FormRenderChildren;
  /** 使用气泡显示提示和错误文本, 此模式下 field 假设布局空间会非常紧凑, 使用者需要自行为 field 添加适当的边距 */
  bubbleFeedback?: boolean;
  /** 表单项的最大宽度, 用于防止宽度过大造成表单控件变形或不易操作 */
  maxWidth?: number | string;
  /** 尺寸(布局紧凑程度, 会同时向表单组件传递props.size, 需要表单控件支持才能正常启用) */
  size?: SizeUnion;
  /** 禁用表单, 不阻止提交 (需要表单组件支持disabled) */
  disabled?: boolean;
  /** 为 filed 根节点添加类名 */
  className?: string;
  /** 为 field 根节点添加样式 */
  style?: React.CSSProperties;
}

/** 在Field和schema中均可用的配置, FormProps的扩展, 优先级 Field > schema */
export interface FormCommonProps extends FormProps, FormKeyCustomer {
  /**
   * 表单项标题 */
  label?: React.ReactNode;
  /**
   * 需要渲染的表单控件
   * - 传入 ReactElement 时, 作为表单控件, 规则与FormFieldProps.children 相同
   * - 若为 string 类型, 则表示创建时注册的组件 key
   * */
  component?: React.ReactElement | string;
  /** component配置为string 时, 传递给 component 组件的 props */
  componentProps?: Record<string, any>;
  /** 额外显示的字段描述 */
  describe?: React.ReactNode;
  /** 隐藏表单 */
  hidden?: boolean;
  /**
   * 依赖的值, 若通过dynamic依赖了其他值, 需要在此处声明使字段能响应其他字段的变更
   * - 此配置是为了减少Field不必要的re-render, 使字段能够在关联字段变更时才更为精确的更新
   * */
  deps?: NamePath[];
  /** 跳过布局容器, 直接渲染表单组件, 配置此项后, 其他样式相关的配置不再有效 */
  noLayout?: boolean;
}

/** 用于支持定制 value/onChange/disabled/size key 的一些配置 */
export interface FormKeyCustomer {
  /** value |  用于受控绑定表单的props */
  valueKey?: string;
  /** onChange | 值变更的回调 */
  changeKey?: string;
  /** disabled | 配置通过什么key来禁用表单 */
  disabledKey?: string;
  /** size | 配置通过什么key来设置表单的尺寸 */
  sizeKey?: string;
  /** 默认取值方式为onChange(value), 可通过此项进行定制 */
  valueGetter?: (...value: any) => any;
  /** 如果某个表单控件不支持 size/disabled 等 key, 可以单独为字段配置此项来避免传入导致 react 产生警告 */
  ignoreBindKeys?: string | string[];
}

/** FormKeyCustomer的所有 key */
export const _formKeyCustomerKeys = [
  "valueKey",
  "changeKey",
  "disabledKey",
  "sizeKey",
  "valueGetter",
  "ignoreBindKeys",
];

/** 依次从 Field.props > schema > config 中获取通用配置 */
export interface FormCommonPropsGetter {
  <K extends keyof FormCommonProps>(key: K): FormCommonProps[K];
}

/** Filed Props */
export interface FormFieldProps extends FormCommonProps {
  /** 表单name */
  name: NamePath;
  /**
   * 挂载表单组件, 默认情况下需要表单组件支持value/onChange(value)接口, 可通过 valueKey/changeKey 等进行配置
   * 传入render 函数时, 与fieldCustomer等效
   * */
  children?: React.ReactElement | FormRenderChildren;
}

/**
 * List Props 相比 Field 少了一些配置项
 * - 目前, list 中传入 disabled 不会影响其子级, 后续可能会对此进行调整
 * */
export interface FormListProps<Item = any>
  extends Omit<
    FormFieldProps,
    | "children"
    | "component"
    | "componentProps"
    | "fieldCustomer"
    | keyof FormKeyCustomer
  > {
  children: FormListRenderChildren<Item>;
}

/** 作为 list 时, 应从 Filed 或 schema 等剔除的配置 */
export const _lisIgnoreKeys = [
  "component",
  "componentProps",
  "fieldCustomer",
  "valueKey",
  "changeKey",
  "disabledKey",
  "sizeKey",
  "valueGetter",
  "ignoreBindKeys",
];

/**
 * FormRenderChildren 入参
 * */
export interface FormCustomRenderArgs {
  /** 用于展开绑定到表单组件的props, 默认情况可能包含value/onChange/disabled等 */
  bind: any;
  /** Form实例 */
  form: FormInstance;
  /** 创建配置 */
  config: FormConfig;
  /** 传递给field的参数 */
  props: FormFieldProps;
  /** 用于获取通用配置FormCommonProps */
  getProps: FormCommonPropsGetter;
}

/**
 * FormListRenderChildren 入参
 * */
export interface FormListCustomRenderArgs<Item = any>
  extends Omit<FormCustomRenderArgs, "bind"> {
  /** 用于渲染列表 */
  render(
    renderCB: (meta: {
      /** 该项的值 */
      item: Item;
      /** 该项索引 */
      index: number;
      /** 将指定 name 前拼接上 List 父级的 name 后返回 */
      getName(name: NamePath): NamePath;
      /** 总长度 */
      length: number;
    }) => React.ReactElement
  ): React.ReactElement[];

  /** 为list新增一项或多项, index为起始位置, 默认追加到结尾. 若name不是有效list或其他原因导致失败会将返回false */
  add(items: Item | Item[], index?: number): boolean;

  /** 移除list指定索引的元素 */
  remove(index: number): boolean;

  /** 移动list的指定原素到另一位置 */
  move(from: number, to: number): boolean;

  /** 交换list的两个元素 */
  swap(from: number, to: number): boolean;
}

/**
 * Filed自定义渲染函数
 * */
export interface FormRenderChildren {
  (args: FormCustomRenderArgs): React.ReactNode;
}

/**
 * Filed自定义渲染函数
 * */
export interface FormListRenderChildren<Item = any> {
  (args: FormListCustomRenderArgs<Item>): React.ReactNode;
}

export interface _Context {
  config: FormConfig;
  form: FormInstance;
  /** 注册的组件 */
  components: Record<string, FormRegisterConfig | React.ReactElement>;
}

export interface _FieldContext {
  state: {
    schema: FormSchema | FormSchemaWithoutName | null;
    renderKey: number;
  };
  setState: SetState<_FieldContext["state"]>;
  isList: boolean;
  props: FormFieldProps;
  name: NamePath;
  wrapRef: React.MutableRefObject<HTMLDivElement>;
}
