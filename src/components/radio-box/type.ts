import { FormLike } from '@lxjx/hooks';
import { CheckCustom } from '@lxjx/fr/lib/check';

export interface RadioBoxProps<Val> extends FormLike<Val> {
  /** 传递给原生组件 */
  name?: string;
  /** 禁用 */
  disabled?: boolean;
  /** 单行显示 */
  block?: boolean;
  /** 用于定制单选框样式 */
  customer?: CheckCustom;
  /** 透传至Check组件的选项 */
  options: Array<{
    label?: string;
    beforeLabel?: string;
    value: Val;
    disabled?: boolean;
  }>;
}
