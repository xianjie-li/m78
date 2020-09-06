import { ModalBaseProps } from 'm78/modal/types';

type OmitModalSpecific = Omit<
  ModalBaseProps,
  | 'baseZIndex'
  | 'namespace'
  | 'alignment'
  | 'animationType'
  | 'onRemove'
  | 'onRemoveDelay'
  | 'config'
  | 'innerRef'
>;

export interface DrawerProps extends OmitModalSpecific {
  /** 是否显示关闭按钮 */
  closeIcon?: boolean;
  /** 方向 */
  direction?: 'bottom' | 'left' | 'right' | 'top';
  /** 全屏 */
  fullScreen?: boolean;
}
