import React from "react";
import { FormLike } from "@m78/hooks";
import { StatusKeys, SizeUnion } from "../common";
import { TupleNumber, ArrayOrItem } from "@m78/utils";

export type InputPropsBase = Omit<
  React.PropsWithoutRef<JSX.IntrinsicElements["input"]>,
  | "size"
  | "value"
  | "defaultValue"
  | "onChange"
  | "prefix"
  | "type"
  | "readOnly"
>;

export enum InputType {
  /** 普通文本框 */
  text = "text",
  /** 数字输入框(含小数) */
  number = "number",
  /** 整数输入框 */
  integer = "integer",
  /** 正整数 */
  positiveInteger = "positiveInteger",
  /** 密码输入框 */
  password = "password",
  /** 只能输入常规字符`A-Za-z0-9_` */
  general = "general",
}

export type InputTypeKeys = keyof typeof InputType;

export type InputTypeUnion = InputType | InputTypeKeys;

/**
 * 值拦截器, 用于在字符值发生改变之前对其进行阻断或变更
 *
 * @param opt.str - 当前触发改变的输入框值
 * @param opt.cursor - 当前值插入后的光标位置信息, [光标开始位置, 光标结束位置]
 * @param opt.prevCursor - 字符变更前的光标位置
 * @param opt.event - 触发变更的react合成事件, 如果事件是手动触发的, 不包含事件对象
 * @param opt.props - 组件接收的props
 * @return return - 返回, 有三种类型
 *
 * - string 拦截处理后的字符串值
 * - 字面量false 阻止本次更新
 * - 元组[string, TupleNumber] 第一项为变更后的字符串, 第二项为字符变更后的光标位置, 如果对字符值的长度进行了变更, 需要手动修正光标位置, 通常, 修正后的位置为起始位置前增加或减少的字符数
 * */
export type Interceptor = (meta: {
  str: string;
  cursor: TupleNumber;
  prevCursor: TupleNumber;
  event?: React.ChangeEvent<HTMLInputElement>;
  props: InputProps;
}) => string | false | [string, TupleNumber];

export interface InputProps extends FormLike<string>, InputPropsBase {
  /* # # # # # # # 功能 # # # # # # # */
  /**
   * InputType.text | 输入框类型
   * - 注意, 无论是否为数值类型, value/onChange api都是以字符串进行接收和响应, 这与web input的行为一致, 允许你输入超出js数值精度的数字, 如果需要onChange返回数值, 可以在onChange接收时通过Number包装器进行包装
   * */
  type?: InputTypeUnion;
  /** true | 是否自动显示清空按钮 */
  clear?: boolean;
  /** false | 设置为搜索框, 出现搜索按钮 */
  search?: boolean;
  /** 多行输入 */
  textArea?: boolean;
  /** true | textArea模式下，自动计算高度 */
  autoSize?: boolean;
  /** textArea ? true : false | 显示字符数统计 */
  charCount?: boolean;
  /** 指向内部input元素的ref */
  innerInputRef?: React.MutableRefObject<HTMLInputElement>;
  /** 指向内部容器元素的ref */
  innerWrapRef?: React.MutableRefObject<HTMLSpanElement>;
  /** 最大长度 */
  maxLength?: number;
  /** 只读 */
  readonly?: boolean;
  /** type为数值类的类型时, 设置最小值 */
  min?: number;
  /** type为数值类的类型时, 设置最大值 */
  max?: number;
  /** type为数值类的类型时, 显示步进器并以1为步进值, 如果传入数值则将其作为步进值 */
  stepper?: number | boolean;

  /* # # # # # # # 定制 # # # # # # # */
  /** 输入框状态，不同状态会以不同的功能色展示 */
  status?: StatusKeys;
  /** 组件尺寸 */
  size?: SizeUnion;
  /** 设置加载状态 */
  loading?: boolean;
  /** 设置阻塞型加载 */
  blockLoading?: boolean;
  /** true | 显示边框 */
  border?: boolean;
  /** 前置内容 */
  prefix?: React.ReactNode;
  /** 后置内容 */
  suffix?: React.ReactNode;

  /* # # # # # # # 事件 # # # # # # # */
  /** 点击搜索按钮/回车/清空时，触发 */
  onSearch?: (value: string) => void;
  /** 按下回车时触发 */
  onPressEnter?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** 点击清空按钮时触发 */
  onClear?: () => void;

  /* # # # # # # # 值拦截 # # # # # # # */
  /** 值拦截器, 用于在字符值发生改变之前对其进行阻断或变更 */
  interceptor?: ArrayOrItem<Interceptor>;
}

export interface _InputContext {
  textArea: boolean;
  autoSize: boolean;
  inputRef: InputProps["innerInputRef"];
  value: string;
  isDisabled: boolean;
  props: InputProps;

  manualChange(val: string): false | undefined;
}
