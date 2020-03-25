import { ComponentBasePropsWithAny } from '../types/types';

export interface CheckProps extends ComponentBasePropsWithAny {
  /** 显示的样式 */
  type?: 'radio' | 'checkbox' | 'switch';
  /** 在视觉上设置为 `待定`，用于全选等操作满足部分条件的情况， 只限于type=checkbox */
  pending?: boolean;
  /** 禁用 */
  disabled?: boolean;
  /** 渲染时自动获取焦点 */
  autoFocus?: boolean;
  /** 表单值，在onChange时以第二个参数传入 */
  value?: string;
  /** 后置label文本 */
  label?: string;
  /** 前置label文本 */
  beforeLabel?: string;
  /** type=switch时生效，设置开启状态的handle文本, 一个汉字或4个字母以内 */
  switchOn?: string;
  /** type=switch时生效，设置关闭状态的handle文本, 一个汉字或4个字母以内 */
  switchOff?: string;
  /** 单行显示 */
  block?: boolean;
  /** 同原生组件的`name` */
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean, value: string) => void;
}
