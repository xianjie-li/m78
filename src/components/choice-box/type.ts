import { FormLikeWithExtra } from '@lxjx/hooks';
import { ComponentBaseProps } from '../types/types';

export interface ChoiceProps extends ComponentBaseProps {
  /** 选择器类型 */
  type?: 'radio' | 'checkbox';
  /** 在视觉上设置为 `待定`，用于全选等操作满足部分条件的情况 */
  pending?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  label?: string;
  buttonStyle?: boolean;
  value?: string;

  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean, value: string) => void;
}
