import { ReactRenderApiProps } from '@lxjx/react-render-api';
import { ComponentBaseProps } from '@/components/types/types';

export interface DrawerProps extends ComponentBaseProps, ReactRenderApiProps {
  /** 是否显示关闭按钮 */
  hasCloseIcon?: boolean;
  /** 方向 */
  direction?: 'bottom' | 'left' | 'right' | 'top';
  /** 全屏 */
  fullScreen?: boolean;
  /** 使drawer依附于它的父元素而不是body，确保父元素非常规定位元素 */
  inside?: boolean;
}
