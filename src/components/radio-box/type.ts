import { FormLike } from '@lxjx/hooks';
import { CheckCustom, CheckProps } from 'm78/check';
import { CheckOptionItem } from 'm78/check-box';

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
  options: Array<CheckOptionItem<Val>>;
  /** true | 是否启用外层的交互波纹效果，关闭后会让组件的整体大小更小 */
  waveWrap?: CheckProps<Val[]>['waveWrap'];
  /** 组件尺寸, 目前支持两个尺寸，默认/小尺寸 */
  size?: CheckProps<Val[]>['size'];
}
