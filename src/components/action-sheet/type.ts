import { ReactRenderApiProps } from '@lxjx/react-render-api';
import { FormLike } from '@lxjx/hooks';

export interface ActionSheetItem {
  /* 该选项标题 */
  name: string;
  /* 选项的唯一标识 */
  id: number;
  /* 详情 */
  desc?: string;
  /* 高亮该项 */
  highlight?: boolean;
  /* 禁用该项 */
  disabled?: boolean;
}

export interface ActionSheetProps extends ReactRenderApiProps, FormLike<ActionSheetItem> {
  /** 操作项配置 */
  options: ActionSheetItem[];
  /** 标题 */
  title: string;
  /** true | 是否开启选择模式，选择后需要确认才会进行关闭 */
  isConfirm?: boolean;
  /** isConfirm时，点击确认按钮后触发  */
  onConfirm?: (option: ActionSheetItem | undefined) => void;
  /** '确认' | 确认按钮文本 */
  confirmText?: string;
}
